<template>
    <div class="max-w-xl mx-auto p-4 bg-white rounded shadow space-y-6">
        <h1 class="text-2xl font-bold mb-4">Периоды (связующие данные)</h1>

        <div>
            <form @submit.prevent="addNewPeriod" class="flex gap-4 mb-4">
                <input v-model="newTitle" placeholder="Название периода (семестр, курс и т.п.)" class="flex-1 border rounded px-3 py-2" />
                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Добавить</button>
            </form>
        </div>

        <div>
            <h2 class="font-semibold mb-2">Список периодов</h2>
            <ul class="space-y-2">
                <li v-for="p in periods" :key="p.id" class="flex items-center justify-between border rounded px-3 py-2" :class="{ 'bg-blue-100 font-semibold': p.id === selectedPeriodId }">
                    <span @click="selectPeriod(p.id)" class="cursor-pointer">{{ p.title }}</span>
                    <NuxtLink class="hover:underline font-normal" :to="'/period/' + p.id">редактировать</NuxtLink>
                    <button @click="removePeriod(p.id)" class="text-red-600 hover:underline" title="Удалить период">Удалить</button>
                </li>
            </ul>
        </div>

        <div v-if="selectedPeriod">
            <h2 class="mt-6 font-semibold">Выбранный период: {{ selectedPeriod.title }}</h2>
            <p class="text-sm text-gray-600">Теперь можно редактировать связи: группа — предмет — преподаватель — часы в неделю.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { usePeriodStore } from "@/stores/period";

const store = usePeriodStore();

const newTitle = ref("");

onMounted(() => {
    store.loadFromStorage();
});

const periods = computed(() => store.periods);
const selectedPeriodId = computed(() => store.selectedPeriodId);
const selectedPeriod = computed(() => store.selectedPeriod);

function addNewPeriod() {
    if (!newTitle.value.trim()) return alert("Введите название периода");
    store.addPeriod({
        id: Date.now().toString(),
        title: newTitle.value.trim(),
        entries: [],
    });
    newTitle.value = "";
}

function selectPeriod(id) {
    store.setSelectedPeriod(id);
}

function removePeriod(id) {
    if (confirm("Удалить период? Это действие нельзя отменить.")) {
        store.removePeriod(id);
    }
}
</script>
