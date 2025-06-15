<template>
  <div class="min-w-screen min-h-screen bg-gray-100 p-6 space-y-6 container">
    <header class="text-center">
      <h1 class="text-4xl font-bold text-blue-800">
        Система автоматизации расписания
      </h1>
      <p class="text-gray-600 mt-2">
        Учебный год: 2024–2025 | Весенний семестр
      </p>
    </header>
    <div class="flex flex-col gap-4">
      <!-- Панель управления -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-white shadow rounded-xl p-4">
          <h2 class="font-semibold text-lg text-blue-700 mb-2">Группы</h2>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>ИС-101</li>
            <li>ИС-102</li>
            <li>ПО-201</li>
          </ul>
        </div>

        <div class="bg-white shadow rounded-xl p-4">
          <h2 class="font-semibold text-lg text-blue-700 mb-2">
            Преподаватели
          </h2>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>Иванов И.И. – математика</li>
            <li>Петрова А.В. – информатика</li>
            <li>Сидоров В.К. – физика</li>
          </ul>
        </div>

        <div class="bg-white shadow rounded-xl p-4">
          <h2 class="font-semibold text-lg text-blue-700 mb-2">Аудитории</h2>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>101 — корпус A</li>
            <li>202 — корпус B</li>
            <li>305 — корпус A</li>
          </ul>
        </div>
      </div>

      <!-- Расписание -->
      <div
        v-for="time in timeTables"
        :key="time.groupName"
        class="bg-white shadow-xl rounded-2xl p-6"
      >
        <h2 class="text-2xl font-bold text-blue-700 mb-4">
          Расписание для группы {{ time.groupName }}
        </h2>
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
            <tr
              v-for="lesson in time.timeTable"
              :key="lesson"
              class="hover:bg-gray-50"
            >
              <td class="border px-4 py-2">{{ lesson.weekday }}</td>
              <td class="border px-4 py-2">{{ lesson.time }}</td>
              <td class="border px-4 py-2">{{ lesson.subject }}</td>
              <td class="border px-4 py-2">{{ lesson.teacher }}</td>
              <td class="border px-4 py-2">{{ lesson.classroom }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Подвал -->
    <footer class="text-center text-gray-500 text-sm mt-10">
      Курсовая работа • © 2025 • Студенты: Саргсян А.А. Петров А.В. Тимофеев
      Е.Д. Ковалёв А.А.
    </footer>
  </div>
</template>

<script setup>
const daytype = { normal: "Normal", holyday: "holyday", weekends: "weekends" };

const lessonTime = { first: "9:00 - 10:30", second: "10:30 - 12:10" };
const timeTables = [
  {
    groupName: "ИС2-19",
    timeTable: [
      {
        weekday: "Понедельник",
        time: lessonTime.first,
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: "101",
      },
      {
        weekday: "Понедельник",
        time: lessonTime.second,
        subject: "Математика",
        teacher: "Сергеев И.И.",
        classroom: "101",
      },
      {
        weekday: "Вторник",
        time: "9:00 - 10:30",
        subject: "Математика",
        teacher: "Милярчук И.И.",
        classroom: "101",
      },
      {
        weekday: "Среда",
        time: "9:00 - 10:30",
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: "101",
      },
      {
        weekday: "Пятница",
        time: "9:00 - 10:30",
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: "101",
      },
    ],
  },
  {
    groupName: "ИС1-19",
    timeTable: [
      {
        weekday: "Понедельник",
        time: lessonTime.first,
        subject: "Математика",
        teacher: "Коновалов И.И.",
        classroom: "101",
      },
      {
        weekday: "Понедельник",
        time: lessonTime.second,
        subject: "Математика",
        teacher: "Сидоров И.И.",
        classroom: "101",
      },
      {
        weekday: "Вторник",
        time: "9:00 - 10:30",
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: "101",
      },
      {
        weekday: "Среда",
        time: "9:00 - 10:30",
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: "101",
      },
      {
        weekday: "Пятница",
        time: "9:00 - 10:30",
        subject: "Математика",
        teacher: "Иванов И.И.",
        classroom: "101",
      },
    ],
  },
];
</script>

<style scoped></style>
