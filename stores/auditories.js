// stores/auditories.js
import { defineStore } from 'pinia'

const STORAGE_KEY = 'schedule-auditories'

export const useAuditoriesStore = defineStore('auditories', {
  state: () => ({
    auditories: []
  }),

  actions: {
    addAuditory(aud) {
      this.auditories.push(aud)
      this.saveToStorage()
    },
    updateAuditory(id, updated) {
      const index = this.auditories.findIndex(a => a.id === id)
      if (index !== -1) {
        this.auditories[index] = { ...this.auditories[index], ...updated }
        this.saveToStorage()
      }
    },
    removeAuditory(id) {
      this.auditories = this.auditories.filter(a => a.id !== id)
      this.saveToStorage()
    },
    loadFromStorage() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          this.auditories = JSON.parse(raw)
        } catch (e) {
          console.error('Ошибка чтения localStorage:', e)
        }
      }
    },
    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.auditories))
    }
  }
})
