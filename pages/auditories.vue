<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Аудитории</h1>
    <a href="/">Меню</a>
    <form @submit.prevent="addNewAuditory" class="flex flex-wrap gap-4 mb-8">
      <input
        v-model="newName"
        placeholder="Название аудитории"
        class="border px-4 py-2 rounded w-full sm:w-auto flex-1"
      />
      <input
        v-model.number="capacity"
        type="number"
        placeholder="Вместимость"
        class="border px-4 py-2 rounded w-40"
      />
      <label class="flex items-center space-x-2">
        <input type="checkbox" v-model="isShared" />
        <span class="text-sm">Разрешить объединение групп</span>
      </label>
      <select v-model="type" class="border rounded px-3 py-2 w-48">
        <option disabled value="">Выберите тип аудитории</option>
        <option value="общая">Общая</option>
        <option value="компьютерная">Компьютерная</option>
      </select>
      <button
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 duration-300 ease-in cursor-pointer"
      >
        Добавить
      </button>
    </form>

    <ul class="space-y-4">
     <li
  v-for="a in auditories"
  :key="a.id"
  class="flex justify-between items-start bg-white shadow p-4 rounded"
>
  <div class="flex-1 space-y-1">
    <div v-if="editId !== a.id">
      <div class="font-semibold">{{ a.name }}</div>
      <div class="text-sm text-gray-500">Вместимость: {{ a.capacity }}</div>
      <div class="text-sm text-gray-500">
        {{ a.isShared ? "Можно объединять группы" : "Только одна группа" }}
      </div>
      <div class="text-sm text-gray-500">Тип: {{ a.type || "не указан" }}</div>
    </div>

    <div v-else class="space-y-2">
      <input
        v-model="editData.name"
        class="border rounded px-2 py-1 w-full"
        placeholder="Название"
      />
      <input
        type="number"
        v-model.number="editData.capacity"
        class="border rounded px-2 py-1 w-full"
        placeholder="Вместимость"
      />
      <label class="flex items-center space-x-2">
        <input type="checkbox" v-model="editData.isShared" />
        <span class="text-sm">Можно объединять группы</span>
      </label>
      <select v-model="editData.type" class="border rounded px-2 py-1 w-full">
        <option value="общая">Общая</option>
        <option value="компьютерная">Компьютерная</option>
      </select>
    </div>
  </div>

  <div class="flex flex-col items-end gap-1">
    <button
      v-if="editId !== a.id"
      @click="startEdit(a)"
      class="text-blue-600 hover:underline"
    >
      Редактировать
    </button>
    <template v-else>
      <button
        @click="saveEdit(a.id)"
        class="text-green-600 hover:underline"
      >
        Сохранить
      </button>
      <button
        @click="cancelEdit"
        class="text-gray-500 hover:underline text-sm"
      >
        Отмена
      </button>
    </template>
    <button @click="remove(a.id)" class="text-red-600 hover:underline">
      Удалить
    </button>
  </div>
</li>

    </ul>
  </div>
</template>

<script setup>
const store = useAuditoriesStore()
const newName = ref('')
const capacity = ref(30)
const isShared = ref(false)
const type = ref('')

onMounted(() => {
  store.loadFromStorage()
})
const editId = ref(null)
const editData = reactive({
  name: '',
  capacity: 30,
  isShared: false,
  type: ''
})

function startEdit(aud) {
  editId.value = aud.id
  editData.name = aud.name
  editData.capacity = aud.capacity
  editData.isShared = aud.isShared
  editData.type = aud.type
}

function saveEdit(id) {
  store.updateAuditory(id, { ...editData })
  editId.value = null
}

function cancelEdit() {
  editId.value = null
}

const auditories = computed(() => store.auditories)

function addNewAuditory() {
  if (!newName.value.trim() || !type.value) return alert('Введите название и выберите тип аудитории')

  store.addAuditory({
    id: Date.now().toString(),
    name: newName.value.trim(),
    capacity: capacity.value,
    isShared: isShared.value,
    type: type.value
  })

  newName.value = ''
  capacity.value = 30
  isShared.value = false
  type.value = ''
}

function remove(id) {
  store.removeAuditory(id)
}
</script>
