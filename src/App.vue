<template>
  <div class="min-w-screen min-h-screen bg-gray-100 p-6 space-y-6 container">
    <header class="text-center">
      <h1 class="text-4xl font-bold text-blue-800">Система автоматизации расписания</h1>
      <p class="text-gray-600 mt-2">Учебный год: 2024–2025 | Весенний семестр</p>
    </header>
    <div class="flex flex-col gap-4">
      <!-- Панель управления -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-white shadow rounded-xl p-4 transition-all duration-500 hover:shadow-xl">
          <h2 class="font-semibold text-lg text-blue-700 mb-2">Группы</h2>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li v-for="timeTable in timeTables" :key="timeTable">{{ timeTable.groupName }}</li>
          </ul>
        </div>

        <div class="bg-white shadow transition-all duration-500 hover:shadow-xl rounded-xl p-4">
          <h2 class="font-semibold text-lg text-blue-700 mb-2">Преподаватели</h2>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li v-for="teacher in TEACHERS" :key="teacher">{{ teacher.name }} – {{ teacher.subject }}</li>
          </ul>
        </div>

        <div class="bg-white shadow rounded-xl p-4 transition-all duration-500 hover:shadow-xl">
          <h2 class="font-semibold text-lg text-blue-700 mb-2">Аудитории</h2>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li v-for="classroom in CLASSROOMS" :key="classroom">
              {{ classroom.label }}
              <span v-if="classroom.building">({{ classroom.building }})</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Расписание -->
      <div v-for="time in timeTables" :key="time.groupName" class="bg-white shadow transition-all duration-500 hover:shadow-xl rounded-2xl p-6">
        <h2 class="text-2xl font-bold text-blue-700 mb-4">Расписание для группы {{ time.groupName }} </h2>
        <table class="w-full text-sm text-left border border-gray-300">
          <thead class="bg-blue-100 text-blue-800">
            <tr>
              <th class="border px-4 py-2">День</th>
              <th class="border px-4 py-2">Время</th>
              <th class="border px-4 py-2">Предмет</th>
              <th class="border px-4 py-2">Преподаватель</th>
              <th class="border px-4 py-2">Аудитория</th>
            </tr>
          </thead>
          <tbody class="text-black">
            <tr v-for="lesson in time.timeTable" :key="lesson" class="hover:bg-gray-50">
              <td class="border px-4 py-2">{{ lesson.weekday }}</td>
              <td class="border px-4 py-2">{{ lesson.time }}</td>
              <td class="border px-4 py-2">{{ lesson.subject }}</td>
              <td class="border px-4 py-2">{{ lesson.teacher }}</td>
              <td class="border px-4 py-2">
                {{ lesson.classroom.label }}
                <span v-if="lesson.classroom.building">({{ lesson.classroom.building }})</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Подвал -->
    <footer class="text-center text-gray-500 text-sm mt-10">Курсовая работа • © 2025 • Студенты: Саргсян А.А. Петров А.В. Тимофеев Е.Д. Ковалёв А.А.</footer>
  </div>
</template>

<script setup>
import { computed } from "vue";

const LESSON_TIME = {
  first: "9:00 - 10:30",
  second: "10:30 - 12:10",
  third: "12:20 - 14:00",
};

const timeTables = [
  {
    groupName: "ИС2-19",
    timeTable: [
      {
        weekday: "Понедельник",
        time: LESSON_TIME.first,
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: { label: "101" },
      },
      {
        weekday: "Понедельник",
        time: LESSON_TIME.second,
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: { label: "102" },
      },
      {
        weekday: "Вторник",
        time: LESSON_TIME.first,
        subject: "Информатика",
        teacher: "Петрова А.В.",
        classroom: { label: "101" },
      },
      {
        weekday: "Среда",
        time: LESSON_TIME.second,
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: { label: "101" },
      },
      {
        weekday: "Пятница",
        time: LESSON_TIME.third,
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: { label: "101" },
      },
    ],
  },
  {
    groupName: "ИС1-19",
    timeTable: [
      {
        weekday: "Понедельник",
        time: LESSON_TIME.first,
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: { label: "101" },
      },
      {
        weekday: "Понедельник",
        time: LESSON_TIME.second,
        subject: "Физика",
        teacher: "Сидоров В.К.",
        classroom: { label: "101" },
      },
      {
        weekday: "Вторник",
        time: LESSON_TIME.first,
        subject: "Информатика",
        teacher: "Петрова А.В.",
        classroom: { label: "102" },
      },
      {
        weekday: "Среда",
        time: LESSON_TIME.second,
        subject: "Информатика",
        teacher: "Петрова А.В.",
        classroom: { label: "103" },
      },
      {
        weekday: "Пятница",
        time: LESSON_TIME.second,
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: { label: "2101", building: "корпус 2" },
      },
    ],
  },
];

// ✅ Вычисляем уникальных преподавателей
const TEACHERS = computed(() => {
  const set = new Map();
  for (const group of timeTables) {
    for (const lesson of group.timeTable) {
      const key = `${lesson.teacher}|${lesson.subject}`;
      if (!set.has(key)) set.set(key, { name: lesson.teacher, subject: lesson.subject });
    }
  }
  return Array.from(set.values());
});

// ✅ Вычисляем уникальные аудитории
const CLASSROOMS = computed(() => {
  const map = new Map();
  for (const group of timeTables) {
    for (const lesson of group.timeTable) {
      const key = `${lesson.classroom.label}|${lesson.classroom.building || ""}`;
      if (!map.has(key)) map.set(key, lesson.classroom);
    }
  }
  return Array.from(map.values());
});
</script>

<style scoped></style>
