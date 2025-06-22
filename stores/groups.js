import { defineStore } from 'pinia'

const STORAGE_KEY = 'schedule-groups'

export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: []
  }),

  actions: {
    addGroup(group) {
      this.groups.push(group)
      this.saveToStorage()
    },
    updateGroup(id, updated) {
      const index = this.groups.findIndex(g => g.id === id)
      if (index !== -1) {
        this.groups[index] = { ...this.groups[index], ...updated }
        this.saveToStorage()
      }
    },
    removeGroup(id) {
      this.groups = this.groups.filter(g => g.id !== id)
      this.saveToStorage()
    },
    loadFromStorage() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          this.groups = JSON.parse(raw)
        } catch (e) {
          console.error('Ошибка чтения localStorage:', e)
        }
      }
    },
    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.groups))
    }
  }
})
