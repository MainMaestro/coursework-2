export function generateSchedule({ groups, subjects, teachers, auditories, fixedEntries = [] }) {
  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const allSlots = [1, 2, 3, 4, 5, 6, 7];
  const earlySlots = [1, 2, 3, 4];

  const schedule = [...fixedEntries]; // уже зафиксированные занятия

  const groupsMap = new Map(groups.map(g => [g.id, g]));
  const subjectsMap = new Map(subjects.map(s => [s.id, s]));
  const teachersMap = new Map(teachers.map(t => [t.id, t]));
  const auditoriesMap = new Map(auditories.map(a => [a.id, a]));

  const busyAuditories = {};
  const busyTeachers = {};
  const busyGroups = {};

  for (const day of daysOfWeek) {
    busyAuditories[day] = {};
    busyTeachers[day] = {};
    busyGroups[day] = {};
    for (const slot of allSlots) {
      busyAuditories[day][slot] = new Set();
      busyTeachers[day][slot] = new Set();
      busyGroups[day][slot] = new Set();
    }
  }

  // Пометить занятые слоты из fixedEntries
  for (const entry of fixedEntries) {
    busyAuditories[entry.day][entry.slot].add(entry.auditoryId);
    busyTeachers[entry.day][entry.slot].add(entry.teacherId);
    busyGroups[entry.day][entry.slot].add(entry.groupId);
  }

  const assignments = [];

  for (const group of groups) {
    for (const subject of subjects) {
      if (subject.groupIds?.length > 0 && !subject.groupIds.includes(group.id)) continue;
      const subjectTeachers = teachers.filter(t => t.subjects.includes(subject.id));
      if (subjectTeachers.length === 0) continue;

      for (const teacher of subjectTeachers) {
        const alreadyAssigned = fixedEntries.filter(e => e.groupId === group.id && e.subjectId === subject.id).length;
        const hoursLeft = Math.max(subject.hours - alreadyAssigned, 0);
        if (hoursLeft > 0) {
          assignments.push({
            groupId: group.id,
            subjectId: subject.id,
            teacherId: teacher.id,
            hours: hoursLeft,
          });
        }
      }
    }
  }

  function canAssignAuditory(auditory, groupSize, day, slot) {
    const busyInSlot = schedule.filter(e => e.day === day && e.slot === slot && e.auditoryId === auditory.id);
    if (busyInSlot.length === 0) return auditory.capacity >= groupSize;
    if (!auditory.isShared) return false;
    let totalSize = groupSize;
    for (const entry of busyInSlot) {
      const otherGroup = groupsMap.get(entry.groupId);
      if (otherGroup) totalSize += otherGroup.size;
    }
    return auditory.capacity >= totalSize;
  }

  function isTeacherFree(teacherId, day, slot) {
    return !busyTeachers[day][slot].has(teacherId);
  }

  function isGroupFree(groupId, day, slot) {
    return !busyGroups[day][slot].has(groupId);
  }

  function findAuditory(subject, group, day, slot) {
    for (const auditory of auditories) {
      if (!subject.allowedAuditoryTypes.includes(auditory.type)) continue;
      if (!canAssignAuditory(auditory, group.size, day, slot)) continue;
      return auditory;
    }
    return null;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function isEarlySlotsFull(groupId) {
    for (const day of daysOfWeek) {
      for (const slot of earlySlots) {
        if (!busyGroups[day][slot].has(groupId)) return false;
      }
    }
    return true;
  }

  function countSubjectPerDay(groupId, subjectId, day) {
    return schedule.filter(
      e => e.groupId === groupId && e.subjectId === subjectId && e.day === day
    ).length;
  }

  for (const assignment of assignments) {
    let hoursLeft = assignment.hours;
    const group = groupsMap.get(assignment.groupId);
    const subject = subjectsMap.get(assignment.subjectId);
    const teacherId = assignment.teacherId;

    outerLoop:
    while (hoursLeft > 0) {
      const allowLateSlots = isEarlySlotsFull(group.id);
      const slotsToUse = allowLateSlots ? allSlots : earlySlots;
      let assigned = false;

      for (const day of shuffle([...daysOfWeek])) {
        const subjectToday = countSubjectPerDay(group.id, subject.id, day);
        if (subjectToday >= 1 && hoursLeft < assignment.hours) continue;
        if (subjectToday >= 2) continue;

        for (const slot of slotsToUse) {
          if (!isTeacherFree(teacherId, day, slot)) continue;
          if (!isGroupFree(group.id, day, slot)) continue;

          const auditory = findAuditory(subject, group, day, slot);
          if (!auditory) continue;

          schedule.push({
            groupId: group.id,
            subjectId: subject.id,
            teacherId,
            auditoryId: auditory.id,
            day,
            slot
          });

          busyAuditories[day][slot].add(auditory.id);
          busyTeachers[day][slot].add(teacherId);
          busyGroups[day][slot].add(group.id);

          hoursLeft--;
          assigned = true;
          if (hoursLeft <= 0) break outerLoop;
          break;
        }
      }

      if (!assigned) {
        console.warn(`Не удалось назначить все часы предмета "${subject.name}" группе "${group.name}". Осталось: ${hoursLeft}`);
        break;
      }
    }
  }

  function compactSchedule() {
    for (const day of daysOfWeek) {
      const groupsInDay = new Set(schedule.filter(e => e.day === day).map(e => e.groupId));
      for (const groupId of groupsInDay) {
        const lessons = schedule
          .filter(e => e.day === day && e.groupId === groupId)
          .sort((a, b) => a.slot - b.slot);

        const lessonsBySubject = new Map();
        for (const lesson of lessons) {
          if (!lessonsBySubject.has(lesson.subjectId)) lessonsBySubject.set(lesson.subjectId, []);
          lessonsBySubject.get(lesson.subjectId).push(lesson);
        }

        for (const [subjectId, lessonsArr] of lessonsBySubject.entries()) {
          lessonsArr.sort((a, b) => a.slot - b.slot);

          for (let i = 1; i < lessonsArr.length; i++) {
            const currentLesson = lessonsArr[i];
            for (let targetSlot = lessonsArr[0].slot; targetSlot < currentLesson.slot; targetSlot++) {
              if (
                !busyGroups[day][targetSlot].has(currentLesson.groupId) &&
                !busyTeachers[day][targetSlot].has(currentLesson.teacherId) &&
                !busyAuditories[day][targetSlot].has(currentLesson.auditoryId)
              ) {
                busyGroups[day][currentLesson.slot].delete(currentLesson.groupId);
                busyTeachers[day][currentLesson.slot].delete(currentLesson.teacherId);
                busyAuditories[day][currentLesson.slot].delete(currentLesson.auditoryId);

                busyGroups[day][targetSlot].add(currentLesson.groupId);
                busyTeachers[day][targetSlot].add(currentLesson.teacherId);
                busyAuditories[day][targetSlot].add(currentLesson.auditoryId);

                currentLesson.slot = targetSlot;
                lessonsArr.sort((a, b) => a.slot - b.slot);
                break;
              }
            }
          }
        }
      }
    }
  }

  compactSchedule();

  return schedule;
}
