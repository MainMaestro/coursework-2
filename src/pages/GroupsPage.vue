<template>
  <div class="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto mt-10">
    <h2 class="text-3xl font-extrabold text-blue-800 mb-8 border-b pb-2">Группы и расписание</h2>

    <div class="flex gap-3 mb-6">
      <input
        v-model="newGroup"
        placeholder="Добавить новую группу"
        class="flex-grow border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="addGroup"
        class="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Добавить
      </button>
    </div>

    <ul class="mb-10 space-y-3">
      <li
        v-for="(group, index) in groups"
        :key="index"
        class="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition"
      >
        <span class="text-lg font-medium text-gray-800">{{ group }}</span>
        <button
          @click="removeGroup(index)"
          class="text-red-600 hover:text-red-800 font-semibold"
          aria-label="Удалить группу"
        >
          ✕
        </button>
      </li>
    </ul>

    <button
      @click="generateSchedule"
      class="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow hover:bg-green-700 transition mb-12"
    >
      Сгенерировать расписание
    </button>

    <div v-for="(schedule, group) in schedules" :key="group" class="mb-12">
      <h3 class="text-2xl font-bold text-blue-900 mb-4 border-b pb-2">{{ group }}</h3>
      <table class="w-full table-auto border-collapse text-left shadow-sm rounded-lg overflow-hidden">
        <thead class="bg-blue-100">
          <tr>
            <th class="border px-4 py-3 font-semibold text-blue-800">День</th>
            <th class="border px-4 py-3 font-semibold text-blue-800">Время</th>
            <th class="border px-4 py-3 font-semibold text-blue-800">Предмет</th>
            <th class="border px-4 py-3 font-semibold text-blue-800">Преподаватель</th>
            <th class="border px-4 py-3 font-semibold text-blue-800">Аудитория</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(entry, i) in schedule"
            :key="i"
            class="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
          >
            <td class="border px-4 py-3">{{ entry.day }}</td>
            <td class="border px-4 py-3 font-mono text-gray-700">{{ entry.time }}</td>
            <td class="border px-4 py-3 font-semibold text-gray-800">{{ entry.subject }}</td>
            <td class="border px-4 py-3 text-gray-600">{{ entry.teacher }}</td>
            <td class="border px-4 py-3 text-center text-gray-700">{{ entry.room }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newGroup = ref('')
const groups = ref(['ИС1-19', 'ИС2-19'])

const subjects = [
  { subject: 'Математика', teacher: 'Иванов И.И.' },
  { subject: 'Информатика', teacher: 'Петрова А.В.' },
  { subject: 'Физика', teacher: 'Сидоров В.К.' },
  { subject: 'История', teacher: 'Кузнецова М.С.' },
  { subject: 'Английский язык', teacher: 'Смирнов А.Д.' },
]

const rooms = ['101', '102', '103', '2101']

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
const times = ['9:00 - 10:30', '10:40 - 12:10', '12:30 - 14:00']

const schedules = ref({})

function addGroup() {
  if (newGroup.value.trim()) {
    groups.value.push(newGroup.value.trim())
    newGroup.value = ''
  }
}

function removeGroup(index) {
  groups.value.splice(index, 1)
}

function generateSchedule() {
  const used = new Map()
  const result = {}

  for (const group of groups.value) {
    const schedule = []
    let subjectIndex = 0

    for (const day of days) {
      for (const time of times) {
        const key = day + time
        if (!used.has(key)) {
          used.set(key, { teachers: new Set(), rooms: new Set(), groups: new Set() })
        }
        const tracker = used.get(key)

        let assigned = false
        for (let i = 0; i < subjects.length; i++) {
          const subj = subjects[(subjectIndex + i) % subjects.length]
          for (const room of rooms) {
            if (
              !tracker.teachers.has(subj.teacher) &&
              !tracker.rooms.has(room) &&
              !tracker.groups.has(group)
            ) {
              schedule.push({
                day,
                time,
                subject: subj.subject,
                teacher: subj.teacher,
                room,
              })
              tracker.teachers.add(subj.teacher)
              tracker.rooms.add(room)
              tracker.groups.add(group)
              subjectIndex = (subjectIndex + 1) % subjects.length
              assigned = true
              break
            }
          }
          if (assigned) break
        }
      }
    }
    result[group] = schedule
  }

  schedules.value = result
}
</script>

<style scoped>
/* Можно добавить плавные переходы для кнопок */
button {
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
