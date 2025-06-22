// stores/schedule.js

import { defineStore } from 'pinia'

const STORAGE_KEY = 'schedule-auto'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedule: []
  }),
  actions: {
    setSchedule(entries) {
      this.schedule = entries
      this.saveToStorage()
    },
    clearSchedule() {
      this.schedule = []
      this.saveToStorage()
    },
    loadFromStorage() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          this.schedule = JSON.parse(raw)
        } catch (e) {
          console.error('Ошибка чтения расписания:', e)
        }
      }
    },
    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.schedule))
    }
  }
})
