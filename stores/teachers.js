
const STORAGE_KEY = "schedule-teachers";

export const useTeachersStore = defineStore("teachers", {
  state: () => ({
    teachers: [],
  }),
  getters: {
    allTeachers: (state) => state.teachers,
  },
  actions: {
    addTeacher(teacher) {
      this.teachers.push(teacher);
      this.saveToStorage();
    },
    updateTeacher(id, updated) {
      const index = this.teachers.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.teachers[index] = { ...this.teachers[index], ...updated };
        this.saveToStorage();
      }
    },
    removeTeacher(id) {
      this.teachers = this.teachers.filter((t) => t.id !== id);
      this.saveToStorage();
    },
    loadFromStorage() {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          this.teachers = JSON.parse(raw);
        } catch (e) {
          console.error("Ошибка чтения localStorage:", e);
        }
      }
    },
    saveToStorage() {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.teachers));
    },
  },
});
