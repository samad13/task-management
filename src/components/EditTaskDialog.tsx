import { useEffect, useState } from "react";
import { useTasks } from "../store/useTasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import type { Task } from "../types/task";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Input } from "../components/ui/input";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine(
      (date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
      "Due date must be today or in the future"
    ),
  priority: z.enum(["low", "medium", "high"]),
});

type FormData = z.infer<typeof schema>;

export function EditTaskDialog({ task }: { task: Task }) {
  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const updateTask = useTasks((s) => s.updateTask);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
      });
    }
  }, [open, task, reset]);

  const onSubmit = (data: FormData) => {
    updateTask(task.id, {
      title: data.title,
      description: data.description ?? "",
      dueDate: data.dueDate,
      priority: data.priority,
    });
    toast("✅ Task updated", {
      description: `Task "${task.title}" changes have been saved.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 mt-3"
        >
          
          <label>
            <span className="font-medium">Title</span>
            <input
              {...register("title")}
              className={`border rounded p-2 w-full ${
                errors.title ? "border-red-500" : ""
              }`}
              placeholder="Task title"
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.title.message}
              </span>
            )}
          </label>

          
          <label>
            <span className="font-medium">Description</span>
            <textarea
              {...register("description")}
              className={`border rounded p-2 w-full ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="Task description (optional)"
            />
            {errors.description && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.description.message}
              </span>
            )}
          </label>

          
          <div className="flex flex-col gap-1">
            <span className="font-medium">Due Date</span>
            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => {
                const selectedDate = field.value
                  ? new Date(field.value)
                  : undefined;

                return (
                  <Popover>
                    <div className="relative">
                      <Input
                        placeholder="Pick a date"
                        value={field.value || ""}
                        readOnly
                        className={`border rounded p-2 w-full pr-10 ${
                          errors.dueDate ? "border-red-500" : ""
                        }`}
                      />
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                          <CalendarIcon className="size-4" />
                          <span className="sr-only">Select date</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="end"
                        sideOffset={4}
                      >
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            if (date) {
                              const formatted = formatDateLocal(date); 
                              field.onChange(formatted);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </div>
                  </Popover>
                );
              }}
            />
            {errors.dueDate && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.dueDate.message}
              </span>
            )}
          </div>

          
          <label>
            <span className="font-medium">Priority</span>
            <select
              {...register("priority")}
              className={`border rounded p-2 w-full ${
                errors.priority ? "border-red-500" : ""
              }`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.priority.message}
              </span>
            )}
          </label>

          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
