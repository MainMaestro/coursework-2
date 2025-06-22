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
        <input
          type="checkbox"
          v-model="isShared"
        />
        <span class="text-sm">Разрешить объединение групп</span>
      </label>
      <button class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 duration-300 ease-in cursor-pointer">
        Добавить
      </button>
    </form>

    <ul class="space-y-4">
      <li
        v-for="a in auditories"
        :key="a.id"
        class="flex justify-between items-start bg-white shadow p-4 rounded"
      >
        <div>
          <div class="font-semibold">{{ a.name }}</div>
          <div class="text-sm text-gray-500">Вместимость: {{ a.capacity }}</div>
          <div class="text-sm text-gray-500">
            {{ a.isShared ? 'Можно объединять группы' : 'Только одна группа' }}
          </div>
        </div>
        <button @click="remove(a.id)" class="text-red-600 hover:underline">
          Удалить
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
const store = useAuditoriesStore()
const newName = ref('')
const capacity = ref(30)
const isShared = ref(false)

onMounted(() => {
  store.loadFromStorage()
})

const auditories = computed(() => store.auditories)

function addNewAuditory() {
  if (!newName.value.trim()) return

  store.addAuditory({
    id: Date.now().toString(),
    name: newName.value.trim(),
    capacity: capacity.value,
    isShared: isShared.value
  })

  newName.value = ''
  capacity.value = 30
  isShared.value = false
}

function remove(id) {
  store.removeAuditory(id)
}
</script>
