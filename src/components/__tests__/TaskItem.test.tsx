// src/components/__tests__/TaskItem.test.tsx
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterAll,
  beforeAll,
} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskItem } from "../TaskItem";
import { useTasks } from "../../store/useTasks";
import type { Task } from "../../types/task";

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Received `true` for a non-boolean attribute `layout`/.test(args[0]))
      return;
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

// Mock the store
vi.mock("../../store/useTasks");

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  dueDate: "2025-12-31",
  priority: "medium",
  status: "pending",
  createdAt: 1640995200000, // Jan 1, 2022
};

const mockToggleStatus = vi.fn();
const mockDeleteTask = vi.fn();

describe("TaskItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTasks as any).mockImplementation((selector: any) =>
      selector({
        toggleStatus: mockToggleStatus,
        deleteTask: mockDeleteTask,
      })
    );
  });

  it("renders task information correctly", () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Due: 2025-12-31")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("shows Complete button for pending tasks", () => {
    render(<TaskItem task={mockTask} />);

    const completeButton = screen.getByRole("button", { name: /complete/i });
    expect(completeButton).toBeInTheDocument();
  });

  it("shows Undo button for completed tasks", () => {
    const completedTask = { ...mockTask, status: "completed" as const };
    render(<TaskItem task={completedTask} />);

    const undoButton = screen.getByRole("button", { name: /undo/i });
    expect(undoButton).toBeInTheDocument();
  });

  it("calls toggleStatus when Complete button is clicked", () => {
    render(<TaskItem task={mockTask} />);

    const completeButton = screen.getByRole("button", { name: /complete/i });
    fireEvent.click(completeButton);

    expect(mockToggleStatus).toHaveBeenCalledWith(mockTask.id);
  });

  it("calls deleteTask when Delete button is clicked", () => {
    render(<TaskItem task={mockTask} />);

    // 1. Click the "Delete" button to open the dialog
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    // 2. Find and click the "Yes, delete" confirmation button
    const confirmButton = screen.getByRole("button", { name: /yes, delete/i });
    fireEvent.click(confirmButton);

    // 3. Now the mockDeleteTask should have been called
    expect(mockDeleteTask).toHaveBeenCalledWith(mockTask.id);
  });

  it("applies completed styling for completed tasks", () => {
    const completedTask = { ...mockTask, status: "completed" as const };
    render(<TaskItem task={completedTask} />);

    // Check for opacity class
    const taskContainer = screen.getByText("Test Task").closest("div");
    expect(taskContainer?.closest('[class*="opacity-60"]')).toBeInTheDocument();
  });

  it("displays correct priority colors", () => {
    const highPriorityTask = { ...mockTask, priority: "high" as const };
    render(<TaskItem task={highPriorityTask} />);

    const priorityBadge = screen.getByText("high");
    expect(priorityBadge).toHaveClass("bg-red-500");
  });

  it("displays creation date", () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.getByText(/Created: 1\/1\/2022/)).toBeInTheDocument();
  });
});
