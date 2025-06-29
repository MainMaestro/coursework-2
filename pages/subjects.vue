<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Предметы</h1>
    <a href="/">Меню</a>

    <!-- Форма добавления -->
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

      <label class="block w-full">Типы аудиторий</label>
      <select
        v-model="allowedAuditoryTypes"
        multiple
        class="border rounded p-2 w-full h-32"
        size="4"
      >
        <option value="общая">Общая</option>
        <option value="компьютерная">Компьютерная</option>
        <option value="спортзал">спортзал</option>

      </select>

      <label class="block w-full mt-4 font-medium">Группы</label>
      <div class="flex flex-wrap gap-4 mb-4 max-w-full">
        <label
          v-for="group in groups"
          :key="group.id"
          class="inline-flex items-center space-x-2"
        >
          <input
            type="checkbox"
            :value="group.id"
            v-model="selectedGroupIds"
          />
          <span>{{ group.name }}</span>
        </label>
      </div>
      <div class="text-sm text-gray-500 mb-4">
        Если не выбрано ни одной группы, предмет доступен для всех.
      </div>

      <button
        class="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700"
      >
        Добавить
      </button>
    </form>

    <!-- Список предметов -->
    <ul class="space-y-4">
      <li
        v-for="s in subjects"
        :key="s.id"
        class="flex justify-between items-start bg-white shadow p-4 rounded"
      >
        <div class="flex-1 space-y-1">
          <!-- Просмотр -->
          <div v-if="editId !== s.id">
            <div class="font-semibold">{{ s.name }}</div>
            <div class="text-sm text-gray-500">
              Часов в неделю: {{ s.hours }}
            </div>
            <div class="text-sm text-gray-500">
              Аудитории: {{ (s.allowedAuditoryTypes || []).join(', ') || 'Все' }}
            </div>
            <div class="text-sm text-gray-500">
              Группы:
              {{
                s.groupIds?.length
                  ? s.groupIds.map(id => groupName(id)).join(', ')
                  : 'Все группы'
              }}
            </div>
          </div>

          <!-- Редактирование -->
          <div v-else class="space-y-2">
            <input
              v-model="editData.name"
              class="border rounded px-2 py-1 w-full"
              placeholder="Название предмета"
            />
            <input
              type="number"
              v-model.number="editData.hours"
              class="border rounded px-2 py-1 w-full"
              placeholder="Часы в неделю"
            />

            <label>Типы аудиторий</label>
            <select
              v-model="editData.allowedAuditoryTypes"
              multiple
              class="border rounded p-2 w-full h-24"
            >
              <option value="общая">Общая</option>
              <option value="компьютерная">Компьютерная</option>
              <option value="спортзал">спортзал</option>
              
            </select>

            <label>Группы</label>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="group in groups"
                :key="group.id"
                class="inline-flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :value="group.id"
                  v-model="editData.groupIds"
                />
                <span>{{ group.name }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-end gap-1">
          <button
            v-if="editId !== s.id"
            @click="startEdit(s)"
            class="text-blue-600 hover:underline"
          >
            Редактировать
          </button>
          <template v-else>
            <button
              @click="saveEdit(s.id)"
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

          <button @click="remove(s.id)" class="text-red-600 hover:underline">
            Удалить
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useSubjectsStore } from '@/stores/subjects'
import { useGroupsStore } from '@/stores/groups'

const subjectsStore = useSubjectsStore()
const groupsStore = useGroupsStore()

const newName = ref('')
const hours = ref(1)
const allowedAuditoryTypes = ref([])
const selectedGroupIds = ref([])

const editId = ref(null)
const editData = reactive({
  name: '',
  hours: 1,
  allowedAuditoryTypes: [],
  groupIds: []
})

onMounted(() => {
  subjectsStore.loadFromStorage()
  groupsStore.loadFromStorage()
})

const subjects = computed(() => subjectsStore.subjects)
const groups = computed(() => groupsStore.groups)

function addNewSubject() {
  if (!newName.value.trim()) return alert('Введите название предмета')

  subjectsStore.addSubject({
    id: Date.now().toString(),
    name: newName.value.trim(),
    hours: hours.value,
    allowedAuditoryTypes: allowedAuditoryTypes.value,
    groupIds: selectedGroupIds.value.slice()
  })

  newName.value = ''
  hours.value = 1
  allowedAuditoryTypes.value = []
  selectedGroupIds.value = []
}

function startEdit(s) {
  editId.value = s.id
  editData.name = s.name
  editData.hours = s.hours
  editData.allowedAuditoryTypes = [...(s.allowedAuditoryTypes || [])]
  editData.groupIds = [...(s.groupIds || [])]
}

function saveEdit(id) {
  subjectsStore.updateSubject(id, { ...editData })
  editId.value = null
}

function cancelEdit() {
  editId.value = null
}

function remove(id) {
  subjectsStore.removeSubject(id)
}

const groupName = id => groupsStore.groups.find(g => g.id === id)?.name || id
</script>
