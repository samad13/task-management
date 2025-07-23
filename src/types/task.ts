export type TaskStatus = 'pending' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  priority: TaskPriority;
  createdAt?: number
}
