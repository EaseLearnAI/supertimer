-- 用户表
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 任务集合表
CREATE TABLE public.task_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  icon_color TEXT NOT NULL,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 任务表
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.task_groups(id) ON DELETE CASCADE,
  quadrant SMALLINT CHECK (quadrant >= 1 AND quadrant <= 4),
  content TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  priority TEXT,
  due_date TIMESTAMPTZ,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 习惯表
CREATE TABLE public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 习惯完成记录表
CREATE TABLE public.habit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  completed_at DATE NOT NULL,
  skipped BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 日历事件表
CREATE TABLE public.calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 番茄钟记录表
CREATE TABLE public.pomodoro_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL, -- 以分钟为单位
  completed BOOLEAN DEFAULT false,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 统计数据表
CREATE TABLE public.statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  completed_tasks INTEGER DEFAULT 0,
  completed_habits INTEGER DEFAULT 0,
  focus_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, date)
);

-- AI助手设置表
CREATE TABLE public.ai_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  access_calendar BOOLEAN DEFAULT true,
  access_tasks BOOLEAN DEFAULT true,
  auto_voice_reply BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 添加触发器自动更新updated_at字段
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有表格添加触发器
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_task_groups_modtime BEFORE UPDATE ON task_groups FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_tasks_modtime BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_habits_modtime BEFORE UPDATE ON habits FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_calendar_events_modtime BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_statistics_modtime BEFORE UPDATE ON statistics FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_ai_settings_modtime BEFORE UPDATE ON ai_settings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- RLS策略设置

-- 启用所有表的RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

-- 用户表策略
CREATE POLICY "用户只能查看自己的信息" ON public.users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "用户只能更新自己的信息" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 任务集合表策略
CREATE POLICY "用户只能查看自己的任务集合" ON public.task_groups
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能插入自己的任务集合" ON public.task_groups
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "用户只能更新自己的任务集合" ON public.task_groups
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能删除自己的任务集合" ON public.task_groups
  FOR DELETE USING (auth.uid() = user_id);

-- 任务表策略
CREATE POLICY "用户只能查看自己的任务" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能插入自己的任务" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "用户只能更新自己的任务" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能删除自己的任务" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- 习惯表策略
CREATE POLICY "用户只能查看自己的习惯" ON public.habits
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能插入自己的习惯" ON public.habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "用户只能更新自己的习惯" ON public.habits
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能删除自己的习惯" ON public.habits
  FOR DELETE USING (auth.uid() = user_id);

-- 习惯记录表策略
CREATE POLICY "用户只能查看自己的习惯记录" ON public.habit_logs
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能插入自己的习惯记录" ON public.habit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "用户只能更新自己的习惯记录" ON public.habit_logs
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能删除自己的习惯记录" ON public.habit_logs
  FOR DELETE USING (auth.uid() = user_id);

-- 日历事件表策略
CREATE POLICY "用户只能查看自己的日历事件" ON public.calendar_events
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能插入自己的日历事件" ON public.calendar_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "用户只能更新自己的日历事件" ON public.calendar_events
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能删除自己的日历事件" ON public.calendar_events
  FOR DELETE USING (auth.uid() = user_id);

-- 番茄钟记录表策略
CREATE POLICY "用户只能查看自己的番茄钟记录" ON public.pomodoro_sessions
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能插入自己的番茄钟记录" ON public.pomodoro_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "用户只能更新自己的番茄钟记录" ON public.pomodoro_sessions
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能删除自己的番茄钟记录" ON public.pomodoro_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- 统计数据表策略
CREATE POLICY "用户只能查看自己的统计数据" ON public.statistics
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能插入自己的统计数据" ON public.statistics
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "用户只能更新自己的统计数据" ON public.statistics
  FOR UPDATE USING (auth.uid() = user_id);

-- AI助手设置表策略
CREATE POLICY "用户只能查看自己的AI助手设置" ON public.ai_settings
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "用户只能插入自己的AI助手设置" ON public.ai_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "用户只能更新自己的AI助手设置" ON public.ai_settings
  FOR UPDATE USING (auth.uid() = user_id);