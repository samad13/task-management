import { useTasks } from "../store/useTasks";
import { TaskItem } from "./TaskItem";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useState, useMemo, useEffect } from "react";

export function TaskList() {
  const { tasks, reorderTasks, updateTaskStatus } = useTasks();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "pending" | "completed" | "overdue"
  >("all");

  useEffect(() => {
    const now = new Date();
    tasks.forEach((t) => {
      if (t.status === "pending") {
        const due = new Date(t.dueDate);
        if (due < now) {
          updateTaskStatus(t.id, "overdue");
        }
      }
    });
  }, [tasks, updateTaskStatus]);

  // Configure sensors for both mouse and touch
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 1, // Require 10px of movement before drag starts
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 50, // 250ms delay before drag starts on touch
      tolerance: 1, // Allow 5px of movement during the delay
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => (filter === "all" ? true : t.status === filter))
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, search, filter]);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
      const newIndex = filteredTasks.findIndex((t) => t.id === over.id);
      const newOrder = arrayMove(filteredTasks, oldIndex, newIndex).map(
        (t) => t.id
      );
      reorderTasks(newOrder);
    }
  };
  if (tasks.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No tasks yet.</p>;
  }
  return (
    <div className="mt-6">
      <div className="flex justify-between sm:items-center gap-2 mb-3">
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2
    w-full max-w-md"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border rounded p-2 bg-white text-black
    dark:bg-black dark:text-white"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      <div
        className="
        grid gap-4
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
      >
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={filteredTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
