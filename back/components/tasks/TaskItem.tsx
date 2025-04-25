"use client";

import { useState } from 'react';
import { Task, toggleTaskCompletion } from '@/app/api/task-service';
import { PomodoroTimer } from '@/components/pomodoro';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onTaskUpdate?: () => void;
}

export function TaskItem({ task, onTaskUpdate }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState<boolean>(task.completed);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState<boolean>(false);

  const handleCheckboxClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const newCompletedStatus = !isCompleted;
      setIsCompleted(newCompletedStatus);
      await toggleTaskCompletion(task.id, newCompletedStatus);
      if (onTaskUpdate) onTaskUpdate();
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      setIsCompleted(isCompleted); // Revert on error
    }
  };

  const handleTaskClick = () => {
    if (!isCompleted) {
      setIsPomodoroOpen(true);
    }
  };

  return (
    <>
      <div 
        className={cn(
          "flex items-center p-3 rounded-lg my-1 hover:bg-gray-50 transition-colors cursor-pointer",
          isCompleted && "opacity-70"
        )}
        onClick={handleTaskClick}
      >
        <div 
          className={cn(
            "w-6 h-6 rounded-full border-2 border-primary flex-shrink-0 mr-3 flex items-center justify-center",
            isCompleted && "bg-primary"
          )}
          onClick={handleCheckboxClick}
        >
          {isCompleted && (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        
        <div className={cn(
          "flex-1 text-sm font-medium",
          isCompleted && "line-through text-gray-400"
        )}>
          {task.content}
        </div>
        
        {task.priority && (
          <div className="ml-2 text-xs px-2 py-0.5 rounded-full bg-opacity-20 flex-shrink-0"
            style={{ 
              backgroundColor: task.priority === 'high' 
                ? 'rgba(255, 59, 48, 0.2)' 
                : task.priority === 'medium' 
                  ? 'rgba(255, 149, 0, 0.2)' 
                  : 'rgba(52, 199, 89, 0.2)',
              color: task.priority === 'high' 
                ? '#FF3B30' 
                : task.priority === 'medium' 
                  ? '#FF9500' 
                  : '#34C759'  
            }}
          >
            {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
          </div>
        )}
      </div>
      
      <PomodoroTimer 
        isOpen={isPomodoroOpen} 
        onClose={() => setIsPomodoroOpen(false)} 
        task={task}
      />
    </>
  );
} 