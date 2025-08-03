import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5005/api';

export type Task = {
  id: string;
  title: string;
  body: string;  
  completed: boolean;
  createdAt: string;
};

type TaskContextType = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (title: string, body?: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  fetchTasks: () => Promise<void>;
  getTask: (id: string) => Task | undefined;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks on mount
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`, { withCredentials: true });
      const fetchedTasks: Task[] = res.data.map((task: any) => ({
        id: task._id,
        title: task.title,
        body: task.body,
        completed: task.status === 'Completed',
        createdAt: task.createdAt || new Date().toISOString(),
      }));
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (title: string, body?: string) => {
    try {
      console.log('🚀 TaskContext: Adding task', { title, body });
      
      const res = await axios.post(`${API}/tasks`, {
        title,
        body: body || '',
        status: 'Uncompleted',
      }, { withCredentials: true });

      console.log('✅ TaskContext: Task added, response:', res.data);

      // Extract task data from the response - your backend returns { message, task }
      const taskData = res.data.task || res.data;

      const newTask: Task = {
        id: taskData._id,
        title: taskData.title,
        body: taskData.body,
        completed: taskData.status === 'Completed',
        createdAt: taskData.createdAt || new Date().toISOString(),
      };

      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      console.error('❌ TaskContext: Error adding task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API}/tasks/${id}`, { withCredentials: true });
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    try {
      // Get the current task to preserve existing data
      const currentTask = getTask(id);
      if (!currentTask) {
        throw new Error('Task not found');
      }

      // Prepare the update payload, preserving existing data when not provided
      const updatePayload: any = {};
      
      // Only include fields that are being updated
      if (updates.title !== undefined) {
        updatePayload.title = updates.title;
      }
      
      if (updates.body !== undefined) {
        updatePayload.body = updates.body;
      }
      
      if (updates.completed !== undefined) {
        updatePayload.status = updates.completed ? 'Completed' : 'Uncompleted';
      }

      console.log('🔄 TaskContext: Updating task', { id, updates, updatePayload });

      const res = await axios.put(`${API}/tasks/${id}`, updatePayload, { 
        withCredentials: true 
      });

      console.log('✅ TaskContext: Update response:', res.data);

      // Extract task data from the response - your backend returns { message, task }
      const taskData = res.data.task || res.data;

      console.log('🔍 TaskContext: Raw API response data:', {
        fullResponse: res.data,
        taskData: taskData,
        taskDataStatus: taskData.status,
        updatedTaskCompleted: taskData.status === 'Completed'
      });

      const updatedTask: Task = {
        id: taskData._id || id,
        title: taskData.title || currentTask.title,
        body: taskData.body || currentTask.body,
        completed: taskData.status === 'Completed',
        createdAt: taskData.createdAt || currentTask.createdAt,
      };

      console.log('🔍 TaskContext: Created updatedTask object:', updatedTask);

      setTasks(prev => {
        const updatedTasks = prev.map((task: Task) => task.id === id ? updatedTask : task);
        console.log('🔄 TaskContext: Tasks updated', {
          taskId: id,
          oldTask: prev.find((t: Task) => t.id === id),
          newTask: updatedTask,
          allTasks: updatedTasks.length
        });
        return updatedTasks;
      });
      
      return updatedTask;
    } catch (err) {
      console.error('❌ TaskContext: Error updating task:', err);
      throw err;
    }
  };

  // Add getTask function
  const getTask = (id: string): Task | undefined => {
    return tasks.find((task: Task) => task.id === id);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      setTasks, 
      addTask, 
      deleteTask, 
      updateTask, 
      fetchTasks, 
      getTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};

// Export the hook as a named export
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};  