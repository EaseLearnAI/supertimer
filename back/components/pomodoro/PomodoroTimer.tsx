"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPomodoroSession, completePomodoroSession, markTaskAsCompleted } from '@/app/api/task-service';
import { Button } from "@/components/ui/button";
import { Task } from '@/app/api/task-service';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function PomodoroTimer({ isOpen, onClose, task }: PomodoroTimerProps) {
  const [time, setTime] = useState<number>(25 * 60); // Default 25 minutes in seconds
  const [initialTime, setInitialTime] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Reset timer when closed
  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isOpen]);

  const startTimer = async () => {
    if (!task) return;

    if (!isRunning) {
      // Create session in database
      try {
        const session = await createPomodoroSession(task.id, Math.floor(time / 60));
        setSessionId(session.id);
      } catch (error) {
        console.error('Failed to create pomodoro session:', error);
      }

      // Start timer
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            completeSession();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      // Pause timer
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const completeSession = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (sessionId) {
      try {
        await completePomodoroSession(sessionId);
        
        // Option to mark task as completed
        const shouldMarkCompleted = window.confirm('番茄钟完成！是否将任务标记为已完成？');
        if (shouldMarkCompleted && task) {
          await markTaskAsCompleted(task.id);
        }
      } catch (error) {
        console.error('Failed to complete pomodoro session:', error);
      }
    }
    
    setIsRunning(false);
    onClose();
  };

  const resetTimer = () => {
    setTime(initialTime);
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const selectPreset = (minutes: number) => {
    const newTime = minutes * 60;
    setTime(newTime);
    setInitialTime(newTime);
  };

  // Format time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for the ring
  const progressPercentage = 100 - (time / initialTime) * 100;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg p-6 z-50 max-w-md mx-auto animate-slide-up">
        <div className="text-center font-semibold text-lg mb-4">
          {task?.content || '专注时间'}
        </div>
        
        <div className="w-48 h-48 mx-auto relative flex items-center justify-center">
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#007AFF ${progressPercentage}%, #f2f2f7 0%)`,
              transform: 'rotate(-90deg)'
            }}
          />
          <div className="relative z-10 text-3xl font-bold">
            {formatTime(time)}
          </div>
        </div>
        
        <div className="flex justify-center gap-3 my-6">
          <Button 
            variant="outline" 
            className={`px-4 py-2 rounded-lg ${initialTime === 25 * 60 ? 'bg-primary text-white' : ''}`}
            onClick={() => selectPreset(25)}
          >
            25分钟
          </Button>
          <Button 
            variant="outline" 
            className={`px-4 py-2 rounded-lg ${initialTime === 45 * 60 ? 'bg-primary text-white' : ''}`}
            onClick={() => selectPreset(45)}
          >
            45分钟
          </Button>
          <Button 
            variant="outline" 
            className={`px-4 py-2 rounded-lg ${initialTime === 60 * 60 ? 'bg-primary text-white' : ''}`}
            onClick={() => selectPreset(60)}
          >
            60分钟
          </Button>
        </div>
        
        <div className="flex justify-between gap-4 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            取消
          </Button>
          <Button variant="default" className="flex-1" onClick={startTimer}>
            {isRunning ? '暂停' : (time === initialTime ? '开始' : '继续')}
          </Button>
        </div>
      </div>
    </>
  );
} 