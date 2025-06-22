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
        <div>
          <div class="font-semibold">{{ g.name }}</div>
          <div class="text-sm text-gray-500">Размер группы: {{ g.size }}</div>
        </div>
        <button @click="remove(g.id)" class="text-red-600 hover:underline">
          Удалить
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
const store = useGroupsStore();
const newName = ref("");
const size = ref(25);

onMounted(() => {
  store.loadFromStorage();
});

const groups = computed(() => store.groups);

function addNewGroup() {
  if (!newName.value.trim()) return;

  store.addGroup({
    id: Date.now().toString(),
    name: newName.value.trim(),
    size: size.value,
  });

  newName.value = "";
  size.value = 25;
}

function remove(id) {
  store.removeGroup(id);
}
</script>
