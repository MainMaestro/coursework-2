<template>
  <div v-if="selectedPeriod" class="max-w-3xl mx-auto p-4 bg-white rounded shadow space-y-6">
    <h2 class="text-xl font-semibold mb-4">Связи для периода: {{ selectedPeriod.title }}</h2>

    <form @submit.prevent="addEntry" class="flex flex-wrap gap-4 items-end mb-6">
      <select v-model="newEntry.groupId" class="border rounded px-3 py-2 w-48" required>
        <option disabled value="">Выберите группу</option>
        <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
      </select>

      <select v-model="newEntry.subjectId" class="border rounded px-3 py-2 w-48" required>
        <option disabled value="">Выберите предмет</option>
        <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>

      <select v-model="newEntry.teacherId" class="border rounded px-3 py-2 w-48" required>
        <option disabled value="">Выберите преподавателя</option>
        <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>

      <input
        v-model.number="newEntry.hoursPerWeek"
        type="number"
        min="1"
        max="40"
        placeholder="Часов в неделю"
        class="border rounded px-3 py-2 w-32"
        required
      />

      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Добавить
      </button>
    </form>

    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-3 py-1">Группа</th>
          <th class="border border-gray-300 px-3 py-1">Предмет</th>
          <th class="border border-gray-300 px-3 py-1">Преподаватель</th>
          <th class="border border-gray-300 px-3 py-1">Часов в неделю</th>
          <th class="border border-gray-300 px-3 py-1">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in selectedPeriod.entries" :key="entry.id || index" class="hover:bg-gray-50">
          <td class="border border-gray-300 px-3 py-1">{{ groupName(entry.groupId) }}</td>
          <td class="border border-gray-300 px-3 py-1">{{ subjectName(entry.subjectId) }}</td>
          <td class="border border-gray-300 px-3 py-1">{{ teacherName(entry.teacherId) }}</td>
          <td class="border border-gray-300 px-3 py-1 text-center">{{ entry.hoursPerWeek }}</td>
          <td class="border border-gray-300 px-3 py-1 text-center">
            <button
              @click="removeEntry(index)"
              class="text-red-600 hover:underline"
              title="Удалить связь"
            >
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="selectedPeriod.entries.length === 0" class="text-gray-500 text-center py-6">
      Связи еще не добавлены
    </div>
  </div>

  <div v-else class="max-w-xl mx-auto p-4 text-center text-gray-500">
    Выберите период для редактирования связей.
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePeriodStore } from '@/stores/period'
import { useGroupsStore } from '@/stores/groups'
import { useSubjectsStore } from '@/stores/subjects'
import { useTeachersStore } from '@/stores/teachers'

const periodStore = usePeriodStore()
const groupsStore = useGroupsStore()
const subjectsStore = useSubjectsStore()
const teachersStore = useTeachersStore()

const selectedPeriod = computed(() => periodStore.selectedPeriod)

const groups = computed(() => groupsStore.groups)
const subjects = computed(() => subjectsStore.subjects)
const teachers = computed(() => teachersStore.teachers)

const newEntry = ref({
  groupId: '',
  subjectId: '',
  teacherId: '',
  hoursPerWeek: 1,
})

function addEntry() {
  if (!newEntry.value.groupId || !newEntry.value.subjectId || !newEntry.value.teacherId || !newEntry.value.hoursPerWeek) {
    alert('Заполните все поля')
    return
  }

  // Проверяем, чтобы не было дубликатов (группа + предмет + преподаватель)
  const exists = selectedPeriod.value.entries.some(e =>
    e.groupId === newEntry.value.groupId &&
    e.subjectId === newEntry.value.subjectId &&
    e.teacherId === newEntry.value.teacherId
  )
  if (exists) {
    alert('Такая связь уже существует')
    return
  }

  periodStore.addEntry(selectedPeriod.value.id, { ...newEntry.value })
  resetForm()
}

function resetForm() {
  newEntry.value = {
    groupId: '',
    subjectId: '',
    teacherId: '',
    hoursPerWeek: 1,
  }
}

function removeEntry(index) {
  if (confirm('Удалить связь?')) {
    periodStore.removeEntry(selectedPeriod.value.id, index)
  }
}

function groupName(id) {
  return groups.value.find(g => g.id === id)?.name || id
}

function subjectName(id) {
  return subjects.value.find(s => s.id === id)?.name || id
}

function teacherName(id) {
  return teachers.value.find(t => t.id === id)?.name || id
}
</script>
