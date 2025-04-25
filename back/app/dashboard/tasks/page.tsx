"use client";

import { useState, useEffect } from 'react';
import { getTaskGroupsWithTasks, Task, TaskGroup } from '@/app/api/task-service';
import { TaskItem } from '@/components/tasks';

export default function TasksPage() {
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const groups = await getTaskGroupsWithTasks();
      setTaskGroups(groups);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto max-w-2xl py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">任务列表</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {taskGroups.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              没有找到任务集合，请添加一个新的任务集合
            </div>
          ) : (
            taskGroups.map((group) => (
              <div key={group.id} className="mb-8">
                <div className="flex items-center mb-2">
                  <h2 className="text-lg font-semibold">{group.name}</h2>
                  <span 
                    className="ml-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: group.icon_color }}
                  >
                    <i className={`fas fa-${group.icon} text-white text-xs`}></i>
                  </span>
                </div>
                
                {group.tasks && group.tasks.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {group.tasks.map((task) => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        onTaskUpdate={fetchTasks}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-6 bg-white rounded-xl">
                    该任务集合还没有任务
                  </div>
                )}
              </div>
            ))
          )}
        </>
      )}

      <button
        className="fixed bottom-6 right-6 bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        onClick={() => alert('添加任务功能将在后续实现')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
} 