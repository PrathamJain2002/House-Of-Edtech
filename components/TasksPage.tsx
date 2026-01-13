"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import TaskList from "@/components/TaskList";
import TaskDialog from "@/components/TaskDialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, LogOut, Sparkles } from "lucide-react";
import { TaskStatus, TaskPriority } from "@/models/Task";
import AISuggestionsDialog from "@/components/AISuggestionsDialog";
import { AISuggestion } from "@/lib/ai-helper";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function TasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<{
    status?: TaskStatus;
    priority?: TaskPriority;
    search?: string;
  }>({});

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.priority) params.append("priority", filter.priority);
      if (filter.search) params.append("search", filter.search);

      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleCreate = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      fetchTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleAISuggestions = async () => {
    setIsLoadingAI(true);
    setIsAIDialogOpen(true);
    try {
      const response = await fetch("/api/tasks/ai/suggestions");
      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      if (data.suggestions && data.suggestions.length > 0) {
        setAiSuggestions(data.suggestions);
      } else {
        toast({
          title: "No Suggestions",
          description: "No AI suggestions available at the moment.",
        });
        setIsAIDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch AI suggestions",
        variant: "destructive",
      });
      setIsAIDialogOpen(false);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAddAISuggestion = async (suggestion: AISuggestion) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: suggestion.title,
          description: suggestion.description,
          priority: suggestion.priority,
          tags: suggestion.tags,
          status: "todo",
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");

      toast({
        title: "Success",
        description: "Task created from AI suggestion",
      });

      // Remove the suggestion from the list
      setAiSuggestions((prev) =>
        prev.filter((s) => s.title !== suggestion.title)
      );

      // Refresh tasks
      fetchTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task from suggestion",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Tasks
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Organize and manage your tasks efficiently
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleAISuggestions}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              AI Suggestions
            </Button>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filter.status || ""}
            onChange={(e) =>
              setFilter({
                ...filter,
                status: e.target.value as TaskStatus | undefined,
              })
            }
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filter.priority || ""}
            onChange={(e) =>
              setFilter({
                ...filter,
                priority: e.target.value as TaskPriority | undefined,
              })
            }
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.search || ""}
            onChange={(e) =>
              setFilter({ ...filter, search: e.target.value || undefined })
            }
            className="flex-1 min-w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Task Dialog */}
        <TaskDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          task={editingTask}
          onClose={handleDialogClose}
        />

        {/* AI Suggestions Dialog */}
        <AISuggestionsDialog
          open={isAIDialogOpen}
          onOpenChange={setIsAIDialogOpen}
          suggestions={aiSuggestions}
          onAddSuggestion={handleAddAISuggestion}
          isLoading={isLoadingAI}
        />
      </div>
    </div>
  );
}

