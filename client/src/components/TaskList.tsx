import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import TaskItem from './ui/TaskItem';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { taskApi } from '@/services/api';
import { toast } from 'sonner';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await taskApi.getAll();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error(
            "Failed to load tasks. Please try again later.",
           
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [toast]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      const newTask = await taskApi.create({
        title: newTaskTitle,
        isDone: false,
        userId: ''  // userId is determined by the auth token on the server
      });
      
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      
      toast.success(
        "Task added successfully!",
      );
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error(
        "Failed to add task. Please try again.",
      );
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const taskToUpdate = tasks.find(task => task._id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = await taskApi.update(taskId, {
        isDone: !taskToUpdate.isDone
      });

      setTasks(tasks.map(task => 
        task._id === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error(
        "Failed to update task status. Please try again.",
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.delete(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      
      toast.success(
        "Task deleted successfully!",
      );
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(
        "Failed to delete task. Please try again.",
        { description: "An error occurred while deleting the task." }
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Tasks</h2>
      
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          className="flex-grow"
        />
        <Button onClick={handleAddTask}>Add</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No tasks yet. Add your first task!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;