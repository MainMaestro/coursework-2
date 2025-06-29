<template>
    <div class="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded shadow">
        <h1 class="text-2xl font-bold">Редактирование периода</h1>

        <div v-if="period">
            <h2 class="text-xl font-semibold">Добавить запись</h2>
            <form @submit.prevent="addEntry" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select v-model="entry.groupId" class="border p-2 rounded">
                    <option disabled value="">Группа</option>
                    <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
                </select>

                <select v-model="entry.subjectId" class="border p-2 rounded">
                    <option disabled value="">Предмет</option>
                    <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
                </select>

                <select v-model="entry.teacherId" class="border p-2 rounded">
                    <option disabled value="">Преподаватель</option>
                    <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>

                <input v-model.number="entry.hoursPerWeek" type="number" min="1" class="border p-2 rounded" placeholder="Часов в неделю" />

                <button class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Добавить</button>
            </form>

            <h2 class="text-xl font-semibold mt-6">Записи периода</h2>
            <table class="w-full border mt-2 text-sm">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="border px-2 py-1 text-left">Группа</th>
                        <th class="border px-2 py-1 text-left">Предмет</th>
                        <th class="border px-2 py-1 text-left">Преподаватель</th>
                        <th class="border px-2 py-1 text-left">Часов/нед</th>
                        <th class="border px-2 py-1"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(e, index) in period.entries" :key="index">
                        <td class="border px-2 py-1">{{ groupName(e.groupId) }}</td>
                        <td class="border px-2 py-1">{{ subjectName(e.subjectId) }}</td>
                        <td class="border px-2 py-1">{{ teacherName(e.teacherId) }}</td>
                        <td class="border px-2 py-1">{{ e.hoursPerWeek }}</td>
                        <td class="border px-2 py-1 text-center">
                            <button @click="removeEntry(index)" class="text-red-600 hover:underline">Удалить</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="text-gray-500">Период не найден.</div>
        <NuxtLink :to="'/period/' + $route.params.id + '/generate'" class="p-4 bg-green-300">Сгенерировать</NuxtLink>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { usePeriodStore } from "@/stores/period";
import { useGroupsStore } from "@/stores/groups";
import { useSubjectsStore } from "@/stores/subjects";
import { useTeachersStore } from "@/stores/teachers";

const route = useRoute();
const periodStore = usePeriodStore();
const groupStore = useGroupsStore();
const subjectStore = useSubjectsStore();
const teacherStore = useTeachersStore();

onMounted(() => {
    periodStore.loadFromStorage();
    groupStore.loadFromStorage();
    subjectStore.loadFromStorage();
    teacherStore.loadFromStorage();
});

const groups = computed(() => groupStore.groups);
const subjects = computed(() => subjectStore.subjects);
const teachers = computed(() => teacherStore.teachers);

const periodId = route.params.id;
const period = computed(() => periodStore.byId(periodId));

const entry = reactive({
    groupId: "",
    subjectId: "",
    teacherId: "",
    hoursPerWeek: 1,
});

function addEntry() {
    if (!entry.groupId || !entry.subjectId || !entry.teacherId || entry.hoursPerWeek < 1) return;

    periodStore.addEntry(periodId, { ...entry });

    // сброс формы
    entry.groupId = "";
    entry.subjectId = "";
    entry.teacherId = "";
    entry.hoursPerWeek = 1;
}

function removeEntry(index) {
    periodStore.removeEntry(periodId, index);
}

const groupName = (id) => groupStore.groups.find((g) => g.id === id)?.name || id;
const subjectName = (id) => subjectStore.subjects.find((s) => s.id === id)?.name || id;
const teacherName = (id) => teacherStore.teachers.find((t) => t.id === id)?.name || id;
</script>
