<template>
  <div class="max-w-xl mx-auto p-4 bg-white rounded shadow space-y-4">
    <h2 class="text-xl font-semibold">Добавить преподавателя</h2>

    <div>
      <label class="block font-medium mb-1">ФИО преподавателя</label>
      <input
        v-model="teacher.name"
        type="text"
        class="w-full border rounded p-2"
        placeholder="Иванов Иван Иванович"
      />
    </div>

    <div>
      <label class="block font-medium mb-1">Предметы</label>
      <select
        v-model="teacher.subjects"
        multiple
        class="w-full border rounded p-2 h-32"
      >
        <option
          v-for="subject in subjects"
          :key="subject.id"
          :value="subject.id"
        >
          {{ subject.name }}
        </option>
      </select>
    </div>

    <button
      @click="saveTeacher"
      class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
    >
      Сохранить
    </button>

    <div v-if="saved" class="text-green-600 mt-2">Сохранено!</div>
  </div>
</template>

<script setup>

const subjectsStore = useSubjectsStore()
const teachersStore = useTeachersStore()

onMounted(() => {
  subjectsStore.loadFromStorage()
  teachersStore.loadFromStorage()
})

const subjects = computed(() => subjectsStore.subjects)

const teacher = reactive({
  id: Date.now().toString(),
  name: '',
  subjects: [] // Массив subject.id
})

const saved = ref(false)

function saveTeacher() {
  if (!teacher.name || teacher.subjects.length === 0) return

  teachersStore.teachers.push({ ...teacher })
  teachersStore.saveToStorage()
  saved.value = true

  // сброс формы
  teacher.id = Date.now().toString()
  teacher.name = ''
  teacher.subjects = []

  setTimeout(() => (saved.value = false), 2000)
}
</script>
