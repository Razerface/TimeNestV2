import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Trophy, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ChildAccount, TaskProgress } from '../types/types';

interface ChildCardProps {
  child: ChildAccount;
}

const ChildCard: React.FC<ChildCardProps> = ({ child }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [progress, setProgress] = useState<TaskProgress>({
    totalTasks: 0,
    completedTasks: 0,
    timeEarned: 0
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${child.id}`);
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      const completedTasks = tasks.filter((task: any) => task.completed).length;
      const timeEarned = tasks.reduce((total: number, task: any) => {
        if (task.completed) {
          return total + task.minutes;
        }
        return total;
      }, 0);

      setProgress({
        totalTasks: tasks.length,
        completedTasks,
        timeEarned
      });
    }
  }, [child.id]);

  const completionPercentage = (progress.completedTasks / progress.totalTasks) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">{child.name}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
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
        
        <div 
          onClick={() => navigate(`/child/${child.id}`)}
          className="cursor-pointer"
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Time Earned</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{progress.timeEarned} mins</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{progress.completedTasks}/{progress.totalTasks}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                <Trophy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rate</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{completionPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildCard;