import { daysOfWeek, lessonSlots } from '@/utils/schedule-data'

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * Генерация расписания на несколько недель (семестр)
 * @param {Object} params
 * @param {Array} params.groups
 * @param {Array} params.subjects
 * @param {Array} params.teachers
 * @param {Array} params.auditories
 * @param {number} [params.numWeeks=16] — количество недель
 * @returns {Array} расписание с полем week
 */
export function generateSchedule({ groups, subjects, teachers, auditories, numWeeks = 16 }) {
  const result = []

  const slots = []
  for (const day of daysOfWeek) {
    for (const slot of lessonSlots) {
      slots.push({ day: day.id, slot: slot.id })
    }
  }

  shuffle(slots)

  const state = {
    used: [] // {week, day, slot, groupId, teacherId, auditoriumId}
  }

  for (const group of groups) {
    for (const subject of subjects) {
      // Проверяем, если у предмета есть ограничения по группам
      if (subject.groups && subject.groups.length > 0 && !subject.groups.includes(group.id)) continue

      const availableTeachers = teachers.filter(t => Array.isArray(t.subjects) && t.subjects.includes(subject.id))
      if (availableTeachers.length === 0) continue

      const teacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)]

      const aud = auditories.find(a =>
        a.capacity >= (group.size || 0) &&
        (
          !subject.allowedAuditoryTypes ||
          subject.allowedAuditoryTypes.length === 0 ||
          subject.allowedAuditoryTypes.includes(a.type)
        )
      )
      if (!aud) continue

      const hours = subject.hours || 1

      for (let w = 1; w <= numWeeks; w++) {
        for (let i = 0; i < hours; i++) {
          const freeSlot = slots.find(({ day, slot }) => {
            return !state.used.some(u =>
              u.week === w &&
              u.day === day &&
              u.slot === slot &&
              (u.groupId === group.id || u.teacherId === teacher.id || u.auditoriumId === aud.id)
            )
          })

          if (!freeSlot) continue

          result.push({
            groupId: group.id,
            subjectId: subject.id,
            teacherId: teacher.id,
            auditoriumId: aud.id,
            week: w,
            day: freeSlot.day,
            slot: freeSlot.slot,
            type: 'Занятие'
          })

          state.used.push({
            week: w,
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
