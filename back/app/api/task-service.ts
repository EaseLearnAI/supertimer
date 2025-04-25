import { createClient } from '@/utils/supabase/client';

// 初始化Supabase客户端
// 移除直接初始化，改为使用工厂函数
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 获取当前用户ID
async function getCurrentUserId() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
  
  if (!data.user) {
    console.error('No authenticated user found');
    // 为了调试，返回一个固定的ID以允许未登录用户也能查看任务
    return 'guest-user-id';
    // 正式环境应该抛出错误：throw new Error('No authenticated user found');
  }
  
  return data.user.id;
}

// 获取Supabase客户端
function getSupabase() {
  return createClient();
}

export type TaskGroup = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  icon_color: string;
  is_open: boolean;
  tasks?: Task[];
};

export type Task = {
  id: string;
  user_id: string;
  group_id?: string | null;
  quadrant?: number | null;
  content: string;
  completed: boolean;
  priority?: string | null;
  due_date?: string | null;
  location?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type QuadrantTasks = {
  q1: Task[];
  q2: Task[];
  q3: Task[];
  q4: Task[];
};

// 获取所有任务集合
export async function getTaskGroups() {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  try {
    const { data, error } = await supabase
      .from('task_groups')
      .select('*')
      .eq('user_id', userId)
      .order('created_at');

    if (error) {
      console.error('Error fetching task groups:', error);
      return [];
    }

    // 如果还没有任务集合，创建一个默认的
    if (!data || data.length === 0) {
      try {
        const newGroup = await createTaskGroup({
          name: '默认任务集',
          icon: 'book',
          icon_color: '#007AFF',
          is_open: true
        });
        return [newGroup];
      } catch (createError) {
        console.error('Error creating default task group:', createError);
        return [];
      }
    }

    return data as TaskGroup[];
  } catch (e) {
    console.error('Exception in getTaskGroups:', e);
    return [];
  }
}

// 获取任务集合和其中的任务
export async function getTaskGroupsWithTasks() {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();

  try {
    const { data: taskGroups, error: groupsError } = await supabase
      .from('task_groups')
      .select('*')
      .eq('user_id', userId)
      .order('created_at');

    if (groupsError) {
      console.error('Error fetching task groups:', groupsError);
      return [];
    }

    // 如果还没有任务集合，创建一个默认的
    if (!taskGroups || taskGroups.length === 0) {
      try {
        const newGroup = await createTaskGroup({
          name: '默认任务集',
          icon: 'book',
          icon_color: '#007AFF',
          is_open: true
        });
        return [{ ...newGroup, tasks: [] }];
      } catch (createError) {
        console.error('Error creating default task group:', createError);
        return [];
      }
    }

    // 对于每个任务集合，获取其任务
    const groupsWithTasks = await Promise.all(
      (taskGroups as TaskGroup[]).map(async (group) => {
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .eq('group_id', group.id)
          .order('created_at');

        if (tasksError) {
          console.error(`Error fetching tasks for group ${group.id}:`, tasksError);
          return { ...group, tasks: [] };
        }

        return { ...group, tasks: tasks as Task[] };
      })
    );

    return groupsWithTasks;
  } catch (e) {
    console.error('Exception in getTaskGroupsWithTasks:', e);
    return [];
  }
}

// 获取四象限任务
export async function getQuadrantTasks(): Promise<QuadrantTasks> {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  const quadrants: QuadrantTasks = {
    q1: [],
    q2: [],
    q3: [],
    q4: []
  };

  try {
    // 获取各象限的任务
    for (let i = 1; i <= 4; i++) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('quadrant', i)
        .is('group_id', null)  // 只获取不属于任何任务集的四象限任务
        .order('created_at');

      if (error) {
        console.error(`Error fetching quadrant ${i} tasks:`, error);
      } else {
        quadrants[`q${i}` as keyof QuadrantTasks] = data as Task[];
      }
    }

    return quadrants;
  } catch (e) {
    console.error('Exception in getQuadrantTasks:', e);
    return quadrants;
  }
}

// 创建新的任务集合
export async function createTaskGroup(taskGroup: Omit<TaskGroup, 'id' | 'user_id'>) {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('task_groups')
    .insert([{ ...taskGroup, user_id: userId }])
    .select();

  if (error) {
    console.error('Error creating task group:', error);
    throw error;
  }

  return data[0] as TaskGroup;
}

// 更新任务集合
export async function updateTaskGroup(id: string, updates: Partial<TaskGroup>) {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('task_groups')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error('Error updating task group:', error);
    throw error;
  }

  return data[0] as TaskGroup;
}

// 删除任务集合
export async function deleteTaskGroup(id: string) {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  const { error } = await supabase
    .from('task_groups')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting task group:', error);
    throw error;
  }

  return true;
}

// 创建新任务
export async function createTask(task: Omit<Task, 'id' | 'user_id'>) {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  // 标准化任务数据
  const taskData = {
    ...task,
    user_id: userId,
    // 确保数据类型正确
    quadrant: task.quadrant ? Number(task.quadrant) : null,
    completed: task.completed || false,
    // 如果没有组ID但有象限，确保group_id为null
    group_id: task.quadrant && !task.group_id ? null : task.group_id
  };
  
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return data[0] as Task;
  } catch (err) {
    console.error('Exception in createTask:', err);
    throw err;
  }
}

// 创建四象限任务
export async function createQuadrantTask(quadrant: number, content: string, priority?: string) {
  return createTask({
    quadrant,
    content,
    completed: false,
    priority: priority || (quadrant <= 2 ? 'high' : quadrant === 3 ? 'medium' : 'low')
  });
}

// 更新任务
export async function updateTask(id: string, updates: Partial<Task>) {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  return data[0] as Task;
}

// 删除任务
export async function deleteTask(id: string) {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }

  return true;
}

// 切换任务完成状态
export async function toggleTaskCompletion(id: string, completed: boolean) {
  return updateTask(id, { completed });
}

// 创建番茄钟会话
export async function createPomodoroSession(taskId: string, duration: number) {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .insert([{
      user_id: userId,
      task_id: taskId,
      duration,
      start_time: new Date().toISOString(),
      completed: false
    }])
    .select();

  if (error) {
    console.error('Error creating pomodoro session:', error);
    throw error;
  }

  return data[0];
}

// 完成番茄钟会话
export async function completePomodoroSession(id: string) {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .update({
      completed: true,
      end_time: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error('Error completing pomodoro session:', error);
    throw error;
  }

  return data[0];
}

// 完成番茄钟时将任务标记为已完成
export async function markTaskAsCompleted(taskId: string) {
  return updateTask(taskId, { completed: true });
}

// 获取所有任务（不分组）
export async function getAllTasks() {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');

  if (error) {
    console.error('Error fetching all tasks:', error);
    return [];
  }

  return data as Task[];
}

// 根据优先级获取任务
export async function getTasksByPriority(priority: string) {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('priority', priority)
    .order('created_at');

  if (error) {
    console.error(`Error fetching ${priority} priority tasks:`, error);
    return [];
  }

  return data as Task[];
}

// 获取截止日期在特定范围内的任务
export async function getTasksByDueDate(startDate: string, endDate: string) {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .gte('due_date', startDate)
    .lte('due_date', endDate)
    .order('due_date');

  if (error) {
    console.error('Error fetching tasks by due date:', error);
    return [];
  }

  return data as Task[];
}

// 获取今日到期的任务
export async function getTodayTasks() {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();
  
  return getTasksByDueDate(startOfDay, endOfDay);
}

// 获取单个任务
export async function getTask(taskId: string) {
  const userId = await getCurrentUserId();
  const supabase = getSupabase();
  
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error);
      return null;
    }

    return data as Task;
  } catch (e) {
    console.error(`Exception in getTask for ID ${taskId}:`, e);
    return null;
  }
}