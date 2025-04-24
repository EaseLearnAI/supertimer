-- 创建用户时自动创建个人资料
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 更新习惯连续打卡记录
CREATE OR REPLACE FUNCTION public.update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_log_date DATE;
  streak_days INTEGER;
BEGIN
  -- 获取最近一次打卡日期(不包括今天)
  SELECT MAX(log_date) INTO last_log_date
  FROM public.habit_logs
  WHERE habit_id = NEW.habit_id
    AND log_date < NEW.log_date;
  
  -- 获取当前连续天数
  SELECT streak_current INTO streak_days
  FROM public.habits
  WHERE id = NEW.habit_id;
  
  -- 如果是连续打卡，增加连续天数
  IF last_log_date IS NULL OR (NEW.log_date - last_log_date) = 1 THEN
    UPDATE public.habits
    SET 
      streak_current = streak_current + 1,
      streak_longest = GREATEST(streak_longest, streak_current + 1)
    WHERE id = NEW.habit_id;
  ELSE
    -- 不是连续打卡，重置连续天数为1
    UPDATE public.habits
    SET streak_current = 1
    WHERE id = NEW.habit_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_habit_log_created
  AFTER INSERT ON public.habit_logs
  FOR EACH ROW EXECUTE PROCEDURE public.update_habit_streak();

-- 更新任务完成时的统计数据
CREATE OR REPLACE FUNCTION public.update_task_completion_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_completed = TRUE AND (OLD.is_completed = FALSE OR OLD.is_completed IS NULL) THEN
    -- 任务被标记为完成
    INSERT INTO public.statistics (user_id, date, tasks_completed)
    VALUES (NEW.user_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, date)
    DO UPDATE SET tasks_completed = public.statistics.tasks_completed + 1;
  ELSIF NEW.is_completed = FALSE AND OLD.is_completed = TRUE THEN
    -- 任务被标记为未完成
    UPDATE public.statistics
    SET tasks_completed = GREATEST(0, tasks_completed - 1)
    WHERE user_id = NEW.user_id AND date = CURRENT_DATE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_task_completion_changed
  AFTER UPDATE OF is_completed ON public.tasks
  FOR EACH ROW EXECUTE PROCEDURE public.update_task_completion_stats();

-- 更新习惯打卡的统计数据
CREATE OR REPLACE FUNCTION public.update_habit_completion_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.statistics (user_id, date, habits_completed)
  VALUES (NEW.user_id, NEW.log_date, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET habits_completed = public.statistics.habits_completed + 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_habit_log_inserted
  AFTER INSERT ON public.habit_logs
  FOR EACH ROW EXECUTE PROCEDURE public.update_habit_completion_stats();

-- 更新专注会话完成的统计数据
CREATE OR REPLACE FUNCTION public.update_focus_session_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_completed = TRUE AND (OLD.is_completed = FALSE OR OLD.is_completed IS NULL) THEN
    -- 专注会话被标记为完成
    INSERT INTO public.statistics (user_id, date, focus_minutes)
    VALUES (NEW.user_id, CURRENT_DATE, NEW.duration)
    ON CONFLICT (user_id, date)
    DO UPDATE SET focus_minutes = public.statistics.focus_minutes + NEW.duration;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_focus_session_completed
  AFTER UPDATE OF is_completed ON public.focus_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.update_focus_session_stats();