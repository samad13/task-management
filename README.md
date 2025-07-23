# 📝 Task Management Dashboard

A **modern Task Management Dashboard** built with **React + TypeScript** that lets you create, edit, complete, reorder, and delete tasks with a beautiful UI. It features **drag-and-drop sorting**, **dark mode**, persistent state via `zustand`, and a delightful UX with animated transitions and toast notifications.

## 🚀 Live Demo

👉 **[View the live demo here](#)**

## ✨ Features

- ✅ Add, edit, and delete tasks
- ✅ Drag-and-drop to reorder tasks (powered by `@dnd-kit`)
- ✅ Priority-based color indicators (low, medium, high)
- ✅ Filter tasks by status (all, pending, completed, overdue)
- ✅ Persistent storage using `zustand` + `localStorage`
- ✅ Responsive design with dark mode toggle
- ✅ Toast notifications on key actions

## 🛠️ Setup Instructions

Follow these steps to set up and run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Install dependencies

Make sure you have **Node.js (>=18)** installed, then run:

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 4. Build for production

```bash
npm run build
```
Serve the output in dist/ with any static file server.

## 📂 Project Structure

```
src/
├── components/
│   ├── AddTaskDialog.tsx    # Dialog to create tasks
│   ├── TaskItem.tsx         # Single task card with actions
│   ├── TaskList.tsx         # Task list with drag-and-drop
│   └── DarkModeToggle.tsx   # Theme switcher
├── store/
│   └── useTasks.ts          # Zustand store for tasks
├── types/
│   └── task.ts              # Task type definitions
└── App.tsx                  # App entry point
```

## 🏗️ Architectural Decisions

### State Management

**Zustand** was chosen over Redux because:
- Lightweight and minimal boilerplate
- Built-in persistence middleware
- Easier for local component state management

### Drag-and-Drop

**@dnd-kit** was chosen instead of React DnD because:
- Modern API with better touch support
- Fine-grained control over sensors and activation constraints
- Simpler integration with framer-motion for smooth animations

### Form Validation

**react-hook-form** with **Zod** provides:
- Declarative schema validation
- Instant feedback on invalid inputs
- Easy integration with custom components

## ⚖️ Trade-offs & Decisions

### Local Persistence vs Backend
Chose `zustand` with localStorage persistence for simplicity and offline support.
- ✅ Faster development
- ❌ No multi-device sync (could be added later with a backend)

### Single Component for Task Item
Keeping all logic (edit, delete, complete) in `TaskItem` improves cohesion but slightly increases component size.
- ✅ Simpler structure
- ❌ Might need refactoring for very large features

### Drag Handle on Whole Card
The whole card is draggable for UX simplicity.
- ✅ Easier to use
- ❌ Less precise if you wanted only a small handle area

## 📸 Screenshot

![Task Management Dashboard](screenshot.png)

*Replace `screenshot.png` with your actual screenshot file in the project root.*

## 🧪 Running Tests


```bash
npx vitest run 
```

## 🌐 Tech Stack

- **React + TypeScript**
- **Tailwind CSS** for styling
- **Zustand** for state management
- **@dnd-kit** for drag-and-drop
- **Framer Motion** for animations
- **React Hook Form + Zod** for forms and validation
- **Shadcn UI components** for a11y and UI patterns
- **Sonner** for toast notifications

## 📜 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
