<template>
  <div class="relative">
    <input
      :id="inputId"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none
             dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder=" "
    />
    <label
      :for="inputId"
      class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5
             peer-focus:text-blue-600 peer-focus:dark:text-blue-500
             peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
             peer-focus:scale-75 peer-focus:-translate-y-4
             rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,
  label: {
    type: String,
    required: true,
  },
  id: String,
})

const emit = defineEmits(['update:modelValue'])

const inputId = computed(() => props.id || `floating_input_${Math.random().toString(36).substr(2, 9)}`)
</script>
