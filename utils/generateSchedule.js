export function generateSchedule({ groups, subjects, teachers, auditories }) {
  const result = []

  const slots = []
  for (const day of daysOfWeek) {
    for (const slot of lessonSlots) {
      slots.push({ day: day.id, slot: slot.id })
    }
  }
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
  shuffle(slots)

  const state = {
    used: []
  }

  for (const group of groups) {
    for (const subject of subjects) {
      if (subject.groups && !subject.groups.includes(group.id)) {
        continue
      }

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

      for (let i = 0; i < hours; i++) {
        const freeSlot = slots.find(({ day, slot }) => {
          return !state.used.some(u =>
            u.day === day && u.slot === slot &&
            (u.groupId === group.id || u.teacherId === teacher.id || u.auditoriumId === aud.id)
          )
        })

        if (!freeSlot) {
          // Нет свободных слотов для этого часа
          continue
        }

        const entry = {
          groupId: group.id,
          subjectId: subject.id,
          teacherId: teacher.id,
          auditoriumId: aud.id,
          day: freeSlot.day,
          slot: freeSlot.slot,
          type: 'Занятие' // можно поменять или сделать динамическим
        }

        result.push(entry)

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

  return result
}
