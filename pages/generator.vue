<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Автоматическая генерация расписания</h1>
    <button
      @click="generate"
      class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
    >
      Сгенерировать
    </button>

    <div v-if="schedule.length" class="mt-6 space-y-2">
      <div
        v-for="item in schedule"
        :key="item.groupId + item.day + item.slot"
        class="bg-white shadow p-4 rounded"
      >
        {{ item.day }} {{ item.slot }} — {{ groupName(item.groupId) }}:
        {{ subjectName(item.subjectId) }}, {{ teacherName(item.teacherId) }},
        ауд. {{ auditoriumName(item.auditoriumId) }}
      </div>
    </div>
  </div>
</template>

<script setup>
const teachers = useTeachersStore();
const subjects = useSubjectsStore();
const groups = useGroupsStore();
const auditories = useAuditoriesStore();
const scheduleStore = useScheduleStore();

onMounted(() => {
  teachers.loadFromStorage();
  subjects.loadFromStorage();
  groups.loadFromStorage();
  auditories.loadFromStorage();
  scheduleStore.loadFromStorage();
});

const schedule = computed(() => scheduleStore.schedule);

async function generate() {
  console.log("Генерация с входными данными:", {
    groups: groups.groups,
    subjects: subjects.subjects,
    teachers: teachers.teachers,
    auditories: auditories.auditories,
  });

  const mod = await import("@/utils/generateSchedule");
  const result = mod.generateSchedule({
    groups: groups.groups,
    subjects: subjects.subjects,
    teachers: teachers.teachers,
    auditories: auditories.auditories,
  });

  scheduleStore.setSchedule(result);

  console.log("Результат генерации:", result);
}

const groupName = (id) => groups.groups.find((g) => g.id === id)?.name || id;
const subjectName = (id) =>
  subjects.subjects.find((s) => s.id === id)?.name || id;
const teacherName = (id) =>
  teachers.teachers.find((t) => t.id === id)?.name || id;
const auditoriumName = (id) =>
  auditories.auditories.find((a) => a.id === id)?.name || id;
</script>
