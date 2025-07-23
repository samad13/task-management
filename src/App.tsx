import { AddTaskDialog } from "./components/AddTaskDialog";
import { TaskList } from "./components/TaskList";
import { DarkModeToggle } from "./components/DarkModeToggle";

import { Toaster } from "sonner";


export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
        <DarkModeToggle />
      </header>
      <main className="mt-4">
        <AddTaskDialog />
        <TaskList />

        <Toaster position="top-right" richColors />
      </main>
    </div>
  );
}




