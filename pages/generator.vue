<template>
  <div class="p-6 max-w-7xl mx-auto">
    <a href="/">Меню</a>
    <h1 class="text-2xl font-bold my-6">Автоматическая генерация расписания</h1>
    <button
      @click="generate"
      class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
    >
      Сгенерировать
    </button>

    <div v-if="schedule.length" class="mt-10 space-y-12">
      <div v-for="day in daysOfWeek" :key="day.id">
        <h2 class="text-xl font-semibold mb-2">{{ day.name }}</h2>
        <table class="w-full table-auto border-collapse">
          <thead class="bg-gray-100">
            <tr class="bg-blue-200">
              <th class="border px-2 py-1 text-left">Группа</th>
              <th
                v-for="slot in lessonSlots"
                :key="slot.id"
                class="border px-2 py-1 text-center"
              >
                {{ slot.id }} пара
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="group in groups.groups" :key="group.id">
              <td class="border px-2 py-1 font-medium bg-gray-200">{{ group.name }}</td>
              <td
                v-for="slot in lessonSlots"
                :key="slot.id"
                class="border px-2 py-1 text-sm align-top"
              >
                <div
                  v-for="entry in findEntries(group.id, day.id, slot.id)"
                  :key="entry.subjectId + entry.type"
                >
                  {{ teacherName(entry.teacherId) }}<br />
                  {{ subjectName(entry.subjectId) }} <br />
                  <span class="text-gray-500 text-xs"
                    >ауд. {{ auditoriumName(entry.auditoriumId) }}</span
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { daysOfWeek, lessonSlots } from "@/utils/schedule-data";

const teachers = useTeachersStore();
const subjects = useSubjectsStore();
const groups = useGroupsStore();
const auditories = useAuditoriesStore();
const scheduleStore = useScheduleStore();

onMounted(() => {
  teachers.loadFromStorage();
  subjects.loadFromStorage();
  groups.loadFromStorage();
  auditories.loadFromStorage();
  scheduleStore.loadFromStorage();
});

const schedule = computed(() => scheduleStore.schedule);

async function generate() {
  const mod = await import("@/utils/generateSchedule");
  const result = mod.generateSchedule({
    groups: groups.groups,
    subjects: subjects.subjects,
    teachers: teachers.teachers,
    auditories: auditories.auditories,
  });
  scheduleStore.setSchedule(result);
}

function findEntries(groupId, day, slot) {
  return schedule.value.filter(
    (e) => e.groupId === groupId && e.day === day && e.slot === slot
  );
}

const teacherName = (id) =>
  teachers.teachers.find((t) => t.id === id)?.name || id;

const subjectName = (id) =>
  subjects.subjects.find((b) => b.id === id)?.name || id
const auditoriumName = (id) =>
  auditories.auditories.find((a) => a.id === id)?.name || id;
</script>
