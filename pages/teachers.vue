<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Преподаватели</h1>
    <a href="/" class="text-blue-600 underline block mb-4">Меню</a>

    <form @submit.prevent="addNewTeacher" class="flex flex-col gap-4 mb-8">
      <input
        v-model="name"
        type="text"
        placeholder="ФИО преподавателя"
        class="border px-4 py-2 rounded w-full"
      />

      <label class="font-medium">Предметы</label>
      <select
        v-model="selectedSubjects"
        multiple
        class="border rounded p-2 h-32 w-full"
      >
        <option
          v-for="subject in subjects"
          :key="subject.id"
          :value="subject.id"
        >
          {{ subject.name }}
        </option>
      </select>

      <button
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded w-fit"
      >
        Добавить
      </button>
    </form>

    <ul class="space-y-4">
      <li
        v-for="t in teachers"
        :key="t.id"
        class="flex justify-between items-start bg-white shadow p-4 rounded"
      >
        <div>
          <div class="font-semibold">{{ t.name }}</div>
          <div class="text-sm text-gray-500">
            Ведёт:
            <ul class="list-disc list-inside">
              <li v-for="s in t.subjects" :key="s">
                {{ subjectName(s) }}
              </li>
            </ul>
          </div>
        </div>
        <button @click="remove(t.id)" class="text-red-600 hover:underline">
          Удалить
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
const subjectsStore = useSubjectsStore()
const teachersStore = useTeachersStore()

const name = ref('')
const selectedSubjects = ref([])

onMounted(() => {
  subjectsStore.loadFromStorage()
  teachersStore.loadFromStorage()
})

const subjects = computed(() => subjectsStore.subjects)
const teachers = computed(() => teachersStore.teachers)

function subjectName(id) {
  return subjects.value.find(s => s.id === id)?.name || id
}

function addNewTeacher() {
  if (!name.value.trim() || selectedSubjects.value.length === 0) {
    return alert('Введите имя и выберите хотя бы один предмет')
  }

  teachersStore.addTeacher({
    id: Date.now().toString(),
    name: name.value.trim(),
    subjects: [...selectedSubjects.value]
  })

  name.value = ''
  selectedSubjects.value = []
}

function remove(id) {
  teachersStore.removeTeacher(id)
}
</script>
