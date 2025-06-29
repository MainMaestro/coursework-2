<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Группы</h1>
    <a href="/">Меню</a>
    <form @submit.prevent="addNewGroup" class="flex flex-wrap gap-4 mb-8">
      <input
        v-model="newName"
        placeholder="Название группы"
        class="border px-4 py-2 rounded w-full sm:w-auto flex-1"
      />
      <input
        v-model.number="size"
        type="number"
        placeholder="Размер (студентов)"
        class="border px-4 py-2 rounded w-full sm:w-auto w-40"
      />
      <button
        class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Добавить
      </button>
    </form>

    <ul class="space-y-4">
      <li
        v-for="g in groups"
        :key="g.id"
        class="flex justify-between items-start bg-white shadow p-4 rounded"
      >
        <div class="flex-1 space-y-1">
          <div v-if="editId !== g.id">
            <div class="font-semibold">{{ g.name }}</div>
            <div class="text-sm text-gray-500">Размер группы: {{ g.size }}</div>
          </div>

          <div v-else class="space-y-2">
            <input
              v-model="editData.name"
              class="border rounded px-2 py-1 w-full"
              placeholder="Название группы"
            />
            <input
              type="number"
              v-model.number="editData.size"
              class="border rounded px-2 py-1 w-full"
              placeholder="Размер"
            />
          </div>
        </div>

        <div class="flex flex-col items-end gap-1">
          <button
            v-if="editId !== g.id"
            @click="startEdit(g)"
            class="text-blue-600 hover:underline"
          >
            Редактировать
          </button>
          <template v-else>
            <button
              @click="saveEdit(g.id)"
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
          <button @click="remove(g.id)" class="text-red-600 hover:underline">
            Удалить
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useGroupsStore } from '@/stores/groups'

const store = useGroupsStore()
const newName = ref('')
const size = ref(25)

const editId = ref(null)
const editData = reactive({
  name: '',
  size: 25
})

onMounted(() => {
  store.loadFromStorage()
})

const groups = computed(() => store.groups)

function addNewGroup() {
  if (!newName.value.trim()) return alert('Введите название группы')

  store.addGroup({
    id: Date.now().toString(),
    name: newName.value.trim(),
    size: size.value,
  })

  newName.value = ''
  size.value = 25
}

function remove(id) {
  store.removeGroup(id)
}

function startEdit(group) {
  editId.value = group.id
  editData.name = group.name
  editData.size = group.size
}

function saveEdit(id) {
  store.updateGroup(id, { ...editData })
  editId.value = null
}

function cancelEdit() {
  editId.value = null
}
</script>
