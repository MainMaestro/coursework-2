<template>
  <div class="p-6 max-w-5xl mx-auto">
    <a href="/">Меню</a>
    <h1 class="text-2xl font-bold mb-6">Автоматическая генерация расписания</h1>

    <div class="mb-4 flex items-center space-x-4">
      <button
        @click="generate"
        class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
      >
        Сгенерировать расписание
      </button>

      <label>
        Неделя:
        <select v-model.number="currentWeek" class="border rounded px-2 py-1">
          <option v-for="w in totalWeeks" :key="w" :value="w">{{ w }}</option>
        </select>
      </label>
    </div>

    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-2 py-1">Группа / Пара</th>
          <th
            v-for="slot in lessonSlots"
            :key="slot.id"
            class="border border-gray-300 px-2 py-1"
          >
            {{ slot.id }}<br />{{ slot.time }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in groups" :key="group.id">
          <td class="border border-gray-300 px-2 py-1 font-semibold">
            {{ group.name }}
          </td>

          <td
            v-for="slot in lessonSlots"
            :key="slot.id"
            class="border border-gray-300 px-2 py-1 align-top"
          >
<div
  v-for="item in scheduleByWeekAndGroup[group.id]?.filter(s => s.slot === slot.id)"
  :key="item.subjectId + '-' + item.teacherId + '-' + item.auditoriumId"
  class="mb-1"
>
  <div>{{ teacherName(item.teacherId) }}</div>
  <div class="text-sm text-gray-600">ауд. {{ auditoriumName(item.auditoriumId) }}</div>
  <div class="text-xs italic">{{ subjectName(item.subjectId) }}</div>
</div>

          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useTeachersStore } from "@/stores/teachers";
import { useSubjectsStore } from "@/stores/subjects";
import { useGroupsStore } from "@/stores/groups";
import { useAuditoriesStore } from "@/stores/auditories";
import { useScheduleStore } from "@/stores/schedule";
import { lessonSlots } from "@/utils/schedule-data";

const teachers = useTeachersStore();
const subjects = useSubjectsStore();
const groups = useGroupsStore();
const auditories = useAuditoriesStore();
const scheduleStore = useScheduleStore();

const currentWeek = ref(scheduleStore.currentWeek);
const totalWeeks = 16;

onMounted(() => {
  teachers.loadFromStorage();
  subjects.loadFromStorage();
  groups.loadFromStorage();
  auditories.loadFromStorage();
  scheduleStore.loadFromStorage();
});

watch(currentWeek, (newWeek) => {
  scheduleStore.setCurrentWeek(newWeek);
});

// Фильтруем расписание по выбранной неделе и группам
const scheduleByWeekAndGroup = computed(() => {
  const map = {};
  for (const group of groups.groups) {
    map[group.id] = [];
  }

  for (const entry of scheduleStore.schedule) {
    if (entry.week === currentWeek.value) {
      if (map[entry.groupId]) {
        map[entry.groupId].push(entry);
      }
    }
  }
  return map;
});
async function generate() {
  const mod = await import('@/utils/generateSchedule')
  const result = mod.generateSchedule({
    groups: groups.groups,
    subjects: subjects.subjects,
    teachers: teachers.teachers,
    auditories: auditories.auditories,
    numWeeks: totalWeeks
  })
  scheduleStore.setSchedule(result)
  currentWeek.value = 1
}

const teacherName = (id) =>
  teachers.teachers.find((t) => t.id === id)?.name || id;
const subjectName = (id) =>
  subjects.subjects.find((s) => s.id === id)?.name || id;
const auditoriumName = (id) =>
  auditories.auditories.find((a) => a.id === id)?.name || id;
</script>
