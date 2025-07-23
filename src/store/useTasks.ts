import { create } from "zustand";
import { persist } from "zustand/middleware";
// import type { Task } from "../types/task";
import type { Task, TaskStatus } from "../types/task";


type TaskState = {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  toggleStatus: (id: string) => void;
  reorderTasks: (ids: string[]) => void
};


export const useTasks = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
    //   addTask: (t) => set((s) => ({ tasks: [...s.tasks, t] })),
      addTask: (t) => set((s) => ({ 
  tasks: [{ ...t, createdAt: Date.now() }, ...s.tasks]
})),

      updateTask: (id, data) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
      deleteTask: (id) =>
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== id),
        })),
        
      toggleStatus: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? { ...t, status: t.status === "completed" ? "pending" : "completed" }
              : t
          ),
        })),
        updateTaskStatus: (id: string, status: TaskStatus) =>
  set((s) => ({
    tasks: s.tasks.map((t) =>
      t.id === id ? { ...t, status } : t
    ),
  })),

        // toggleTaskStatus:
      reorderTasks: (ids: string[]) =>
        set((s) => ({
          tasks: ids.map((id) => s.tasks.find((t) => t.id === id)!),
        })),
    }),
    { name: "task-storage" }
  )
);
