-- 启用所有表的行级安全
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_plans ENABLE ROW LEVEL SECURITY;

-- 为 profiles 表创建策略
CREATE POLICY "用户可以查看自己的个人资料" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "用户可以更新自己的个人资料" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 为 task_sets 表创建策略
CREATE POLICY "用户可以查看自己的任务集" 
ON public.task_sets FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的任务集" 
ON public.task_sets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的任务集" 
ON public.task_sets FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的任务集" 
ON public.task_sets FOR DELETE 
USING (auth.uid() = user_id);

-- 为 tasks 表创建策略
CREATE POLICY "用户可以查看自己的任务" 
ON public.tasks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的任务" 
ON public.tasks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的任务" 
ON public.tasks FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的任务" 
ON public.tasks FOR DELETE 
USING (auth.uid() = user_id);

-- 为 habits 表创建策略
CREATE POLICY "用户可以查看自己的习惯" 
ON public.habits FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的习惯" 
ON public.habits FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的习惯" 
ON public.habits FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的习惯" 
ON public.habits FOR DELETE 
USING (auth.uid() = user_id);

-- 为 habit_logs 表创建策略
CREATE POLICY "用户可以查看自己的习惯打卡记录" 
ON public.habit_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的习惯打卡记录" 
ON public.habit_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的习惯打卡记录" 
ON public.habit_logs FOR DELETE 
USING (auth.uid() = user_id);

-- 为 focus_sessions 表创建策略
CREATE POLICY "用户可以查看自己的专注会话" 
ON public.focus_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的专注会话" 
ON public.focus_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的专注会话" 
ON public.focus_sessions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的专注会话" 
ON public.focus_sessions FOR DELETE 
USING (auth.uid() = user_id);

-- 为 calendar_events 表创建策略
CREATE POLICY "用户可以查看自己的日历事件" 
ON public.calendar_events FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的日历事件" 
ON public.calendar_events FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的日历事件" 
ON public.calendar_events FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的日历事件" 
ON public.calendar_events FOR DELETE 
USING (auth.uid() = user_id);

-- 为 ai_conversations 表创建策略
CREATE POLICY "用户可以查看自己的AI对话历史" 
ON public.ai_conversations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的AI对话" 
ON public.ai_conversations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 为 statistics 表创建策略
CREATE POLICY "用户可以查看自己的统计数据" 
ON public.statistics FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的统计数据" 
ON public.statistics FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的统计数据" 
ON public.statistics FOR UPDATE 
USING (auth.uid() = user_id);

-- 为 user_profiles 表创建策略
CREATE POLICY "用户可以查看自己的用户画像" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "系统可以创建用户画像" 
ON public.user_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "系统可以更新用户画像" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- 为 travel_plans 表创建策略
CREATE POLICY "用户可以查看自己的旅行计划" 
ON public.travel_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的旅行计划" 
ON public.travel_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的旅行计划" 
ON public.travel_plans FOR DELETE 
USING (auth.uid() = user_id);