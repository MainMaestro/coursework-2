<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Предметы</h1>
    <a href="/">Меню</a>
    <form @submit.prevent="addNewSubject" class="flex flex-wrap gap-4 mb-8">
      <input
        v-model="newName"
        placeholder="Название предмета"
        class="border px-4 py-2 rounded w-full sm:w-auto flex-1"
      />
      <input
        v-model.number="hours"
        type="number"
        placeholder="Часов в неделю"
        class="border px-4 py-2 rounded w-full sm:w-auto w-32"
      />

      <label class="block w-full">
        Типы аудиторий (где можно проводить занятия)
      </label>
      <select
        v-model="allowedAuditoryTypes"
        multiple
        class="border rounded p-2 w-full h-32"
        size="4"
      >
        <option value="общая">Общая</option>
        <option value="компьютерная">Компьютерная</option>
      </select>

      <button
        class="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700 duration-300 ease-in cursor-pointer mt-4"
      >
        Добавить
      </button>
    </form>

    <ul class="space-y-4">
      <li
        v-for="s in subjects"
        :key="s.id"
        class="flex justify-between items-start bg-white shadow p-4 rounded"
      >
        <div>
          <div class="font-semibold">{{ s.name }}</div>
          <div class="text-sm text-gray-500">Часов в неделю: {{ s.hours }}</div>
          <div class="text-sm text-gray-500">
            Аудитории: {{ (s.allowedAuditoryTypes || []).join(', ') || 'Все' }}
          </div>
        </div>
        <button @click="remove(s.id)" class="text-red-600 hover:underline">
          Удалить
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
const store = useSubjectsStore()
const newName = ref('')
const hours = ref(1)
const allowedAuditoryTypes = ref([])

onMounted(() => {
  store.loadFromStorage()
})

const subjects = computed(() => store.subjects)

function addNewSubject() {
  if (!newName.value.trim()) return alert('Введите название предмета')

  store.addSubject({
    id: Date.now().toString(),
    name: newName.value.trim(),
    hours: hours.value,
    allowedAuditoryTypes: allowedAuditoryTypes.value
  })

  newName.value = ''
  hours.value = 1
  allowedAuditoryTypes.value = []
}

function remove(id) {
  store.removeSubject(id)
}
</script>
