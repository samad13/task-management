// src/components/__tests__/TaskList.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskList } from '../TaskList'
import { useTasks } from '../../store/useTasks'
import type { Task } from '../../types/task'

// Mock the store
vi.mock('../../store/useTasks')

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task One',
    description: 'First task',
    dueDate: '2025-12-31',
    priority: 'high',
    status: 'pending',
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: 'Task Two',
    description: 'Second task',
    dueDate: '2025-11-30',
    priority: 'low',
    status: 'completed',
    createdAt: Date.now(),
  },
  {
    id: '3',
    title: 'Another Task',
    description: 'Third task',
    dueDate: '2025-10-15',
    priority: 'medium',
    status: 'pending',
    createdAt: Date.now(),
  },
]

const mockReorderTasks = vi.fn()

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useTasks as any).mockReturnValue({
      tasks: mockTasks,
      reorderTasks: mockReorderTasks,
    })
  })

  it('renders search input and filter dropdown', () => {
    render(<TaskList />)
    
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue('All')).toBeInTheDocument()
  })

  it('renders all tasks by default', () => {
    render(<TaskList />)
    
    expect(screen.getByText('Task One')).toBeInTheDocument()
    expect(screen.getByText('Task Two')).toBeInTheDocument()
    expect(screen.getByText('Another Task')).toBeInTheDocument()
  })

  it('filters tasks by search term', async () => {
    const user = userEvent.setup()
    render(<TaskList />)
    
    const searchInput = screen.getByPlaceholderText(/search tasks/i)
    await user.type(searchInput, 'task one')
    
    expect(screen.getByText('Task One')).toBeInTheDocument()
    expect(screen.queryByText('Task Two')).not.toBeInTheDocument()
    expect(screen.queryByText('Another Task')).not.toBeInTheDocument()
  })

  it('filters tasks by status', async () => {
    const user = userEvent.setup()
    render(<TaskList />)
    
    const filterSelect = screen.getByDisplayValue('All')
    await user.selectOptions(filterSelect, 'completed')
    
    expect(screen.queryByText('Task One')).not.toBeInTheDocument()
    expect(screen.getByText('Task Two')).toBeInTheDocument()
    expect(screen.queryByText('Another Task')).not.toBeInTheDocument()
  })

  it('filters tasks by pending status', async () => {
    const user = userEvent.setup()
    render(<TaskList />)
    
    const filterSelect = screen.getByDisplayValue('All')
    await user.selectOptions(filterSelect, 'pending')
    
    expect(screen.getByText('Task One')).toBeInTheDocument()
    expect(screen.queryByText('Task Two')).not.toBeInTheDocument()
    expect(screen.getByText('Another Task')).toBeInTheDocument()
  })

  it('combines search and filter', async () => {
    const user = userEvent.setup()
    render(<TaskList />)
    
    // Search for "task" and filter by "pending"
    const searchInput = screen.getByPlaceholderText(/search tasks/i)
    await user.type(searchInput, 'task')
    
    const filterSelect = screen.getByDisplayValue('All')
    await user.selectOptions(filterSelect, 'pending')
    
    expect(screen.getByText('Task One')).toBeInTheDocument()
    expect(screen.queryByText('Task Two')).not.toBeInTheDocument()
    expect(screen.getByText('Another Task')).toBeInTheDocument()
  })

  it('shows no tasks when search has no matches', async () => {
    const user = userEvent.setup()
    render(<TaskList />)
    
    const searchInput = screen.getByPlaceholderText(/search tasks/i)
    await user.type(searchInput, 'nonexistent task')
    
    expect(screen.queryByText('Task One')).not.toBeInTheDocument()
    expect(screen.queryByText('Task Two')).not.toBeInTheDocument()
    expect(screen.queryByText('Another Task')).not.toBeInTheDocument()
  })

  it('renders empty state when no tasks', () => {
    ;(useTasks as any).mockReturnValue({
      tasks: [],
      reorderTasks: mockReorderTasks,
    })
    
    render(<TaskList />)
    
    expect(screen.queryByText('Task One')).not.toBeInTheDocument()
    expect(screen.queryByText('Task Two')).not.toBeInTheDocument()
    expect(screen.queryByText('Another Task')).not.toBeInTheDocument()
  })
})