import { daysOfWeek, lessonSlots } from '@/utils/schedule-data'

function shuffle(array) {
  // простой shuffle Фишера-Йетса
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function generateSchedule({ groups, subjects, teachers, auditories }) {
  const result = []

  // Формируем все возможные слоты (день + пара)
  const slots = []
  for (const day of daysOfWeek) {
    for (const slot of lessonSlots) {
      slots.push({ day: day.id, slot: slot.id })
    }
  }

  // Перемешиваем слоты, чтобы распределение было случайным
  shuffle(slots)

  // Состояние занятости: по группе, учителю, аудитории
  const state = {
    used: [] // элементы {day, slot, groupId, teacherId, auditoriumId}
  }

  for (const group of groups) {
    for (const subject of subjects) {
      // Фильтруем учителей, которые ведут этот предмет
      const availableTeachers = teachers.filter(t => Array.isArray(t.subjects) && t.subjects.includes(subject.id))

      if (availableTeachers.length === 0) continue

      // Рандомный учитель из доступных
      const teacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)]

      // Поиск аудитории с достаточной вместимостью
      const aud = auditories.find(a => a.capacity >= (group.size || 0))
      if (!aud) continue

      // Задаём пары занятий, можно расширять/менять
      const pairs = [
        { type: 'lecture', count: 1 },
        { type: 'practice', count: 2 }
      ]

      for (const { type, count } of pairs) {
        for (let i = 0; i < count; i++) {
          // Ищем свободный слот, где ни группа, ни учитель, ни аудитория не заняты
          const freeSlot = slots.find(({ day, slot }) => {
            return !state.used.some(u =>
              u.day === day && u.slot === slot &&
              (u.groupId === group.id || u.teacherId === teacher.id || u.auditoriumId === aud.id)
            )
          })

          if (!freeSlot) {
            // Свободных слотов нет — можно логировать, если нужно
            // console.warn(`Нет свободных слотов для группы ${group.name}, предмета ${subject.name}`)
            continue
          }

          // Создаём запись в расписании
          const entry = {
            groupId: group.id,
            subjectId: subject.id,
            teacherId: teacher.id,
            auditoriumId: aud.id,
            day: freeSlot.day,
            slot: freeSlot.slot,
            type
          }

          result.push(entry)

          // Отмечаем слот занятым для группы, учителя, аудитории
          state.used.push({
            day: freeSlot.day,
            slot: freeSlot.slot,
            groupId: group.id,
            teacherId: teacher.id,
            auditoriumId: aud.id
          })
        }
      }
    }
  }

  return result
}
