import React from 'react';
import { Task } from '../../types';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-2 transition-all hover:shadow-md">
      <div className="flex items-center space-x-3">
        <Checkbox 
          checked={task.isDone}
          onCheckedChange={() => onToggle(task._id || '')}
          id={`task-${task._id}`}
        />
        <label 
          htmlFor={`task-${task._id}`}
          className={cn(
            "text-sm sm:text-base font-medium cursor-pointer transition-all",
            task.isDone ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-200"
          )}
        >
          {task.title}
        </label>
      </div>
      <button 
        onClick={() => onDelete(task._id || '')}
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default TaskItem;
