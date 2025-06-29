<template>
  <div class="p-6 max-w-7xl mx-auto">
    <a href="/" class="text-blue-600 hover:underline mb-4 inline-block">Меню</a>
    <h1 class="text-2xl font-bold my-6">Автоматическая генерация расписания</h1>

    <button
      @click="generate"
      class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 mb-6"
    >
      Сгенерировать
    </button>

    <button
      @click="exportPdf"
      class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mb-6 ml-4"
      :disabled="!schedule.length"
    >
      Скачать PDF
    </button>

    <div v-if="schedule.length" class="space-y-12">
      <div v-for="day in daysOfWeek" :key="day">
        <h2 class="text-xl font-semibold mb-2">{{ day }}</h2>
        <table class="w-full table-auto border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr class="bg-blue-200">
              <th class="border px-2 py-1 text-left">Группа</th>
              <th
                v-for="slot in lessonSlots"
                :key="slot"
                class="border px-2 py-1 text-center"
              >
                {{ slot }} пара
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="group in groups" :key="group.id">
              <td class="border px-2 py-1 font-medium bg-gray-200 text-center">
                {{ group.name }}
              </td>
              <td
                v-for="slot in lessonSlots"
                :key="slot"
                class="border px-2 py-1 text-sm align-top text-center content-center"
                @drop.prevent="onDrop($event, group.id, day, slot)"
                @dragover.prevent
              >
                <div
                  v-for="entry in findEntries(group.id, day, slot)"
                  :key="
                    entry.subjectId +
                    entry.teacherId +
                    entry.day +
                    entry.slot +
                    entry.groupId
                  "
                  draggable="true"
                  @dragstart="onDragStart($event, entry)"
                  class="cursor-move p-1 bg-white border rounded mb-1 text-center"
                >
                  <div>{{ teacherName(entry.teacherId) }}</div>
                  <div>{{ subjectName(entry.subjectId) }}</div>
                  <div class="text-gray-500 text-xs">
                    ауд. {{ auditoriumName(entry.auditoryId) }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="text-gray-600 mt-10">
      Расписание ещё не сгенерировано.
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import { useTeachersStore } from "@/stores/teachers";
import { useSubjectsStore } from "@/stores/subjects";
import { useGroupsStore } from "@/stores/groups";
import { useAuditoriesStore } from "@/stores/auditories";
import { useScheduleStore } from "@/stores/schedule";

import { generateSchedule } from "@/utils/generateSchedule";

const teachersStore = useTeachersStore();
const subjectsStore = useSubjectsStore();
const groupsStore = useGroupsStore();
const auditoriesStore = useAuditoriesStore();
const scheduleStore = useScheduleStore();

onMounted(() => {
  teachersStore.loadFromStorage();
  subjectsStore.loadFromStorage();
  groupsStore.loadFromStorage();
  auditoriesStore.loadFromStorage();
  scheduleStore.loadFromStorage();
});

const schedule = computed(() => scheduleStore.schedule);

const groups = computed(() => groupsStore.groups);
const teachers = computed(() => teachersStore.teachers);
const subjects = computed(() => subjectsStore.subjects);
const auditories = computed(() => auditoriesStore.auditories);

const daysOfWeek = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];
const lessonSlots = [1, 2, 3, 4, 5, 6, 7];

function findEntries(groupId, day, slot) {
  return schedule.value.filter(
    (e) => e.groupId === groupId && e.day === day && e.slot === slot
  );
}

const teacherName = (id) => teachers.value.find((t) => t.id === id)?.name || id;
const subjectName = (id) => subjects.value.find((s) => s.id === id)?.name || id;
const auditoriumName = (id) =>
  auditories.value.find((a) => a.id === id)?.name || id;

function generate() {
  const result = generateSchedule({
    groups: groups.value,
    subjects: subjects.value,
    teachers: teachers.value,
    auditories: auditories.value,
  });

  scheduleStore.setSchedule(result);
}

// --- Drag & Drop logic ---

const draggedEntry = ref(null);

function onDragStart(event, entry) {
  draggedEntry.value = { ...entry };
}

function onDrop(event, targetGroupId, targetDay, targetSlot) {
  if (!draggedEntry.value) return;

  // Найти индекс перетаскиваемого занятия
  const index = scheduleStore.schedule.findIndex(
    (e) =>
      e.groupId === draggedEntry.value.groupId &&
      e.day === draggedEntry.value.day &&
      e.slot === draggedEntry.value.slot &&
      e.subjectId === draggedEntry.value.subjectId &&
      e.teacherId === draggedEntry.value.teacherId
  );

  if (index !== -1) {
    // Обновляем запись с новыми координатами
    scheduleStore.schedule[index].groupId = targetGroupId;
    scheduleStore.schedule[index].day = targetDay;
    scheduleStore.schedule[index].slot = targetSlot;

    scheduleStore.saveToStorage();
  }

  draggedEntry.value = null;
}

// === Экспорт в PDF ===

let jsPDF

async function exportPdf() {
  if (!schedule.value.length) return

  if (!jsPDF && process.client) {
    const module = await import('jspdf')
    jsPDF = module.jsPDF
  }
  if (!jsPDF) {
    alert('Экспорт в PDF доступен только в браузере')
    return
  }

  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text("Расписание", 10, 15)

  let y = 25
  const lineHeight = 8

  daysOfWeek.forEach((day) => {
    doc.setFontSize(14)
    doc.text(day, 10, y)
    y += lineHeight

    doc.setFontSize(12)
    let header = "Группа".padEnd(15)
    lessonSlots.forEach((slot) => {
      header += (`${slot} пара`).padEnd(15)
    })
    doc.text(header, 10, y)
    y += lineHeight

    groups.value.forEach((group) => {
      let row = group.name.padEnd(15)

      lessonSlots.forEach((slot) => {
        const entries = schedule.value.filter(
          (e) => e.groupId === group.id && e.day === day && e.slot === slot
        )
        if (entries.length > 0) {
          const str = entries
            .map(
              (en) =>
                `${teacherName(en.teacherId)} - ${subjectName(en.subjectId)}`
            )
            .join(", ")
          row += str.padEnd(15)
        } else {
          row += "-".padEnd(15)
        }
      })
      doc.text(row, 10, y)
      y += lineHeight

      if (y > 280) {
        doc.addPage()
        y = 20
      }
    })

    y += lineHeight * 2
  })

  doc.save("schedule.pdf")
}
</script>
