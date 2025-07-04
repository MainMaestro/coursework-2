<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Расписание по группе</h1>
    <a href="/">Меню</a>
    <div class="mb-4">
      <label class="font-semibold mr-2">Выберите группу:</label>
      <select v-model="selectedGroupId" class="border rounded px-4 py-2">
        <option v-for="g in groups" :key="g.id" :value="g.id">
          {{ g.name }}
        </option>
      </select>
    </div>

    <table v-if="groupSchedule.length" class="table-auto w-full border mt-4">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border">День</th>
          <th class="p-2 border">Пара</th>
          <th class="p-2 border">Время</th>
          <th class="p-2 border">Предмет</th>
          <th class="p-2 border">Преподаватель</th>
          <th class="p-2 border">Аудитория</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="entry in sortedSchedule"
          :key="entry.day + entry.slot + entry.subjectId"
        >
          <td class="border px-2 py-1">{{ dayName(entry.day) }}</td>
          <td class="border px-2 py-1">{{ entry.slot }}</td>
          <td class="border px-2 py-1">{{ timeOfSlot(entry.slot) }}</td>
          <td class="border px-2 py-1">{{ subjectName(entry.subjectId) }}</td>
          <td class="border px-2 py-1">{{ teacherName(entry.teacherId) }}</td>
          <td class="border px-2 py-1">{{ auditoriumName(entry.auditoryId) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else class="text-gray-500">Для этой группы пока нет расписания.</p>
  </div>
</template>

<script setup>
import { daysOfWeek, lessonSlots } from '@/utils/schedule-data'

const groupsStore = useGroupsStore()
const scheduleStore = useScheduleStore()
const teachersStore = useTeachersStore()
const subjectsStore = useSubjectsStore()
const auditoriesStore = useAuditoriesStore()

onMounted(() => {
  groupsStore.loadFromStorage()
  scheduleStore.loadFromStorage()
  teachersStore.loadFromStorage()
  subjectsStore.loadFromStorage()
  auditoriesStore.loadFromStorage()
})

const selectedGroupId = ref('')
const groups = computed(() => groupsStore.groups)

watchEffect(() => {
  if (!selectedGroupId.value && groups.value.length > 0) {
    selectedGroupId.value = groups.value[0].id
  }
})

const groupSchedule = computed(() =>
  scheduleStore.schedule.filter((e) => e.groupId === selectedGroupId.value)
)

const sortedSchedule = computed(() => {
  const dayOrder = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
  return [...groupSchedule.value].sort((a, b) => {
    const dayA = dayOrder.indexOf(a.day)
    const dayB = dayOrder.indexOf(b.day)
    if (dayA !== dayB) return dayA - dayB
    return a.slot - b.slot
  })
})


const dayName = (id) => daysOfWeek.find((d) => d.id === id)?.name || id
const timeOfSlot = (id) => lessonSlots.find((s) => s.id === id)?.time || ''
const subjectName = (id) =>
  subjectsStore.subjects.find((s) => s.id === id)?.name || id
const teacherName = (id) =>
  teachersStore.teachers.find((t) => t.id === id)?.name || id
const auditoriumName = (id) =>
  auditoriesStore.auditories.find((a) => a.id === id)?.name || id
</script>
