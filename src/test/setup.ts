// src/test/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock zustand persist
vi.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
  },
}))

// Mock dnd-kit
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => children,
  closestCenter: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(),
  MouseSensor: vi.fn(),
  TouchSensor: vi.fn(),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => children,
  verticalListSortingStrategy: {},
  arrayMove: (array: any[], oldIndex: number, newIndex: number) => {
    const newArray = [...array];
    const [removed] = newArray.splice(oldIndex, 1);
    newArray.splice(newIndex, 0, removed);
    return newArray;
  },
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
  }),
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: () => '',
    },
  },
}))