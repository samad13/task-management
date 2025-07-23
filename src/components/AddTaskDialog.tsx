import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useTasks } from "../store/useTasks";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { toast } from "sonner";

import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["low", "medium", "high"]),
});

type FormData = z.infer<typeof schema>;

export function AddTaskDialog() {
  const addTask = useTasks((s) => s.addTask);
  const [open, setOpen] = useState(false);
  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: "medium",
      dueDate: ""
    },
  });

  const onSubmit = (data: FormData) => {
    addTask({
      id: uuid(),
      title: data.title,
      description: data.description ?? "",
      dueDate: data.dueDate,
      createdAt: new Date().getTime(),
      status: "pending",
      priority: data.priority,
    });
    toast.success("Task added!", {
      description: `Task "${data.title}" was created successfully.`,
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="trigger-button">Add New Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
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
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={`justify-start text-left font-normal w-full ${
                          errors.dueDate ? "border-red-500" : ""
                        }`}
                      >
                        {selectedDate
                          ? format(selectedDate, "PPP")
                          : "YYYY-MM-DD"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    
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
              className={`border rounded p-2 w-full 2 bg-white text-black
    dark:bg-black dark:text-white ${errors.priority ? "border-red-500" : ""}`}
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
     


          <Button type="submit" data-testid="submit-button">
            Add Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}