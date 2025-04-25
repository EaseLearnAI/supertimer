"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getTaskGroupsWithTasks, getQuadrantTasks } from "@/app/api/task-service";

export default function DebugPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Checking...");
  const [taskGroups, setTaskGroups] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        const supabase = createClient();
        
        // Check if we can connect to Supabase
        const { data: healthData } = await supabase.from('task_groups').select('count').limit(0);
        console.log("Health check response:", healthData);
        setConnectionStatus("Connected to Supabase ✅");
        
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData.user);
        
        if (!userData.user) {
          setError("No authenticated user found. This could be why no tasks are loading.");
          return;
        }
        
        // Try to fetch task data
        const groups = await getTaskGroupsWithTasks();
        console.log("Task groups:", groups);
        setTaskGroups(groups);
        
        const quadrants = await getQuadrantTasks();
        console.log("Quadrant tasks:", quadrants);
      } catch (err) {
        console.error("Debug error:", err);
        setConnectionStatus("Failed to connect ❌");
        setError(err instanceof Error ? err.message : String(err));
      }
    }
    
    checkConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Debug</h1>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <div className={connectionStatus.includes("✅") ? "text-green-600" : "text-red-600"}>
          {connectionStatus}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
            <p className="font-semibold">Error:</p>
            <pre className="whitespace-pre-wrap text-sm mt-2">{error}</pre>
          </div>
        )}
      </div>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">User Status</h2>
        {user ? (
          <div>
            <p>User ID: {user.id}</p>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <p className="text-red-600">No authenticated user</p>
        )}
      </div>
      
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Task Groups</h2>
        {taskGroups.length > 0 ? (
          <ul className="list-disc pl-5">
            {taskGroups.map((group) => (
              <li key={group.id}>
                {group.name} - {group.tasks?.length || 0} tasks
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-orange-600">No task groups found</p>
        )}
      </div>
    </div>
  );
} 