import { defineStore } from 'pinia'

const STORAGE_KEY = 'schedule-subjects'

export const useSubjectsStore = defineStore('subjects', {
  state: () => ({
    subjects: []
  }),

  actions: {
    addSubject(subject) {
      this.subjects.push(subject)
      this.saveToStorage()
    },
    updateSubject(id, updated) {
      const index = this.subjects.findIndex(s => s.id === id)
      if (index !== -1) {
        this.subjects[index] = { ...this.subjects[index], ...updated }
        this.saveToStorage()
      }
    },
    removeSubject(id) {
      this.subjects = this.subjects.filter(s => s.id !== id)
      this.saveToStorage()
    },
    loadFromStorage() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          this.subjects = JSON.parse(raw)
        } catch (e) {
          console.error('Ошибка чтения localStorage:', e)
        }
      }
    },
    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.subjects))
    }
  }
})
