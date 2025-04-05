import React, { useState } from 'react';
import TaskList from '@/components/TaskList';
import NoteList from '@/components/NoteList';
import PomodoroTimer from '@/components/PomodoroTimer';
import StreakTracker from '@/components/StreakTracker';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes'>('tasks');
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left column: Timer & Streak */}
      <div className="lg:col-span-1 space-y-6">
        <PomodoroTimer />
        <StreakTracker />
      </div>
      
      {/* Right column: Tasks & Notes */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <div className="flex border-b dark:border-gray-700 mb-4">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'notes'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
          </div>
          
          {activeTab === 'tasks' ? <TaskList /> : <NoteList />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;