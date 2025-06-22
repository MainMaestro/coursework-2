<template>
  <div class="mt-6 space-y-2 max-w-4xl mx-auto">
    <div
      v-for="item in entries"
      :key="item.groupId + item.day + item.slot + item.type"
      class="bg-white shadow p-4 rounded"
    >
      <strong>{{ dayName(item.day) }}, пара {{ item.slot }} ({{ timeOfSlot(item.slot) }})</strong><br />
      Группа: {{ groupName(item.groupId) }}<br />
      Предмет: {{ subjectName(item.subjectId) }}<br />
      Преподаватель: {{ teacherName(item.teacherId) }}<br />
      Аудитория: {{ auditoriumName(item.auditoriumId) }}<br />
      Тип: {{ item.type }}
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  entries: {
    type: Array,
    required: true
  }
})

const groups = useGroupsStore()
const subjects = useSubjectsStore()
const teachers = useTeachersStore()
const auditories = useAuditoriesStore()

const dayName = (id) => daysOfWeek.find(d => d.id === id)?.name || id
const timeOfSlot = (id) => lessonSlots.find(s => s.id === id)?.time || ''
const groupName = (id) => groups.groups.find(g => g.id === id)?.name || id
const subjectName = (id) => subjects.subjects.find(s => s.id === id)?.name || id
const teacherName = (id) => teachers.teachers.find(t => t.id === id)?.name || id
const auditoriumName = (id) => auditories.auditories.find(a => a.id === id)?.name || id
</script>
