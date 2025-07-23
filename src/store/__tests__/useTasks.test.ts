
import { describe, it, expect, beforeEach } from 'vitest'
import { useTasks } from '../useTasks'
import type { Task } from '../../types/task'

// // Mock task data
// const mockTask: Task = {
//   id: '1',
//   title: 'Test Task',
//   description: 'Test Description',
//   dueDate: '2025-12-31',
//   priority: 'medium',
//   status: 'pending',
//   createdAt: Date.now(),
// }

// describe('useTasks Store', () => {
//   beforeEach(() => {
//     // Reset store before each test
//     useTasks.setState({ tasks: [] })
//   })

//   it('should add a task', () => {
//     const { addTask, tasks } = useTasks.getState()
    
//     addTask(mockTask)
    
//     expect(useTasks.getState().tasks).toHaveLength(1)
//     expect(useTasks.getState().tasks[0]).toEqual(mockTask)
//   })

//   it('should delete a task', () => {
//     const { addTask, deleteTask } = useTasks.getState()
    
//     // Add task first
//     addTask(mockTask)
//     expect(useTasks.getState().tasks).toHaveLength(1)
    
//     // Delete task
//     deleteTask(mockTask.id)
//     expect(useTasks.getState().tasks).toHaveLength(0)
//   })

//   it('should toggle task status', () => {
//     const { addTask, toggleStatus } = useTasks.getState()
    
//     // Add task
//     addTask(mockTask)
//     expect(useTasks.getState().tasks[0].status).toBe('pending')
    
//     // Toggle to completed
//     toggleStatus(mockTask.id)
//     expect(useTasks.getState().tasks[0].status).toBe('completed')
    
//     // Toggle back to pending
//     toggleStatus(mockTask.id)
//     expect(useTasks.getState().tasks[0].status).toBe('pending')
//   })

//   it('should update a task', () => {
//     const { addTask, updateTask } = useTasks.getState()
    
//     // Add task
//     addTask(mockTask)
    
//     // Update task
//     const updates = { title: 'Updated Title', priority: 'high' as const }
//     updateTask(mockTask.id, updates)
    
//     const updatedTask = useTasks.getState().tasks[0]
//     expect(updatedTask.title).toBe('Updated Title')
//     expect(updatedTask.priority).toBe('high')
//     expect(updatedTask.description).toBe(mockTask.description) // Should keep other fields
//   })

//   it('should reorder tasks', () => {
//     const { addTask, reorderTasks } = useTasks.getState()
    
//     const task1 = { ...mockTask, id: '1', title: 'Task 1' }
//     const task2 = { ...mockTask, id: '2', title: 'Task 2' }
//     const task3 = { ...mockTask, id: '3', title: 'Task 3' }
    
//     // Add tasks
//     addTask(task1)
//     addTask(task2)
//     addTask(task3)
    
//     // Reorder: move first task to last
//     reorderTasks(['2', '3', '1'])
    
//     const tasks = useTasks.getState().tasks
//     expect(tasks[0].id).toBe('2')
//     expect(tasks[1].id).toBe('3')
//     expect(tasks[2].id).toBe('1')
//   })
// })


// src/store/useTasks.test.ts


// Reset store state before each test
beforeEach(() => {
  useTasks.setState({ tasks: [] });
});

const makeTask = (overrides?: Partial<Task>): Task => ({
  id: Math.random().toString(),
  title: "Test Task",
  description: "Desc",
  dueDate: "2025-07-30",
  status: "pending",
  priority: "medium",
  createdAt: Date.now(),
  ...overrides,
});

describe("useTasks store", () => {
  it("adds a task to the top of the list", () => {
    const t1 = makeTask({ title: "First" });
    const t2 = makeTask({ title: "Second" });

    useTasks.getState().addTask(t1);
    useTasks.getState().addTask(t2);

    const tasks = useTasks.getState().tasks;
    expect(tasks[0].title).toBe("Second");
    expect(tasks[1].title).toBe("First");
  });

  it("updates an existing task", () => {
    const t1 = makeTask({ id: "123", title: "Old Title" });
    useTasks.getState().addTask(t1);

    useTasks.getState().updateTask("123", { title: "New Title" });

    const updated = useTasks.getState().tasks.find(t => t.id === "123");
    expect(updated?.title).toBe("New Title");
  });

  it("deletes a task", () => {
    const t1 = makeTask({ id: "123" });
    const t2 = makeTask({ id: "456" });
    useTasks.getState().addTask(t1);
    useTasks.getState().addTask(t2);

    useTasks.getState().deleteTask("123");

    const tasks = useTasks.getState().tasks;
    expect(tasks.find(t => t.id === "123")).toBeUndefined();
    expect(tasks.length).toBe(1);
  });

  it("toggles a task status between pending and completed", () => {
    const t1 = makeTask({ id: "123", status: "pending" });
    useTasks.getState().addTask(t1);

    useTasks.getState().toggleStatus("123");
    expect(useTasks.getState().tasks[0].status).toBe("completed");

    useTasks.getState().toggleStatus("123");
    expect(useTasks.getState().tasks[0].status).toBe("pending");
  });

  it("updates task status explicitly", () => {
    const t1 = makeTask({ id: "123", status: "pending" });
    useTasks.getState().addTask(t1);

    useTasks.getState().updateTaskStatus("123", "overdue");
    expect(useTasks.getState().tasks[0].status).toBe("overdue");
  });

  it("reorders tasks by given ids", () => {
    const t1 = makeTask({ id: "a", title: "A" });
    const t2 = makeTask({ id: "b", title: "B" });
    const t3 = makeTask({ id: "c", title: "C" });

    useTasks.getState().addTask(t1);
    useTasks.getState().addTask(t2);
    useTasks.getState().addTask(t3);

    // Current order: c, b, a
    useTasks.getState().reorderTasks(["a", "c", "b"]);
    const tasks = useTasks.getState().tasks.map(t => t.id);
    expect(tasks).toEqual(["a", "c", "b"]);
  });
});
