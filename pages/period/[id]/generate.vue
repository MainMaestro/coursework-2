<template>
    <div class="max-w-5xl mx-auto p-6 space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">Генерация расписания</h1>
            <NuxtLink to="/" class="text-blue-600 hover:underline">← Назад</NuxtLink>
        </div>

        <div v-if="period">
            <p class="text-gray-700">
                Период: <strong>{{ period.title }}</strong>
            </p>

            <button @click="generate" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded">Сгенерировать расписание</button>

            <div v-if="result.length" class="mt-6 overflow-auto">
                <table class="min-w-full table-auto border border-gray-400">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="border px-2 py-1">Группа</th>
                            <th class="border px-2 py-1">День</th>
                            <th class="border px-2 py-1">Пара</th>
                            <th class="border px-2 py-1">Предмет</th>
                            <th class="border px-2 py-1">Преподаватель</th>
                            <th class="border px-2 py-1">Аудитория</th>
                            <th class="border px-2 py-1">Тип</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in sortedResult" :key="item.groupId + item.day + item.slot">
                            <td class="border px-2 py-1">{{ groupName(item.groupId) }}</td>
                            <td class="border px-2 py-1">{{ item.day }}</td>
                            <td class="border px-2 py-1">{{ item.slot }}</td>
                            <td class="border px-2 py-1">{{ subjectName(item.subjectId) }}</td>
                            <td class="border px-2 py-1">{{ teacherName(item.teacherId) }}</td>
                            <td class="border px-2 py-1">{{ auditoriumName(item.auditoriumId) }}</td>
                            <td class="border px-2 py-1">{{ item.type }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-else class="text-gray-600">Период не найден</div>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { usePeriodStore } from "@/stores/period";
import { useGroupsStore } from "@/stores/groups";
import { useSubjectsStore } from "@/stores/subjects";
import { useTeachersStore } from "@/stores/teachers";
import { useAuditoriesStore } from "@/stores/auditories";
import { useScheduleStore } from "@/stores/schedule";

const route = useRoute();
const periodStore = usePeriodStore();
const groupsStore = useGroupsStore();
const subjectsStore = useSubjectsStore();
const teachersStore = useTeachersStore();
const auditoriesStore = useAuditoriesStore();
const scheduleStore = useScheduleStore();

periodStore.loadFromStorage();
groupsStore.loadFromStorage();
subjectsStore.loadFromStorage();
teachersStore.loadFromStorage();
auditoriesStore.loadFromStorage();
scheduleStore.loadFromStorage();

const id = route.params.id;
const period = computed(() => periodStore.periods.find((p) => p.id === id));

const result = ref([]);

async function generate() {
    const mod = await import("@/utils/generateFromPeriod.js");
    const generated = mod.generateFromPeriod({
        period: period.value,
        groups: groupsStore.groups,
        subjects: subjectsStore.subjects,
        teachers: teachersStore.teachers,
        auditories: auditoriesStore.auditories,
    });

    result.value = generated;
    scheduleStore.setSchedule(generated);
}

// сортировка по дню недели и номеру пары
const daysOrder = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const sortedResult = computed(() =>
    [...result.value].sort((a, b) => {
        const dayDiff = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
        if (dayDiff !== 0) return dayDiff;
        return a.slot - b.slot;
    })
);

const groupName = (id) => groupsStore.groups.find((g) => g.id === id)?.name || id;
const subjectName = (id) => subjectsStore.subjects.find((s) => s.id === id)?.name || id;
const teacherName = (id) => t;
const auditoriumName = (id) => auditoriesStore.auditories.find((a) => a.id === id)?.name || id;
</script>
 
