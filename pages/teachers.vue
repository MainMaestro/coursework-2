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
    <div class="flex-1 space-y-2">
      <!-- Если не редактируем -->
      <div v-if="editId !== t.id">
        <div class="font-semibold">{{ t.name }}</div>
        <div class="text-sm text-gray-500">
          Ведёт:
          <ul class="list-disc list-inside">
            <li v-for="s in t.subjects" :key="s">{{ subjectName(s) }}</li>
          </ul>
        </div>
      </div>

      <!-- Если редактируем -->
      <div v-else class="space-y-2">
        <input
          v-model="editData.name"
          class="border rounded px-2 py-1 w-full"
          placeholder="ФИО"
        />
        <label class="block text-sm font-medium">Предметы</label>
        <select
          v-model="editData.subjects"
          multiple
          class="border rounded px-2 py-1 w-full h-32"
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
    </div>

    <!-- Кнопки -->
    <div class="flex flex-col items-end gap-1">
      <button
        v-if="editId !== t.id"
        @click="startEdit(t)"
        class="text-blue-600 hover:underline"
      >
        Редактировать
      </button>
      <template v-else>
        <button @click="saveEdit(t.id)" class="text-green-600 hover:underline">
          Сохранить
        </button>
        <button @click="cancelEdit" class="text-gray-500 hover:underline text-sm">
          Отмена
        </button>
      </template>
      <button @click="remove(t.id)" class="text-red-600 hover:underline">
        Удалить
      </button>
    </div>
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
const editId = ref(null)
const editData = reactive({
  name: '',
  subjects: []
})

function startEdit(teacher) {
  editId.value = teacher.id
  editData.name = teacher.name
  editData.subjects = [...teacher.subjects]
}

function saveEdit(id) {
  teachersStore.updateTeacher(id, {
    name: editData.name,
    subjects: [...editData.subjects]
  })
  editId.value = null
}

function cancelEdit() {
  editId.value = null
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
