"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDumbbell, 
  faBriefcase, 
  faBook, 
  faPlus, 
  faChevronRight,
  faSignal,
  faWifi,
  faBatteryFull,
  faCalendarAlt,
  faMapMarkerAlt,
  faTasks,
  faCalendarCheck,
  faRobot,
  faCalendar,
  faChartPie,
  faTimes,
  faFolderPlus,
  faPlay,
  faPause,
  faStopwatch,
  faRedo
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { 
  getTaskGroupsWithTasks, 
  getQuadrantTasks,
  updateTaskGroup,
  toggleTaskCompletion as apiToggleTaskCompletion,
  createTask,
  createTaskGroup,
  createPomodoroSession,
  completePomodoroSession,
  TaskGroup as ApiTaskGroup,
  Task as ApiTask,
  QuadrantTasks,
  markTaskAsCompleted
} from "../../api/task-service";

// 将FontAwesome图标映射到字符串
const iconMap: Record<string, IconDefinition> = {
  'dumbbell': faDumbbell,
  'briefcase': faBriefcase,
  'book': faBook,
};

// 获取对应的FontAwesome图标
function getIconForString(iconName: string): IconDefinition {
  return iconMap[iconName] || faBook; // 默认返回book图标
}

export default function TasksPage() {
  // 状态为空数组，等待从API获取数据
  const [taskGroups, setTaskGroups] = useState<ApiTaskGroup[]>([]);

  // 四象限任务状态
  const [quadrantTasks, setQuadrantTasks] = useState<QuadrantTasks>({
    q1: [],
    q2: [],
    q3: [],
    q4: []
  });

  // 当前视图 (任务列表 或 四象限)
  const [currentView, setCurrentView] = useState("task-list");
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  
  // 番茄钟状态
  const [showPomodoroModal, setShowPomodoroModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<{id: string, content: string} | null>(null);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25分钟
  const [isRunning, setIsRunning] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // 添加任务模态框状态
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState<string>("");
  
  // 新任务表单状态
  const [newTaskForm, setNewTaskForm] = useState({
    content: "",
    quadrant: null as number | null,
    group_id: null as string | null,
    priority: "medium" as "high" | "medium" | "low" | null,
    due_date: null as string | null,
    location: null as string | null
  });
  
  // 调试状态
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{ error?: string, message?: string }>({});
  
  // 定时器引用
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 初始数据加载
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setDebugInfo({});
      
      try {
        console.log("开始加载任务数据");
        
        // 加载任务集合数据
        const groups = await getTaskGroupsWithTasks();
        console.log("任务集合数据:", groups);
        setTaskGroups(groups);
        
        // 加载四象限任务数据
        const quadrantData = await getQuadrantTasks();
        console.log("四象限任务数据:", quadrantData);
        setQuadrantTasks(quadrantData);
        
        // 更新调试信息
        setDebugInfo({
          message: `成功加载 ${groups.length} 个任务集合和 ${
            Object.values(quadrantData).flat().length
          } 个四象限任务`
        });
      } catch (error) {
        console.error('Error loading task data:', error);
        setDebugInfo({
          error: error instanceof Error ? error.message : String(error)
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // 检查是否为鉴权错误
  const isAuthError = debugInfo.error?.includes('auth') || debugInfo.error?.includes('user') || debugInfo.error?.includes('authenticated');
  
  // 切换任务集合展开/折叠状态
  const toggleTaskGroup = async (groupId: string) => {
    try {
      // 在UI上立即更新状态，提高响应性
      const updatedGroups = taskGroups.map(group => 
        group.id === groupId ? { ...group, is_open: !group.is_open } : group
      );
      setTaskGroups(updatedGroups);
      
      // 找到当前组的状态
      const group = taskGroups.find(g => g.id === groupId);
      if (group) {
        // 更新数据库中的状态
        await updateTaskGroup(groupId, { is_open: !group.is_open });
      }
    } catch (error) {
      console.error('Error toggling task group:', error);
      // 如果API调用失败，回滚UI状态
      setTaskGroups([...taskGroups]);
    }
  };
  
  // 切换任务完成状态
  const toggleTaskCompletion = async (groupId: string, taskId: string) => {
    try {
      // 找到当前任务
      const group = taskGroups.find(g => g.id === groupId);
      const task = group?.tasks?.find(t => t.id === taskId);
      
      if (!task) return;
      
      // 在UI上立即更新状态
      const updatedGroups = taskGroups.map(group => {
        if (group.id === groupId) {
          const updatedTasks = (group.tasks || []).map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          );
          return { ...group, tasks: updatedTasks };
        }
        return group;
      });
      
      setTaskGroups(updatedGroups);
      
      // 更新数据库中的状态
      await apiToggleTaskCompletion(taskId, !task.completed);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // 如果API调用失败，回滚UI状态
      setTaskGroups([...taskGroups]);
    }
  };

  // 切换四象限任务完成状态
  const toggleQuadrantTaskCompletion = async (quadrant: string, taskId: string) => {
    try {
      // 找到当前任务
      const tasks = quadrantTasks[quadrant as keyof QuadrantTasks];
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) return;
      
      // 在UI上立即更新状态
      const updatedQuadrants = {
        ...quadrantTasks,
        [quadrant]: quadrantTasks[quadrant as keyof QuadrantTasks].map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      };
      
      setQuadrantTasks(updatedQuadrants);
      
      // 更新数据库中的状态
      await apiToggleTaskCompletion(taskId, !task.completed);
    } catch (error) {
      console.error('Error toggling quadrant task completion:', error);
      // 如果API调用失败，回滚UI状态
      setQuadrantTasks({...quadrantTasks});
    }
  };
  
  // 打开番茄钟模态框
  const openPomodoroModal = (taskContent: string, taskId: string) => {
    setCurrentTask({id: taskId, content: taskContent});
    setShowPomodoroModal(true);
    setPomodoroTime(25 * 60); // 重置为25分钟
    setIsRunning(false);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };
  
  // 关闭番茄钟模态框
  const closePomodoroModal = () => {
    setShowPomodoroModal(false);
    setCurrentTask(null);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };
  
  // 开始/暂停番茄钟
  const toggleTimer = async () => {
    if (isRunning) {
      // 暂停计时器
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
      }
      setIsRunning(false);
    } else {
      // 开始计时器
      if (!sessionId && currentTask) {
        try {
          // 创建新的番茄钟会话
          const session = await createPomodoroSession(currentTask.id, 25);
          setSessionId(session.id);
        } catch (error) {
          console.error("创建番茄钟会话失败:", error);
        }
      }
      
      const id = setInterval(() => {
        setPomodoroTime(prevTime => {
          if (prevTime <= 1) {
            // 时间到，停止计时器
            clearInterval(id);
            setIsRunning(false);
            handlePomodoroComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      setTimerId(id);
      setIsRunning(true);
    }
  };
  
  // 重置番茄钟
  const resetTimer = () => {
    setPomodoroTime(25 * 60);
    setIsRunning(false);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };
  
  // 番茄钟完成处理
  const handlePomodoroComplete = async () => {
    if (sessionId && currentTask) {
      try {
        // 更新番茄钟会话为已完成
        await completePomodoroSession(sessionId);
        
        // 将任务标记为已完成
        await markTaskAsCompleted(currentTask.id);
        
        // 刷新任务列表
        setIsLoading(true);
        try {
          // 加载任务集合数据
          const groups = await getTaskGroupsWithTasks();
          setTaskGroups(groups);
          
          // 加载四象限任务数据
          const quadrantData = await getQuadrantTasks();
          setQuadrantTasks(quadrantData);
        } catch (error) {
          console.error('Error loading task data:', error);
        } finally {
          setIsLoading(false);
        }
        
        // 关闭模态框
        setTimeout(() => {
          closePomodoroModal();
        }, 1000);
      } catch (error) {
        console.error("完成番茄钟会话失败:", error);
      }
    }
  };
  
  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 清理计时器
  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);
  
  // 添加任务
  const handleAddTask = async () => {
    if (!newTaskForm.content.trim()) return;
    
    try {
      const taskData = {
        ...newTaskForm,
        completed: false
      };
      
      // 根据不同场景创建任务
      let newTask: ApiTask | null = null;
      if (newTaskForm.quadrant) {
        // 创建四象限任务
        newTask = await createTask(taskData);
        
        // 更新四象限任务状态
        if (newTask) {
          const quadrantKey = `q${newTaskForm.quadrant}` as keyof QuadrantTasks;
          setQuadrantTasks({
            ...quadrantTasks,
            [quadrantKey]: [...quadrantTasks[quadrantKey], newTask]
          });
        }
      } else if (newTaskForm.group_id) {
        // 创建任务集中的任务
        newTask = await createTask(taskData);
        
        // 更新任务集合状态
        if (newTask) {
          setTaskGroups(taskGroups.map(group => {
            if (group.id === newTaskForm.group_id) {
              return {
                ...group,
                tasks: [...(group.tasks || []), newTask as ApiTask]
              };
            }
            return group;
          }));
        }
      }
      
      // 重置表单
      setNewTaskForm({
        content: "",
        quadrant: null,
        group_id: null,
        priority: "medium",
        due_date: null,
        location: null
      });
      
      // 关闭模态框
      setShowAddTaskModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  
  // 添加任务集合
  const handleAddTaskGroup = async (name: string, icon: string, iconColor: string) => {
    try {
      const newGroup = await createTaskGroup({
        name,
        icon,
        icon_color: iconColor,
        is_open: true
      });
      
      // 更新本地状态
      setTaskGroups([...taskGroups, { ...newGroup, tasks: [] }]);
    } catch (error) {
      console.error('Error adding task group:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* iOS Header */}
      <div className="h-11 flex justify-between items-center px-4 bg-white/80 backdrop-blur-md border-b border-b-black/10">
        <div className="flex-1">
          {/* Debug button */}
          <button 
            className="text-xs text-gray-400 underline"
            onClick={() => setShowDebug(!showDebug)}
          >
            Debug
          </button>
        </div>
        <div className="segmented-control flex items-center bg-[#F2F2F7] rounded-lg px-0.5 py-0.5 h-8">
          <div 
            className={`segment px-4 py-1.5 text-xs font-medium relative cursor-pointer transition-all duration-200 ease-in-out z-10 ${currentView === 'task-list' ? 'text-[#1C1C1E]' : 'text-[#8E8E93]'}`}
            onClick={() => setCurrentView('task-list')}
          >
            任务集
            {currentView === 'task-list' && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#007AFF] rounded-sm"></div>
            )}
          </div>
          <div 
            className={`segment px-4 py-1.5 text-xs font-medium relative cursor-pointer transition-all duration-200 ease-in-out z-10 ${currentView === 'quadrant' ? 'text-[#1C1C1E]' : 'text-[#8E8E93]'}`}
            onClick={() => setCurrentView('quadrant')}
          >
            四象限
            {currentView === 'quadrant' && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#007AFF] rounded-sm"></div>
            )}
          </div>
        </div>
        <div 
          className="flex-1 flex justify-end"
          onClick={() => setShowAddTaskModal(true)}
        >
          <div className="ios-header-action w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm cursor-pointer transition-all duration-200 ease-in-out active:transform active:scale-95">
            <FontAwesomeIcon icon={faPlus} className="text-[#007AFF]" />
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <div className="w-8 h-8 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Authentication Error */}
      {!isLoading && isAuthError && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#F2F2F7]">
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-md w-full text-center">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-xl font-semibold mb-2">登录以查看您的任务</h2>
            <p className="text-gray-500 mb-6">请先登录或注册一个账户来管理您的任务和习惯。</p>
            <div className="flex flex-col gap-3">
              <a 
                href="/sign-in" 
                className="block w-full py-3 bg-blue-500 text-white rounded-lg font-medium"
              >
                登录
              </a>
              <a 
                href="/sign-up" 
                className="block w-full py-3 border border-gray-300 rounded-lg font-medium"
              >
                注册新账户
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Content Area */}
      {!isLoading && !isAuthError && (
        <div className="flex-1 overflow-y-auto bg-[#F2F2F7]">
          {/* Task List View */}
          {currentView === 'task-list' && (
            <div className="task-list-view">
              {taskGroups.map((group) => (
                <div key={group.id} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleTaskGroup(group.id)}
                    >
                      <div className="mr-2">
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className={`transition-transform duration-300 ease-in-out ${group.is_open ? 'transform rotate-90' : ''}`}
                        />
                      </div>
                      
                      <div className="font-semibold">{group.name}</div>
                    </div>
                    
                    {/* 添加任务按钮 */}
                    <button
                      className="text-primary hover:text-primary-dark transition-colors"
                      onClick={() => {
                        setCurrentGroupId(group.id);
                        setShowAddTaskModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  
                  {group.is_open && group.tasks && (
                    <div className="pl-6">
                      {group.tasks.map((task) => (
                        <div key={task.id} className="flex flex-col py-3 border-b border-gray-100">
                          <div className="flex items-center">
                            <div 
                              className={`task-checkbox w-5 h-5 rounded-full border-2 mr-3 relative transition-all duration-200 cursor-pointer
                                ${task.completed ? 
                                  'bg-[#007AFF] border-[#007AFF]' : 
                                  task.priority === 'high' ? 'border-red-500' :
                                  task.priority === 'medium' ? 'border-yellow-500' :
                                  task.priority === 'low' ? 'border-green-500' : 'border-[#8E8E93]'
                                }`}
                              onClick={() => toggleTaskCompletion(group.id, task.id)}
                            >
                              {task.completed && (
                                <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className={`${task.completed ? 'line-through text-gray-400' : 'font-medium'}`}>
                                  {task.content}
                                </span>
                                {task.priority && !task.completed && (
                                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded 
                                    ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                      'bg-green-100 text-green-700'}`}
                                  >
                                    {task.priority === 'high' ? '高' : 
                                     task.priority === 'medium' ? '中' : '低'}
                                  </span>
                                )}
                              </div>
                              
                              {/* 任务详情 */}
                              {(task.due_date || task.location) && !task.completed && (
                                <div className="task-details mt-1 text-xs text-gray-500 flex flex-wrap gap-x-3">
                                  {task.due_date && (
                                    <div className="flex items-center">
                                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                      {new Date(task.due_date).toLocaleDateString()} {new Date(task.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                  )}
                                  {task.location && (
                                    <div className="flex items-center">
                                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                      {task.location}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* 番茄钟按钮 */}
                            <button
                              className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                              onClick={() => openPomodoroModal(task.content, task.id)}
                              title="开始番茄钟"
                            >
                              <FontAwesomeIcon icon={faPlay} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Quadrant View */}
          {currentView === 'quadrant' && (
            <div className="quadrant-view">
              <div className="quadrant-container grid grid-cols-2 grid-rows-2 gap-px bg-[#F2F2F7] h-[calc(100vh-180px)]">
                <div className="quadrant bg-white p-4 flex flex-col opacity-0 animate-[fadeIn_0.6s_ease_forwards]" style={{ animationDelay: '0s' }}>
                  <div className="quadrant-title text-sm font-semibold mb-3 flex items-center gap-2">
                    <i className="w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center text-xs">I</i>
                    重要且紧急
                  </div>
                  <div className="quadrant-content flex-1 overflow-y-auto">
                    {quadrantTasks.q1.map(task => (
                      <div 
                        key={task.id} 
                        className="task-item py-3 px-4 bg-white mb-2 rounded-lg shadow-sm flex flex-col cursor-pointer active:bg-gray-50 transition-colors"
                        onClick={() => openPomodoroModal(task.content, task.id)}
                      >
                        <div className="flex items-center">
                          <div 
                            className={`task-checkbox w-5 h-5 rounded-full border-2 mr-3 relative transition-all duration-200 
                            ${task.completed ? 'bg-[#007AFF] border-[#007AFF]' : 
                              task.priority === 'high' ? 'border-red-500' :
                              task.priority === 'medium' ? 'border-yellow-500' :
                              task.priority === 'low' ? 'border-green-500' : 'border-[#8E8E93]'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleQuadrantTaskCompletion('q1', task.id);
                            }}
                          >
                            {task.completed && (
                              <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className={`${task.completed ? 'line-through text-[#8E8E93]' : 'font-medium'}`}>
                                {task.content}
                              </span>
                              {task.priority && !task.completed && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded 
                                  ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                    'bg-green-100 text-green-700'}`}
                              >
                                {task.priority === 'high' ? '高' : 
                                 task.priority === 'medium' ? '中' : '低'}
                              </span>
                              )}
                            </div>
                            
                            {/* Task details */}
                            {(task.due_date || task.location) && !task.completed && (
                              <div className="task-details mt-1 text-xs text-gray-500 flex flex-wrap gap-x-3">
                                {task.due_date && (
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                    {new Date(task.due_date).toLocaleDateString()} {new Date(task.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                )}
                                {task.location && (
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                    {task.location}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {quadrantTasks.q1.length === 0 && (
                      <div className="no-tasks text-[#8E8E93] text-sm text-center mt-5">没有任务</div>
                    )}
                  </div>
                </div>
                
                <div className="quadrant bg-white p-4 flex flex-col opacity-0 animate-[fadeIn_0.6s_ease_forwards]" style={{ animationDelay: '0.3s' }}>
                  <div className="quadrant-title text-sm font-semibold mb-3 flex items-center gap-2">
                    <i className="w-5 h-5 rounded-full bg-[#FF9500] text-white flex items-center justify-center text-xs">II</i>
                    重要不紧急
                  </div>
                  <div className="quadrant-content flex-1 overflow-y-auto">
                    {quadrantTasks.q2.map(task => (
                      <div 
                        key={task.id} 
                        className="task-item py-3 px-4 bg-white mb-2 rounded-lg shadow-sm flex flex-col cursor-pointer active:bg-gray-50 transition-colors"
                        onClick={() => openPomodoroModal(task.content, task.id)}
                      >
                        <div className="flex items-center">
                          <div 
                            className={`task-checkbox w-5 h-5 rounded-full border-2 mr-3 relative transition-all duration-200 
                            ${task.completed ? 'bg-[#007AFF] border-[#007AFF]' : 
                              task.priority === 'high' ? 'border-red-500' :
                              task.priority === 'medium' ? 'border-yellow-500' :
                              task.priority === 'low' ? 'border-green-500' : 'border-[#8E8E93]'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleQuadrantTaskCompletion('q2', task.id);
                            }}
                          >
                            {task.completed && (
                              <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className={`${task.completed ? 'line-through text-[#8E8E93]' : 'font-medium'}`}>
                                {task.content}
                              </span>
                              {task.priority && !task.completed && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded 
                                  ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                    'bg-green-100 text-green-700'}`}
                              >
                                {task.priority === 'high' ? '高' : 
                                 task.priority === 'medium' ? '中' : '低'}
                              </span>
                              )}
                            </div>
                            
                            {/* Task details */}
                            {(task.due_date || task.location) && !task.completed && (
                              <div className="task-details mt-1 text-xs text-gray-500 flex flex-wrap gap-x-3">
                                {task.due_date && (
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                    {new Date(task.due_date).toLocaleDateString()} {new Date(task.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                )}
                                {task.location && (
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                    {task.location}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {quadrantTasks.q2.length === 0 && (
                      <div className="no-tasks text-[#8E8E93] text-sm text-center mt-5">没有任务</div>
                    )}
                  </div>
                </div>
                
                <div className="quadrant bg-white p-4 flex flex-col opacity-0 animate-[fadeIn_0.6s_ease_forwards]" style={{ animationDelay: '0.6s' }}>
                  <div className="quadrant-title text-sm font-semibold mb-3 flex items-center gap-2">
                    <i className="w-5 h-5 rounded-full bg-[#007AFF] text-white flex items-center justify-center text-xs">III</i>
                    不重要但紧急
                  </div>
                  <div className="quadrant-content flex-1 overflow-y-auto">
                    {quadrantTasks.q3.map(task => (
                      <div 
                        key={task.id} 
                        className="task-item py-3 px-4 bg-white mb-2 rounded-lg shadow-sm flex flex-col cursor-pointer active:bg-gray-50 transition-colors"
                        onClick={() => openPomodoroModal(task.content, task.id)}
                      >
                        <div className="flex items-center">
                          <div 
                            className={`task-checkbox w-5 h-5 rounded-full border-2 mr-3 relative transition-all duration-200 
                            ${task.completed ? 'bg-[#007AFF] border-[#007AFF]' : 
                              task.priority === 'high' ? 'border-red-500' :
                              task.priority === 'medium' ? 'border-yellow-500' :
                              task.priority === 'low' ? 'border-green-500' : 'border-[#8E8E93]'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleQuadrantTaskCompletion('q3', task.id);
                            }}
                          >
                            {task.completed && (
                              <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className={`${task.completed ? 'line-through text-[#8E8E93]' : 'font-medium'}`}>
                                {task.content}
                              </span>
                              {task.priority && !task.completed && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded 
                                  ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                    'bg-green-100 text-green-700'}`}
                              >
                                {task.priority === 'high' ? '高' : 
                                 task.priority === 'medium' ? '中' : '低'}
                              </span>
                              )}
                            </div>
                            
                            {/* Task details */}
                            {(task.due_date || task.location) && !task.completed && (
                              <div className="task-details mt-1 text-xs text-gray-500 flex flex-wrap gap-x-3">
                                {task.due_date && (
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                    {new Date(task.due_date).toLocaleDateString()} {new Date(task.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                )}
                                {task.location && (
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                    {task.location}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {quadrantTasks.q3.length < 2 && (
                      <div className="no-tasks text-[#8E8E93] text-sm text-center mt-5">没有更多任务</div>
                    )}
                  </div>
                </div>
                
                <div className="quadrant bg-white p-4 flex flex-col opacity-0 animate-[fadeIn_0.6s_ease_forwards]" style={{ animationDelay: '0.9s' }}>
                  <div className="quadrant-title text-sm font-semibold mb-3 flex items-center gap-2">
                    <i className="w-5 h-5 rounded-full bg-[#8E8E93] text-white flex items-center justify-center text-xs">IV</i>
                    不重要不紧急
                  </div>
                  <div className="quadrant-content flex-1 overflow-y-auto">
                    {quadrantTasks.q4.map(task => (
                      <div 
                        key={task.id} 
                        className="task-item py-3 px-4 bg-white mb-2 rounded-lg shadow-sm flex flex-col cursor-pointer active:bg-gray-50 transition-colors"
                        onClick={() => openPomodoroModal(task.content, task.id)}
                      >
                        <div className="flex items-center">
                          <div 
                            className={`task-checkbox w-5 h-5 rounded-full border-2 mr-3 relative transition-all duration-200 
                            ${task.completed ? 'bg-[#007AFF] border-[#007AFF]' : 
                              task.priority === 'high' ? 'border-red-500' :
                              task.priority === 'medium' ? 'border-yellow-500' :
                              task.priority === 'low' ? 'border-green-500' : 'border-[#8E8E93]'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleQuadrantTaskCompletion('q4', task.id);
                            }}
                          >
                            {task.completed && (
                              <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className={`${task.completed ? 'line-through text-[#8E8E93]' : 'font-medium'}`}>
                                {task.content}
                              </span>
                              {task.priority && !task.completed && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded 
                                  ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                    'bg-green-100 text-green-700'}`}
                              >
                                {task.priority === 'high' ? '高' : 
                                 task.priority === 'medium' ? '中' : '低'}
                              </span>
                              )}
                            </div>
                            
                            {/* Task details */}
                            {(task.due_date || task.location) && !task.completed && (
                              <div className="task-details mt-1 text-xs text-gray-500 flex flex-wrap gap-x-3">
                                {task.due_date && (
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                    {new Date(task.due_date).toLocaleDateString()} {new Date(task.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                )}
                                {task.location && (
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                    {task.location}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {quadrantTasks.q4.length < 2 && (
                      <div className="no-tasks text-[#8E8E93] text-sm text-center mt-5">没有更多任务</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pomodoro Modal */}
      {showPomodoroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-11/12 max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <button
              onClick={closePomodoroModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="mb-6 text-center">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                <FontAwesomeIcon icon={faStopwatch} className="mr-2" />
                专注计时
              </h3>
              <p className="text-sm text-gray-600">{currentTask?.content}</p>
            </div>

            <div className="relative mb-8 h-48 w-48 mx-auto">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#4F46E5 ${isRunning ? ((25 * 60 - pomodoroTime) / (25 * 60)) * 100 : 0}% 100%)`,
                }}
              />
              <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white">
                <span className="text-4xl font-bold text-gray-800">{formatTime(pomodoroTime)}</span>
              </div>
            </div>

            <div className="mb-6 flex justify-center space-x-4">
              <button
                onClick={toggleTimer}
                className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                <FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
              </button>
              <button
                onClick={resetTimer}
                className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                <FontAwesomeIcon icon={faRedo} />
              </button>
            </div>

            <button
              onClick={closePomodoroModal}
              className="w-full rounded-lg bg-indigo-600 py-3 text-white shadow-md transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              取消
            </button>
          </div>
        </div>
      )}
      
      {/* Add Task Modal */}
      {showAddTaskModal && (
        <>
          <div 
            className="overlay fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowAddTaskModal(false)}
          ></div>
          
          <div className="add-task-modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-5 w-[90%] max-w-[400px] z-50 animate-[fadeIn_0.3s_ease_forwards]">
            <div className="modal-header flex justify-between items-center mb-4">
              <div className="modal-title text-lg font-semibold">添加任务</div>
              <div 
                className="modal-close text-[#8E8E93] cursor-pointer text-lg"
                onClick={() => setShowAddTaskModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
            
            <div className="form-container space-y-4">
              {/* 任务内容 */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">任务内容</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入任务内容..."
                  value={newTaskForm.content}
                  onChange={(e) => setNewTaskForm({...newTaskForm, content: e.target.value})}
                />
              </div>
              
              {/* 选择位置 */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">添加至</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      currentView === 'task-list' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => {
                      setNewTaskForm({
                        ...newTaskForm,
                        group_id: taskGroups.length > 0 ? taskGroups[0].id : null,
                        quadrant: null
                      });
                    }}
                  >
                    任务集
                  </button>
                  <button
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      currentView === 'quadrant' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => {
                      setNewTaskForm({
                        ...newTaskForm,
                        group_id: null,
                        quadrant: 1
                      });
                    }}
                  >
                    四象限
                  </button>
                </div>
              </div>
              
              {/* 任务集选择器 */}
              {newTaskForm.group_id !== null && (
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">选择任务集</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newTaskForm.group_id || ""}
                    onChange={(e) => setNewTaskForm({...newTaskForm, group_id: e.target.value})}
                  >
                    {taskGroups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* 四象限选择器 */}
              {newTaskForm.quadrant !== null && (
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">选择象限</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`p-2 text-xs rounded-md transition-colors ${
                        newTaskForm.quadrant === 1 ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setNewTaskForm({...newTaskForm, quadrant: 1})}
                    >
                      I: 重要且紧急
                    </button>
                    <button
                      className={`p-2 text-xs rounded-md transition-colors ${
                        newTaskForm.quadrant === 2 ? 'bg-orange-100 text-orange-700 border border-orange-300' : 'bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setNewTaskForm({...newTaskForm, quadrant: 2})}
                    >
                      II: 重要不紧急
                    </button>
                    <button
                      className={`p-2 text-xs rounded-md transition-colors ${
                        newTaskForm.quadrant === 3 ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setNewTaskForm({...newTaskForm, quadrant: 3})}
                    >
                      III: 不重要但紧急
                    </button>
                    <button
                      className={`p-2 text-xs rounded-md transition-colors ${
                        newTaskForm.quadrant === 4 ? 'bg-gray-200 text-gray-700 border border-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setNewTaskForm({...newTaskForm, quadrant: 4})}
                    >
                      IV: 不重要不紧急
                    </button>
                  </div>
                </div>
              )}
              
              {/* 优先级选择 */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                      newTaskForm.priority === 'high' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setNewTaskForm({...newTaskForm, priority: 'high'})}
                  >
                    高
                  </button>
                  <button
                    className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                      newTaskForm.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setNewTaskForm({...newTaskForm, priority: 'medium'})}
                  >
                    中
                  </button>
                  <button
                    className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                      newTaskForm.priority === 'low' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setNewTaskForm({...newTaskForm, priority: 'low'})}
                  >
                    低
                  </button>
                </div>
              </div>
              
              {/* 截止日期 */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
                <input 
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTaskForm.due_date || ""}
                  onChange={(e) => setNewTaskForm({...newTaskForm, due_date: e.target.value})}
                />
              </div>
              
              {/* 位置 */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入地点..."
                  value={newTaskForm.location || ""}
                  onChange={(e) => setNewTaskForm({...newTaskForm, location: e.target.value})}
                />
              </div>
            </div>
            
            <div className="modal-footer mt-6 flex space-x-3">
              <button
                className="flex-1 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors hover:bg-gray-300"
                onClick={() => setShowAddTaskModal(false)}
              >
                取消
              </button>
              <button
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg font-medium transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddTask}
                disabled={!newTaskForm.content.trim()}
              >
                添加
              </button>
            </div>
          </div>
        </>
      )}

      {/* Debug information */}
      {showDebug && (
        <div className="absolute top-12 left-0 right-0 bg-black/90 text-white p-4 z-50 rounded-b-lg text-xs font-mono">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          {debugInfo.error && (
            <div className="text-red-400 mb-2">
              Error: {debugInfo.error}
            </div>
          )}
          {debugInfo.message && (
            <div className="mb-2">
              {debugInfo.message}
            </div>
          )}
          <div className="mb-2">
            Task Groups: {taskGroups.length}
          </div>
          <div className="mb-2">
            Tasks in Groups: {taskGroups.reduce((acc, group) => acc + (group.tasks?.length || 0), 0)}
          </div>
          <div>
            Quadrant Tasks: {Object.values(quadrantTasks).flat().length}
          </div>
          <button 
            className="mt-4 px-3 py-1 bg-blue-600 rounded text-white text-xs"
            onClick={() => {
              window.location.href = "/debug";
            }}
          >
            Full Debug Page
          </button>
        </div>
      )}
    </div>
  );
}

// Add this CSS at the end of your file or in your global styles
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.2s ease forwards;
  }
`; 