import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { useTasks } from "../store/useTasks";
import type { Task } from "../types/task";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { EditTaskDialog } from "./EditTaskDialog";
import { toast } from "sonner";

const priorityColor: Record<Task["priority"], string> = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export function TaskItem({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const toggleStatus = useTasks((s) => s.toggleStatus);
  const deleteTask = useTasks((s) => s.deleteTask);

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    toggleStatus(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    deleteTask(task.id);
    toast("🗑️ Task deleted", {
      description: `Task "${task.title}" has been removed.`,
    });
  };
  const titleClass = task.title.length > 10 ? "text-sm" : "text-base";
const descClass = task.description && task.description.length > 40 ? "text-xs" : "text-sm"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`active:cursor-grabbing ${
        task.status === "completed" ? "opacity-60" : ""
      }`}
    >
      <Card
        className={`
    mb-2 transition-all duration-300
    hover:shadow-xl hover:scale-[1.02] hover:bg-gray-100 dark:hover:bg-gray-900
    active:shadow-xl active:scale-[1.02] active:bg-gray-100 dark:active:bg-gray-900
    focus:shadow-xl focus:scale-[1.02] focus:bg-gray-100 dark:focus:bg-gray-900
    ${task.status === "completed" ? "line-through opacity-70" : ""}
  `}
        tabIndex={0}
      >
        <CardHeader>
          <CardTitle className="flex justify-between items-start gap-2 w-full">
            <span
              className={`${titleClass} block break-words overflow-hidden text-ellipsis max-w-[70%] ${
                task.status === "completed" ? "line-through" : ""
              }`}
              style={{
      wordBreak: "break-word",
      overflowWrap: "break-word",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    }}
            >
              {task.title}
            </span>
            <span
              className={`text-xs text-white px-2 py-1 rounded ${
                priorityColor[task.priority]
              }`}
            >
              {task.priority}
            </span>
          </CardTitle>
          <CardDescription
            className={`${descClass} mt-1 break-words overflow-hidden text-ellipsis line-clamp-3 ${
              task.status === "completed" ? "line-through" : ""
            }`}
         
          >
            {task.description}
          </CardDescription>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="text-xs">Due: {task.dueDate}</div>
              <div className="text-xs">
                Created:{" "}
                {new Date(task.createdAt || Date.now()).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="space-x-2 flex justify-between items-center mt-2">
            <Button
              size="sm"
              onClick={handleComplete}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              variant={task.status === "completed" ? "outline" : "default"}
              className=""
            >
              {task.status === "completed" ? "Undo" : "Complete"}
            </Button>
            <div
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <EditTaskDialog task={task} />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="ml-2"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the task <span className="font-bold">"{task.title}"</span>
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600"
                    >
                     
                      Yes, delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
