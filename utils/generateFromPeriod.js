import { daysOfWeek, lessonSlots } from "@/utils/schedule-data";

// Перемешивание массива
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Главная функция генерации расписания
export function generateFromPeriod({ period, auditories, groups }) {
    const result = [];

    // Собираем все возможные слоты
    const slots = [];
    for (const day of daysOfWeek) {
        for (const slot of lessonSlots) {
            slots.push({ day: day.id, slot: slot.id });
        }
    }

    shuffle(slots);

    const state = {
        used: [], // список занятых слотов: { day, slot, groupId, teacherId, auditoriumId }
    };

    for (const entry of period.entries) {
        const group = groups.find((g) => g.id === entry.groupId);
        const teacherId = entry.teacherId;
        const subjectId = entry.subjectId;
        const hours = entry.hoursPerWeek;

        // Подбор аудитории по вместимости и типу (если будет нужно)
        const aud = auditories.find((a) => a.capacity >= (group?.size || 0));
        if (!aud) continue;

        for (let i = 0; i < hours; i++) {
            const freeSlot = slots.find(({ day, slot }) => {
                return !state.used.some((u) => u.day === day && u.slot === slot && (u.groupId === group.id || u.teacherId === teacherId || u.auditoriumId === aud.id));
            });

            if (!freeSlot) continue;

            result.push({
                groupId: group.id,
                subjectId,
                teacherId,
                auditoriumId: aud.id,
                day: freeSlot.day,
                slot: freeSlot.slot,
            });

            state.used.push({
                day: freeSlot.day,
                slot: freeSlot.slot,
                groupId: group.id,
                teacherId,
                auditoriumId: aud.id,
            });
        }
    }

    return result;
}
