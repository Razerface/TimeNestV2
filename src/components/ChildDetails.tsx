import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import TaskList from './TaskList';
import ProgressSummary from './ProgressSummary';
import { Task, TaskProgress, ChildAccount } from '../types/types';
import { TASKS } from '../data/tasks';

const ChildDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [child, setChild] = useState<ChildAccount | null>(null);
  const [progress, setProgress] = useState<TaskProgress>({
    totalTasks: 0,
    completedTasks: 0,
    timeEarned: 0
  });

  useEffect(() => {
    const savedChild = localStorage.getItem(`child_${id}`);
    if (savedChild) {
      setChild(JSON.parse(savedChild));
    }

    const savedTasks = localStorage.getItem(`tasks_${id}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(TASKS);
    }
  }, [id]);

  useEffect(() => {
    if (!tasks.length || !child) return;

    const completedTasks = tasks.filter(task => task.completed).length;
    const timeEarned = tasks.reduce((total, task) => {
      if (task.completed) {
        switch (task.category) {
          case 'five': return total + 5;
          case 'ten': return total + 10;
          case 'fifteen': return total + 15;
          case 'twenty': return total + 20;
          default: return total;
        }
      }
      return total;
    }, 0);

    setProgress({
      totalTasks: tasks.length,
      completedTasks,
      timeEarned
    });

    localStorage.setItem(`tasks_${id}`, JSON.stringify(tasks));
  }, [tasks, child, id]);

  const handleTaskComplete = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleResetTasks = () => {
    const resetTasks = tasks.map(task => ({
      ...task,
      completed: false
    }));
    setTasks(resetTasks);
  };

  if (!child) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
          <button
            onClick={handleResetTasks}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset All Tasks
          </button>
        </div>

        <ProgressSummary progress={progress} childName={child.name} />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Tasks</h2>
          <TaskList
            tasks={tasks}
            onTaskComplete={handleTaskComplete}
            allowedCategories={child.categories}
          />
        </div>
      </div>
    </div>
  );
};

export default ChildDetails;