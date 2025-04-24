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
  faStopwatch
} from "@fortawesome/free-solid-svg-icons";

export default function TasksPage() {
  // State for task groups
  const [taskGroups, setTaskGroups] = useState([
    {
      id: 1,
      name: "健身",
      icon: faDumbbell,
      iconColor: "#FF3B30",
      isOpen: true,
      tasks: [
        { id: 101, content: "练肩", completed: false },
        { id: 102, content: "练背", completed: false },
        { id: 103, content: "练胸", completed: false },
      ]
    },
    {
      id: 2,
      name: "工作",
      icon: faBriefcase,
      iconColor: "#007AFF",
      isOpen: false,
      tasks: [
        { id: 201, content: "周会准备", completed: false },
        { id: 202, content: "回复邮件", completed: false },
        { id: 203, content: "提交报告", completed: true },
      ]
    },
    {
      id: 3,
      name: "学习",
      icon: faBook,
      iconColor: "#34C759",
      isOpen: false,
      tasks: [
        { id: 301, content: "阅读英语", completed: false },
        { id: 302, content: "Swift课程", completed: false },
      ]
    }
  ]);

  // State for quadrant tasks
  const [quadrantTasks, setQuadrantTasks] = useState({
    q1: [
      { id: 401, content: "提交报告", completed: false },
      { id: 402, content: "回复紧急邮件", completed: false },
    ],
    q2: [
      { id: 403, content: "学习Swift", completed: false },
      { id: 404, content: "健身计划", completed: false },
    ],
    q3: [
      { id: 405, content: "电话会议", completed: false },
    ],
    q4: [
      { id: 406, content: "整理邮箱", completed: false },
    ]
  });

  // State for current view (task list or quadrant)
  const [currentView, setCurrentView] = useState("task-list");
  
  // Pomodoro States
  const [showPomodoroModal, setShowPomodoroModal] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  const [pomodoroTime, setPomodoroTime] = useState("25:00");
  const [pomodoroProgress, setPomodoroProgress] = useState(0);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [activePreset, setActivePreset] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  
  // State for add task modal
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  
  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Toggle task group open/closed
  const toggleTaskGroup = (groupId: number) => {
    setTaskGroups(taskGroups.map(group => 
      group.id === groupId ? { ...group, isOpen: !group.isOpen } : group
    ));
  };
  
  // Toggle task completion
  const toggleTaskCompletion = (groupId: number, taskId: number) => {
    setTaskGroups(taskGroups.map(group => {
      if (group.id === groupId) {
        const updatedTasks = group.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        return { ...group, tasks: updatedTasks };
      }
      return group;
    }));
  };

  // Toggle quadrant task completion
  const toggleQuadrantTaskCompletion = (quadrant: string, taskId: number) => {
    setQuadrantTasks({
      ...quadrantTasks,
      [quadrant]: quadrantTasks[quadrant as keyof typeof quadrantTasks].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    });
  };
  
  // Pomodoro Functions
  const openPomodoroModal = (taskName: string) => {
    setCurrentTask(taskName);
    setShowPomodoroModal(true);
  };

  const closePomodoroModal = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setShowPomodoroModal(false);
    setIsPomodoroActive(false);
    selectPomodoroPreset(activePreset);
  };

  const selectPomodoroPreset = (minutes: number) => {
    setActivePreset(minutes);
    setTimeLeft(minutes * 60);
    setPomodoroTime(`${minutes}:00`);
    setPomodoroProgress(0);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setIsPomodoroActive(false);
  };

  const togglePomodoroTimer = () => {
    if (isPomodoroActive) {
      // Pause timer
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
      }
      setIsPomodoroActive(false);
    } else {
      // Start timer
      const totalSeconds = activePreset * 60;
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsPomodoroActive(false);
            return 0;
          }
          const newTimeLeft = prev - 1;
          const minutes = Math.floor(newTimeLeft / 60);
          const seconds = newTimeLeft % 60;
          setPomodoroTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
          setPomodoroProgress(((totalSeconds - newTimeLeft) / totalSeconds) * 100);
          return newTimeLeft;
        });
      }, 1000);
      setTimerId(timer);
      setIsPomodoroActive(true);
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);
  
  return (
    <div className="flex flex-col h-full">


      {/* iOS Header */}
      <div className="h-11 flex justify-between items-center px-4 bg-white/80 backdrop-blur-md border-b border-b-black/10">
        <div className="flex-1"></div>
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
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#F2F2F7]">
        {/* Task List View */}
        {currentView === 'task-list' && (
          <div className="task-list-view">
            {taskGroups.map(group => (
              <div key={group.id} className="task-list-group">
                <div 
                  className="task-list-header py-4 px-4 font-semibold text-lg flex justify-between items-center cursor-pointer"
                  onClick={() => toggleTaskGroup(group.id)}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={group.icon} className="mr-2" style={{ color: group.iconColor }} />
                    <span>{group.name}</span>
                  </div>
                  <FontAwesomeIcon 
                    icon={faChevronRight} 
                    className={`transition-transform duration-300 ease-in-out ${group.isOpen ? 'transform rotate-90' : ''}`}
                  />
                </div>
                
                <div className={`${group.isOpen ? 'max-h-[1000px]' : 'max-h-0'} overflow-hidden transition-[max-height] duration-300 ease-in-out`}>
                  {group.tasks.map(task => (
                    <div 
                      key={task.id} 
                      className="task-item py-3.5 px-4 bg-white my-[1px] flex items-center cursor-pointer"
                      onClick={(e) => {
                        if (!(e.target as Element).closest('.task-checkbox')) {
                          openPomodoroModal(task.content);
                        }
                      }}
                    >
                      <div 
                        className={`task-checkbox w-6 h-6 rounded-full border-2 mr-3 relative transition-all duration-200 cursor-pointer
                          ${task.completed ? 'bg-[#007AFF] border-[#007AFF]' : 'border-[#D1D5DB] hover:border-[#007AFF]'}
                          hover:scale-105 active:scale-95`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskCompletion(group.id, task.id);
                        }}
                      >
                        {task.completed && (
                          <svg 
                            className="absolute inset-0 m-auto w-3 h-3 text-white animate-fadeIn" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={3} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                        )}
                      </div>
                      <div className={`task-content text-base ${task.completed ? 'line-through text-[#8E8E93]' : 'text-[#1C1C1E]'}`}>
                        {task.content}
                      </div>
                    </div>
                  ))}
                </div>
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
                    <div key={task.id} className="task-item py-3.5 px-4 bg-white my-[1px] flex items-center cursor-pointer">
                      <div 
                        className={`task-checkbox w-5.5 h-5.5 rounded-full border-2 border-[#8E8E93] mr-3 relative transition-all duration-200 ${task.completed ? 'bg-[#007AFF] border-[#007AFF]' : ''}`}
                        onClick={() => toggleQuadrantTaskCompletion('q1', task.id)}
                      >
                        {task.completed && (
                          <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                        )}
                      </div>
                      <div className={`task-content ${task.completed ? 'line-through text-[#8E8E93]' : ''}`}>
                        {task.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="quadrant bg-white p-4 flex flex-col opacity-0 animate-[fadeIn_0.6s_ease_forwards]" style={{ animationDelay: '0.3s' }}>
                <div className="quadrant-title text-sm font-semibold mb-3 flex items-center gap-2">
                  <i className="w-5 h-5 rounded-full bg-[#FF9500] text-white flex items-center justify-center text-xs">II</i>
                  重要不紧急
                </div>
                <div className="quadrant-content flex-1 overflow-y-auto">
                  {quadrantTasks.q2.map(task => (
                    <div key={task.id} className="task-item py-3.5 px-4 bg-white my-[1px] flex items-center cursor-pointer">
                      <div 
                        className={`task-checkbox w-5.5 h-5.5 rounded-full border-2 border-[#8E8E93] mr-3 relative transition-all duration-200 ${task.completed ? 'bg-[#007AFF] border-[#007AFF]' : ''}`}
                        onClick={() => toggleQuadrantTaskCompletion('q2', task.id)}
                      >
                        {task.completed && (
                          <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                        )}
                      </div>
                      <div className={`task-content ${task.completed ? 'line-through text-[#8E8E93]' : ''}`}>
                        {task.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="quadrant bg-white p-4 flex flex-col opacity-0 animate-[fadeIn_0.6s_ease_forwards]" style={{ animationDelay: '0.6s' }}>
                <div className="quadrant-title text-sm font-semibold mb-3 flex items-center gap-2">
                  <i className="w-5 h-5 rounded-full bg-[#007AFF] text-white flex items-center justify-center text-xs">III</i>
                  不重要但紧急
                </div>
                <div className="quadrant-content flex-1 overflow-y-auto">
                  {quadrantTasks.q3.map(task => (
                    <div key={task.id} className="task-item py-3.5 px-4 bg-white my-[1px] flex items-center cursor-pointer">
                      <div 
                        className={`task-checkbox w-5.5 h-5.5 rounded-full border-2 border-[#8E8E93] mr-3 relative transition-all duration-200 ${task.completed ? 'bg-[#007AFF] border-[#007AFF]' : ''}`}
                        onClick={() => toggleQuadrantTaskCompletion('q3', task.id)}
                      >
                        {task.completed && (
                          <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                        )}
                      </div>
                      <div className={`task-content ${task.completed ? 'line-through text-[#8E8E93]' : ''}`}>
                        {task.content}
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
                    <div key={task.id} className="task-item py-3.5 px-4 bg-white my-[1px] flex items-center cursor-pointer">
                      <div 
                        className={`task-checkbox w-5.5 h-5.5 rounded-full border-2 border-[#8E8E93] mr-3 relative transition-all duration-200 ${task.completed ? 'bg-[#007AFF] border-[#007AFF]' : ''}`}
                        onClick={() => toggleQuadrantTaskCompletion('q4', task.id)}
                      >
                        {task.completed && (
                          <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                        )}
                      </div>
                      <div className={`task-content ${task.completed ? 'line-through text-[#8E8E93]' : ''}`}>
                        {task.content}
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
              <p className="text-sm text-gray-600">{currentTask}</p>
            </div>

            <div className="relative mb-8 h-48 w-48 mx-auto">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#4F46E5 ${pomodoroProgress}%, #E5E7EB ${pomodoroProgress}% 100%)`,
                }}
              />
              <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white">
                <span className="text-4xl font-bold text-gray-800">{pomodoroTime}</span>
              </div>
            </div>

            <div className="mb-6 flex justify-center space-x-4">
              <button
                onClick={() => selectPomodoroPreset(25)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activePreset === 25
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                25分钟
              </button>
              <button
                onClick={() => selectPomodoroPreset(45)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activePreset === 45
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                45分钟
              </button>
              <button
                onClick={() => selectPomodoroPreset(60)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activePreset === 60
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                60分钟
              </button>
            </div>

            <button
              onClick={togglePomodoroTimer}
              className="w-full rounded-lg bg-indigo-600 py-3 text-white shadow-md transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FontAwesomeIcon icon={isPomodoroActive ? faPause : faPlay} className="mr-2" />
              {isPomodoroActive ? "暂停" : "开始"}
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
          
          <div className="add-task-modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-5 w-[85%] max-w-[320px] z-50 animate-[fadeIn_0.3s_ease_forwards]">
            <div className="modal-header flex justify-between items-center mb-4">
              <div className="modal-title text-lg font-semibold">添加任务</div>
              <div 
                className="modal-close text-[#8E8E93] cursor-pointer text-lg"
                onClick={() => setShowAddTaskModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
            
            <div className="option-buttons flex flex-col gap-3">
              <div 
                className="option-button flex items-center py-3 px-4 bg-[#F2F2F7] rounded-lg cursor-pointer active:scale-98 active:bg-[rgba(0,122,255,0.1)] transition-all duration-200"
                onClick={() => {
                  alert('新建集合功能将在未来版本推出');
                  setShowAddTaskModal(false);
                }}
              >
                <div className="option-icon w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center text-white mr-3">
                  <FontAwesomeIcon icon={faFolderPlus} />
                </div>
                <div className="option-text font-medium">新建集合</div>
              </div>
              
              <div 
                className="option-button flex items-center py-3 px-4 bg-[#F2F2F7] rounded-lg cursor-pointer active:scale-98 active:bg-[rgba(0,122,255,0.1)] transition-all duration-200"
                onClick={() => {
                  alert('新建子任务功能将在未来版本推出');
                  setShowAddTaskModal(false);
                }}
              >
                <div className="option-icon w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center text-white mr-3">
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <div className="option-text font-medium">新建子任务</div>
              </div>
            </div>
          </div>
        </>
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