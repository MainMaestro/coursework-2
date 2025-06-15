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
            <li v-for="timeTable in timeTables">{{ timeTable.groupName }}</li>
          </ul>
        </div>

        <div class="bg-white shadow transition-all duration-500 hover:shadow-xl rounded-xl p-4">
          <h2 class="font-semibold text-lg text-blue-700 mb-2">Преподаватели</h2>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li v-for="teacher in TEACHERS">{{ teacher.name }} – {{ teacher.subject }}</li>
          </ul>
        </div>

        <div class="bg-white shadow rounded-xl p-4 transition-all duration-500 hover:shadow-xl">
          <h2 class="font-semibold text-lg text-blue-700 mb-2">Аудитории</h2>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li v-for="classroom in CLASSROOMS">
              {{ classroom.label }}
              <span v-if="classroom.building">({{ classroom.building }})</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Расписание -->
      <div v-for="time in timeTables" :key="time.groupName" class="bg-white shadow transition-all duration-500 hover:shadow-xl rounded-2xl p-6">
        <h2 class="text-2xl font-bold text-blue-700 mb-4">Расписание для группы {{ time.groupName }}</h2>
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
const CLASSROOMS = {
  room101: { label: "101" },
  room102: { label: "102" },
  room103: { label: "103" },

  room2101: { label: "2101", building: "корпус 2" },
};
const LESSON_TIME = { first: "9:00 - 10:30", second: "10:30 - 12:10", third: "12:20 - 14:00" };

const TEACHERS = {
  ivanov: {
    name: "Иванов И.И.",
    subject: "Математика",
  },
  petrova: {
    name: "Петрова А.В.",
    subject: "Информатика",
  },
  sidorov: {
    name: "Сидоров В.К.",
    subject: "Физика",
  },
};
const timeTables = [
  {
    groupName: "ИС2-19",
    timeTable: [
      {
        weekday: "Понедельник",
        time: LESSON_TIME.first,
        subject: TEACHERS.ivanov.subject,
        teacher: TEACHERS.ivanov.name,
        classroom: CLASSROOMS.room101,
      },
      {
        weekday: "Понедельник",
        time: LESSON_TIME.second,
        subject: TEACHERS.ivanov.subject,
        teacher: TEACHERS.ivanov.name,
        classroom: CLASSROOMS.room102,
      },
      {
        weekday: "Вторник",
        time: LESSON_TIME.first,
        subject: TEACHERS.petrova.subject,
        teacher: TEACHERS.petrova.name,
        classroom: CLASSROOMS.room101,
      },
      {
        weekday: "Среда",
        time: LESSON_TIME.second,
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: CLASSROOMS.room101,
      },
      {
        weekday: "Пятница",
        time: LESSON_TIME.third,
        subject: TEACHERS.ivanov.subject,
        teacher: TEACHERS.ivanov.name,
        classroom: CLASSROOMS.room101,
      },
    ],
  },
  {
    groupName: "ИС1-19",
    timeTable: [
      {
        weekday: "Понедельник",
        time: LESSON_TIME.first,
        subject: TEACHERS.ivanov.subject,
        teacher: TEACHERS.ivanov.name,
        classroom: CLASSROOMS.room101,
      },
      {
        weekday: "Понедельник",
        time: LESSON_TIME.second,
        subject: TEACHERS.sidorov.subject,
        teacher: TEACHERS.sidorov.name,
        classroom: CLASSROOMS.room101,
      },
      {
        weekday: "Вторник",
        time: LESSON_TIME.first,
        subject: TEACHERS.petrova.subject,
        teacher: TEACHERS.petrova.name,
        classroom: CLASSROOMS.room102,
      },
      {
        weekday: "Среда",
        time: LESSON_TIME.second,
        subject: TEACHERS.petrova.subject,
        teacher: TEACHERS.petrova.name,
        classroom: CLASSROOMS.room103,
      },
      {
        weekday: "Пятница",
        time: LESSON_TIME.second,
        subject: TEACHERS.ivanov.subject,
        teacher: TEACHERS.ivanov.name,
        classroom: CLASSROOMS.room2101,
      },
    ],
  },
];
</script>

<style scoped></style>
