"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { AISuggestion } from "@/lib/ai-helper";
import { TaskPriority } from "@/models/Task";

interface AISuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: AISuggestion[];
  onAddSuggestion: (suggestion: AISuggestion) => void;
  isLoading?: boolean;
}

export default function AISuggestionsDialog({
  open,
  onOpenChange,
  suggestions,
  onAddSuggestion,
  isLoading = false,
}: AISuggestionsDialogProps) {
  const [addingIndex, setAddingIndex] = useState<number | null>(null);

  const handleAdd = async (suggestion: AISuggestion, index: number) => {
    setAddingIndex(index);
    try {
      await onAddSuggestion(suggestion);
      // Optionally remove the suggestion from the list after adding
    } catch (error) {
      console.error("Error adding suggestion:", error);
    } finally {
      setAddingIndex(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Task Suggestions</DialogTitle>
          <DialogDescription>
            Here are some task suggestions based on your existing tasks. Click
            "Add Task" to create any of these.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">
              Generating suggestions...
            </span>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No suggestions available at the moment.
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {suggestion.title}
                    </h3>
                    {suggestion.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {suggestion.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(
                          suggestion.priority
                        )}`}
                      >
                        {suggestion.priority}
                      </span>
                      {suggestion.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {suggestion.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAdd(suggestion, index)}
                    disabled={addingIndex === index}
                    className="shrink-0"
                  >
                    {addingIndex === index ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Task
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

