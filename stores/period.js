// store/period.js
import { defineStore } from "pinia";

const STORAGE_KEY = "schedule-periods";

export const usePeriodStore = defineStore("period", {
    state: () => ({
        periods: [], // [{ id, title, entries: [{ groupId, subjectId, teacherId, hoursPerWeek }] }]
        selectedPeriodId: null,
    }),

    getters: {
        selectedPeriod(state) {
            return state.periods.find((p) => p.id === state.selectedPeriodId) || null;
        },
    },

    actions: {
        byId(id) {
            return this.periods.find((p) => p.id === id);
        },
        addPeriod(period) {
            this.periods.push(period);
            this.saveToStorage();
        },
        removePeriod(id) {
            this.periods = this.periods.filter((p) => p.id !== id);
            if (this.selectedPeriodId === id) this.selectedPeriodId = null;
            this.saveToStorage();
        },
        setSelectedPeriod(id) {
            this.selectedPeriodId = id;
        },
        addEntry(periodId, entry) {
            const p = this.periods.find((p) => p.id === periodId);
            if (p) {
                p.entries.push(entry);
                this.saveToStorage();
            }
        },
        updateEntry(periodId, index, updated) {
            const p = this.periods.find((p) => p.id === periodId);
            if (p && p.entries[index]) {
                p.entries[index] = { ...p.entries[index], ...updated };
                this.saveToStorage();
            }
        },
        removeEntry(periodId, index) {
            const p = this.periods.find((p) => p.id === periodId);
            if (p) {
                p.entries.splice(index, 1);
                this.saveToStorage();
            }
        },
        loadFromStorage() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                try {
                    this.periods = JSON.parse(raw);
                } catch (e) {
                    console.error("Ошибка чтения периодов:", e);
                }
            }
        },
        saveToStorage() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.periods));
        },
    },
});
