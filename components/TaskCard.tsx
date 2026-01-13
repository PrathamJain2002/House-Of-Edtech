"use client";

import { Task } from "./TasksPage";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TaskStatus, TaskPriority } from "@/models/Task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  [TaskStatus.TODO]: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  [TaskStatus.COMPLETED]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const priorityColors = {
  [TaskPriority.LOW]: "bg-gray-500",
  [TaskPriority.MEDIUM]: "bg-yellow-500",
  [TaskPriority.HIGH]: "bg-red-500",
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {task.title}
            </h3>
            <span
              className={`h-2 w-2 rounded-full ${priorityColors[task.priority]}`}
              aria-label={`Priority: ${task.priority}`}
            />
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span
              className={`rounded-full px-2 py-1 ${statusColors[task.status]}`}
            >
              {task.status.replace("_", " ")}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </span>
            )}
            {task.tags.length > 0 && (
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {task.tags.slice(0, 2).join(", ")}
                {task.tags.length > 2 && ` +${task.tags.length - 2}`}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(task)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(task._id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

