<template>
  <div class="bg-gray-50 min-h-screen py-10 px-4">
    <div class="bg-white p-8 rounded-2xl shadow-lg max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold text-blue-800 mb-6 text-center">Группы</h2>

      <!-- Добавление новой группы -->
      <div class="flex gap-3 mb-6">
        <input
          v-model="newGroup"
          placeholder="Введите название группы"
          class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          @click="addGroup"
          class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Добавить
        </button>
      </div>

      <!-- Список групп -->
      <ul class="mb-8 space-y-2">
        <li
          v-for="(group, index) in groups"
          :key="index"
          class="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg"
        >
          <span class="text-gray-800 font-medium">{{ group }}</span>
          <button @click="removeGroup(index)" class="text-red-500 hover:underline">Удалить</button>
        </li>
      </ul>

      <!-- Кнопка генерации -->
      <div class="text-center">
        <button
          @click="generateSchedule"
          class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Сгенерировать расписание
        </button>
      </div>

      <!-- Расписание по группам -->
      <div v-for="(schedule, group) in schedules" :key="group" class="mt-10">
        <h3 class="text-xl font-semibold text-blue-700 mb-4 border-b pb-1">{{ group }}</h3>

        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-200 text-sm">
            <thead class="bg-blue-50">
              <tr>
                <th class="px-4 py-2 border">День</th>
                <th class="px-4 py-2 border">Время</th>
                <th class="px-4 py-2 border">Предмет</th>
                <th class="px-4 py-2 border">Преподаватель</th>
                <th class="px-4 py-2 border">Аудитория</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(entry, i) in schedule"
                :key="i"
                class="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
              >
                <td class="px-4 py-2 border">{{ entry.day }}</td>
                <td class="px-4 py-2 border">{{ entry.time }}</td>
                <td class="px-4 py-2 border">{{ entry.subject }}</td>
                <td class="px-4 py-2 border">{{ entry.teacher }}</td>
                <td class="px-4 py-2 border">{{ entry.room }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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

const roomMap = {
  'Математика': ['101', '102'],
  'Информатика': ['201', '202'],
  'Физика': ['103', '104'],
  'История': ['105'],
  'Английский язык': ['203', '204']
}

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
          const allowedRooms = roomMap[subj.subject] || []

          for (const room of allowedRooms) {
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
</style>
