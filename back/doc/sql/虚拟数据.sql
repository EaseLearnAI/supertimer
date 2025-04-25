-- 首先在 auth.users 表中创建用户（需要 Supabase 管理员权限）
-- 注意：在实际环境中，通常通过 Supabase Auth API 或界面创建用户
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'user@example.com', 
   crypt('password123', gen_salt('bf')), 
   NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 在 public.users 表中添加用户信息
INSERT INTO public.users (id, email, display_name, avatar_url, created_at, updated_at)
VALUES 
  ('0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'user@example.com', '测试用户', 'https://i.pravatar.cc/150?u=user@example.com', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 插入任务集合数据
INSERT INTO public.task_groups (id, user_id, name, icon, icon_color, is_open, created_at, updated_at)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', '健身', 'dumbbell', '#FF3B30', true, NOW(), NOW()),
  ('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', '工作', 'briefcase', '#007AFF', false, NOW(), NOW()),
  ('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', '学习', 'book', '#34C759', false, NOW(), NOW());

-- 插入任务数据 - 健身任务集
INSERT INTO public.tasks (id, user_id, group_id, quadrant, content, completed, priority, due_date, location, created_at, updated_at)
VALUES 
  ('d4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8a', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 2, '练肩', false, 'medium', NOW() + INTERVAL '2 days', '健身房', NOW(), NOW()),
  ('e5f6a7b8-c9d0-8e1f-2a3b-4c5d6e7f8a9b', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 2, '练背', false, 'medium', NOW() + INTERVAL '3 days', '健身房', NOW(), NOW()),
  ('f6a7b8c9-d0e1-9f2a-3b4c-5d6e7f8a9b0c', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 2, '练胸', false, 'medium', NOW() + INTERVAL '4 days', '健身房', NOW(), NOW());

-- 插入任务数据 - 工作任务集
INSERT INTO public.tasks (id, user_id, group_id, quadrant, content, completed, priority, due_date, location, created_at, updated_at)
VALUES 
  ('a7b8c9d0-e1f2-0a3b-4c5d-6e7f8a9b0c1d', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 1, '周会准备', false, 'high', NOW() + INTERVAL '1 day', '办公室', NOW(), NOW()),
  ('b8c9d0e1-f2a3-1b4c-5d6e-7f8a9b0c1d2e', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 1, '回复邮件', false, 'high', NOW() + INTERVAL '1 day', '办公室', NOW(), NOW()),
  ('c9d0e1f2-a3b4-2c5d-6e7f-8a9b0c1d2e3f', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 1, '提交报告', true, 'high', NOW() - INTERVAL '1 day', '办公室', NOW(), NOW());

-- 插入任务数据 - 学习任务集
INSERT INTO public.tasks (id, user_id, group_id, quadrant, content, completed, priority, due_date, location, created_at, updated_at)
VALUES 
  ('d0e1f2a3-b4c5-3d6e-7f8a-9b0c1d2e3f4a', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 2, '阅读英语', false, 'medium', NOW() + INTERVAL '5 days', '家里', NOW(), NOW()),
  ('e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 2, 'Swift课程', false, 'medium', NOW() + INTERVAL '6 days', '图书馆', NOW(), NOW());

-- 插入四象限任务数据（不属于任何任务集）
INSERT INTO public.tasks (id, user_id, group_id, quadrant, content, completed, priority, due_date, location, created_at, updated_at)
VALUES 
  -- 第一象限：重要且紧急
  ('f2a3b4c5-d6e7-5f8a-9b0c-1d2e3f4a5b6c', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', NULL, 1, '提交报告', false, 'high', NOW() + INTERVAL '1 day', '办公室', NOW(), NOW()),
  ('a3b4c5d6-e7f8-6a9b-0c1d-2e3f4a5b6c7d', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', NULL, 1, '回复紧急邮件', false, 'high', NOW() + INTERVAL '1 day', '办公室', NOW(), NOW()),
  
  -- 第二象限：重要但不紧急
  ('b4c5d6e7-f8a9-7b0c-1d2e-3f4a5b6c7d8e', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', NULL, 2, '学习Swift', false, 'medium', NOW() + INTERVAL '7 days', '家里', NOW(), NOW()),
  ('c5d6e7f8-a9b0-8c1d-2e3f-4a5b6c7d8e9f', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', NULL, 2, '健身计划', false, 'medium', NOW() + INTERVAL '5 days', '健身房', NOW(), NOW()),
  
  -- 第三象限：紧急但不重要
  ('d6e7f8a9-b0c1-9d2e-3f4a-5b6c7d8e9f0a', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', NULL, 3, '电话会议', false, 'low', NOW() + INTERVAL '2 days', '办公室', NOW(), NOW()),
  
  -- 第四象限：不重要且不紧急
  ('e7f8a9b0-c1d2-0e3f-4a5b-6c7d8e9f0a1b', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', NULL, 4, '整理邮箱', false, 'low', NOW() + INTERVAL '10 days', '家里', NOW(), NOW());

-- 插入习惯数据
INSERT INTO public.habits (id, user_id, name, icon, color, streak, created_at, updated_at)
VALUES
  ('f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', '阅读', 'book', '#5AC8FA', 28, NOW(), NOW()),
  ('a9b0c1d2-e3f4-5a6b-7c8d-9e0f1a2b3c4d', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', '锻炼', 'running', '#FF9500', 15, NOW(), NOW()),
  ('b0c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', '冥想', 'brain', '#AF52DE', 5, NOW(), NOW()),
  ('c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', '写作', 'pen', '#34C759', 10, NOW(), NOW());

-- 插入习惯记录数据（最近7天）
INSERT INTO public.habit_logs (habit_id, user_id, completed_at, skipped, created_at)
SELECT 
  h.id,
  h.user_id,
  CURRENT_DATE - (i || ' days')::interval,
  false,
  NOW()
FROM public.habits h
CROSS JOIN generate_series(0, 6) i
WHERE h.user_id = '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab'
AND (
  -- 阅读习惯每天都完成
  h.name = '阅读'
  OR
  -- 锻炼习惯隔天完成
  (h.name = '锻炼' AND i % 2 = 0)
  OR
  -- 冥想习惯最近5天完成
  (h.name = '冥想' AND i < 5)
  OR
  -- 写作习惯每3天完成一次
  (h.name = '写作' AND i % 3 = 0)
)
ON CONFLICT DO NOTHING;

-- 插入日历事件数据
INSERT INTO public.calendar_events (id, user_id, title, start_time, end_time, location, description, icon, color, created_at, updated_at)
VALUES
  ('d2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', '团队会议', NOW() + INTERVAL '1 day' + INTERVAL '10 hours', NOW() + INTERVAL '1 day' + INTERVAL '11 hours', '会议室A', '讨论项目进度', 'users', '#007AFF', NOW(), NOW()),
  ('e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', '健身课程', NOW() + INTERVAL '2 days' + INTERVAL '18 hours', NOW() + INTERVAL '2 days' + INTERVAL '19 hours', '健身中心', '有氧运动', 'dumbbell', '#FF3B30', NOW(), NOW()),
  ('f4a5b6c7-d8e9-0f1a-2b3c-4d5e6f7a8b9c', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', '医生预约', NOW() + INTERVAL '3 days' + INTERVAL '14 hours', NOW() + INTERVAL '3 days' + INTERVAL '15 hours', '市中心医院', '年度体检', 'hospital', '#FF9500', NOW(), NOW()),
  ('a5b6c7d8-e9f0-1a2b-3c4d-5e6f7a8b9c0d', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', '朋友聚会', NOW() + INTERVAL '5 days' + INTERVAL '19 hours', NOW() + INTERVAL '5 days' + INTERVAL '22 hours', '城市广场', '老友聚会', 'glass-cheers', '#34C759', NOW(), NOW());

-- 插入番茄钟记录数据
INSERT INTO public.pomodoro_sessions (id, user_id, task_id, duration, completed, start_time, end_time, created_at)
VALUES
  ('b6c7d8e9-f0a1-2b3c-4d5e-6f7a8b9c0d1e', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'c9d0e1f2-a3b4-2c5d-6e7f-8a9b0c1d2e3f', 25, true, NOW() - INTERVAL '2 days' - INTERVAL '3 hours', NOW() - INTERVAL '2 days' - INTERVAL '2 hours' - INTERVAL '35 minutes', NOW() - INTERVAL '2 days'),
  ('c7d8e9f0-a1b2-3c4d-5e6f-7a8b9c0d1e2f', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'a7b8c9d0-e1f2-0a3b-4c5d-6e7f8a9b0c1d', 25, true, NOW() - INTERVAL '1 day' - INTERVAL '5 hours', NOW() - INTERVAL '1 day' - INTERVAL '4 hours' - INTERVAL '35 minutes', NOW() - INTERVAL '1 day'),
  ('d8e9f0a1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'b8c9d0e1-f2a3-1b4c-5d6e-7f8a9b0c1d2e', 45, true, NOW() - INTERVAL '1 day' - INTERVAL '2 hours', NOW() - INTERVAL '1 day' - INTERVAL '1 hour' - INTERVAL '15 minutes', NOW() - INTERVAL '1 day'),
  ('e9f0a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b', '0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', 'd4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8a', 25, false, NOW() - INTERVAL '3 hours', NULL, NOW());

-- 插入统计数据（最近7天）
INSERT INTO public.statistics (user_id, date, completed_tasks, completed_habits, focus_minutes, created_at, updated_at)
VALUES
  ('0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', CURRENT_DATE - INTERVAL '6 days', 3, 2, 75, NOW(), NOW()),
  ('0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', CURRENT_DATE - INTERVAL '5 days', 2, 1, 50, NOW(), NOW()),
  ('0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', CURRENT_DATE - INTERVAL '4 days', 4, 2, 100, NOW(), NOW()),
  ('0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', CURRENT_DATE - INTERVAL '3 days', 1, 3, 25, NOW(), NOW()),
  ('0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', CURRENT_DATE - INTERVAL '2 days', 5, 2, 125, NOW(), NOW()),
  ('0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', CURRENT_DATE - INTERVAL '1 day', 3, 2, 70, NOW(), NOW()),
  ('0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', CURRENT_DATE, 1, 2, 25, NOW(), NOW());

-- 插入AI助手设置
INSERT INTO public.ai_settings (user_id, access_calendar, access_tasks, auto_voice_reply, created_at, updated_at)
VALUES
  ('0cc043c4-0252-4e5e-a9d7-115ec8fbf3ab', true, true, false, NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

-- 创建任务完成触发器（如果不存在）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'task_completion_changed') THEN
    EXECUTE '
    CREATE OR REPLACE FUNCTION on_task_completion_changed()
    RETURNS TRIGGER AS $func$
    BEGIN
      -- 如果任务被标记为完成
      IF NEW.completed = true AND OLD.completed = false THEN
        -- 更新或插入统计数据
        INSERT INTO public.statistics (user_id, date, completed_tasks)
        VALUES (NEW.user_id, CURRENT_DATE, 1)
        ON CONFLICT (user_id, date) 
        DO UPDATE SET 
          completed_tasks = public.statistics.completed_tasks + 1,
          updated_at = NOW();
      -- 如果任务从完成变为未完成
      ELSIF NEW.completed = false AND OLD.completed = true THEN
        -- 更新统计数据
        UPDATE public.statistics
        SET completed_tasks = GREATEST(0, completed_tasks - 1),
            updated_at = NOW()
        WHERE user_id = NEW.user_id AND date = CURRENT_DATE;
      END IF;
      
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;';

    EXECUTE '
    CREATE TRIGGER task_completion_changed
    AFTER UPDATE OF completed ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION on_task_completion_changed();';
  END IF;
END
$$;

-- 创建习惯打卡触发器（如果不存在）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'habit_log_inserted') THEN
    EXECUTE '
    CREATE OR REPLACE FUNCTION on_habit_log_inserted()
    RETURNS TRIGGER AS $func$
    BEGIN
      -- 更新或插入统计数据
      INSERT INTO public.statistics (user_id, date, completed_habits)
      VALUES (NEW.user_id, NEW.completed_at, 1)
      ON CONFLICT (user_id, date) 
      DO UPDATE SET 
        completed_habits = public.statistics.completed_habits + 1,
        updated_at = NOW();
      
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;';

    EXECUTE '
    CREATE TRIGGER habit_log_inserted
    AFTER INSERT ON public.habit_logs
    FOR EACH ROW
    EXECUTE FUNCTION on_habit_log_inserted();';
  END IF;
END
$$;

-- 创建番茄钟完成触发器（如果不存在）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'pomodoro_session_completed') THEN
    EXECUTE '
    CREATE OR REPLACE FUNCTION on_pomodoro_session_completed()
    RETURNS TRIGGER AS $func$
    BEGIN
      -- 如果番茄钟被标记为完成
      IF NEW.completed = true AND OLD.completed = false THEN
        -- 更新或插入统计数据
        INSERT INTO public.statistics (user_id, date, focus_minutes)
        VALUES (NEW.user_id, CURRENT_DATE, NEW.duration)
        ON CONFLICT (user_id, date) 
        DO UPDATE SET 
          focus_minutes = public.statistics.focus_minutes + NEW.duration,
          updated_at = NOW();
      END IF;
      
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;';

    EXECUTE '
    CREATE TRIGGER pomodoro_session_completed
    AFTER UPDATE OF completed ON public.pomodoro_sessions
    FOR EACH ROW
    EXECUTE FUNCTION on_pomodoro_session_completed();';
  END IF;
END
$$;