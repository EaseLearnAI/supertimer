"use client";

import { useState } from "react";

export default function HabitsPage() {
  const [habits, setHabits] = useState([
    { 
      id: 1, 
      name: "阅读", 
      streak: 28, 
      icon: "book", 
      color: "#5AC8FA", 
      completed: true,
      days: [
        { day: "一", completed: true },
        { day: "二", completed: true },
        { day: "三", completed: true, isToday: true },
        { day: "四", completed: false },
        { day: "五", completed: false },
        { day: "六", completed: false },
        { day: "日", completed: false }
      ]
    },
    { 
      id: 2, 
      name: "锻炼", 
      streak: 15, 
      icon: "running", 
      color: "#FF9500", 
      completed: false,
      days: [
        { day: "一", completed: true },
        { day: "二", completed: false },
        { day: "三", completed: false, isToday: true },
        { day: "四", completed: false },
        { day: "五", completed: false },
        { day: "六", completed: false },
        { day: "日", completed: false }
      ]
    },
    { 
      id: 3, 
      name: "冥想", 
      streak: 7, 
      icon: "spa", 
      color: "#AF52DE", 
      completed: false,
      progress: 70,
    },
    { 
      id: 4, 
      name: "日记", 
      streak: 21, 
      icon: "pencil-alt", 
      color: "#34C759", 
      completed: false,
      progress: 90,
    },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  
  const todayHabits = habits.filter(habit => habit.days);
  const otherHabits = habits.filter(habit => !habit.days);
  
  const toggleHabitCompletion = (id: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === id && habit.days) {
        const updatedDays = habit.days.map(day => {
          if (day.isToday) {
            return { ...day, completed: true };
          }
          return day;
        });
        return { ...habit, completed: true, days: updatedDays };
      }
      return habit;
    }));
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* iOS Header */}
      <div className="h-11 flex justify-center items-center relative bg-white/80 backdrop-blur-md border-b border-b-black/10">
        <div className="ios-header-title font-semibold text-base">习惯</div>
        <div 
          className="absolute right-4 text-[#007AFF]"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus"></i>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Today's Habits Section */}
        <div className="habit-section my-4">
          <div className="section-header py-3 px-4 font-semibold text-[#8E8E93] text-sm">今日</div>
          
          {todayHabits.map(habit => (
            <div key={habit.id} className="habit-card bg-white rounded-xl mx-4 my-2 p-4 shadow-sm fade-in">
              <div className="habit-header flex items-center mb-3">
                <div className="habit-icon w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-white" style={{ backgroundColor: habit.color }}>
                  <i className={`fas fa-${habit.icon}`}></i>
                </div>
                <div className="habit-info flex-1">
                  <div className="habit-name font-semibold">{habit.name}</div>
                  <div className="habit-streak text-xs text-[#8E8E93]">
                    已坚持 <span className="text-[#1C1C1E] font-medium">{habit.streak}</span> 天
                  </div>
                </div>
              </div>
              
              <div className="active-week flex justify-between mt-4">
                {habit.days?.map((day, index) => (
                  <div key={index} className="day-item flex flex-col items-center text-xs">
                    <div className="day-name text-[#8E8E93]">{day.day}</div>
                    <div className={`day-circle w-8 h-8 rounded-full bg-[#F2F2F7] my-1 flex items-center justify-center font-medium
                                    ${day.isToday ? 'border-2 border-[#007AFF]' : ''}
                                    ${day.completed ? 'bg-[#34C759] text-white' : ''}`}>
                      {day.completed ? (
                        <i className="fas fa-check"></i>
                      ) : (
                        index + 1
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {!habit.completed && (
                <div className="habit-actions flex gap-2 mt-3">
                  <button className="habit-button flex-1 bg-[#F2F2F7] rounded-lg py-2.5 text-center text-sm font-medium">
                    跳过
                  </button>
                  <button 
                    className="habit-button primary flex-1 bg-[#007AFF] text-white rounded-lg py-2.5 text-center text-sm font-medium"
                    onClick={() => toggleHabitCompletion(habit.id)}
                  >
                    完成
                  </button>
                </div>
              )}
              
              {habit.completed && (
                <div className="habit-actions flex gap-2 mt-3">
                  <button 
                    className="habit-button primary flex-1 bg-[#34C759] text-white rounded-lg py-2.5 text-center text-sm font-medium"
                    disabled
                  >
                    已完成
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Other Habits Section */}
        <div className="habit-section my-4">
          <div className="section-header py-3 px-4 font-semibold text-[#8E8E93] text-sm">其他习惯</div>
          
          {otherHabits.map(habit => (
            <div key={habit.id} className="habit-card bg-white rounded-xl mx-4 my-2 p-4 shadow-sm fade-in">
              <div className="habit-header flex items-center mb-3">
                <div className="habit-icon w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-white" style={{ backgroundColor: habit.color }}>
                  <i className={`fas fa-${habit.icon}`}></i>
                </div>
                <div className="habit-info flex-1">
                  <div className="habit-name font-semibold">{habit.name}</div>
                  <div className="habit-streak text-xs text-[#8E8E93]">
                    已坚持 <span className="text-[#1C1C1E] font-medium">{habit.streak}</span> 天
                  </div>
                </div>
              </div>
              
              <div className="habit-progress flex items-center mt-4">
                <div className="progress-bar h-1 bg-[#F2F2F7] rounded flex-1 mr-3 overflow-hidden">
                  <div 
                    className="progress-fill h-full rounded" 
                    style={{ width: `${habit.progress}%`, backgroundColor: habit.color }}
                  ></div>
                </div>
                <div className="progress-percent text-sm font-semibold">{habit.progress}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add Habit Modal */}
      {showModal && (
        <>
          <div 
            className="overlay fixed inset-0 bg-black/50 z-10"
            onClick={() => setShowModal(false)}
          ></div>
          
          <div className="modal fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 z-20 slide-up md:max-w-md md:mx-auto">
            <div className="modal-header flex justify-between items-center mb-5">
              <div className="modal-title text-lg font-semibold">新建习惯</div>
              <button 
                className="close-button text-[#8E8E93]"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="form-group mb-4">
              <label className="form-label block mb-2 font-medium text-sm">习惯名称</label>
              <input 
                type="text" 
                className="form-input w-full py-3 px-3 bg-[#F2F2F7] rounded-lg border-none text-base" 
                placeholder="例如: 阅读, 锻炼..."
              />
            </div>
            
            <div className="form-group mb-4">
              <label className="form-label block mb-2 font-medium text-sm">图标颜色</label>
              <div className="color-options flex gap-3 mt-2">
                <div className="color-option w-8 h-8 rounded-full bg-[#007AFF] border-4 border-white outline outline-2 outline-[#007AFF]"></div>
                <div className="color-option w-8 h-8 rounded-full bg-[#5AC8FA]"></div>
                <div className="color-option w-8 h-8 rounded-full bg-[#34C759]"></div>
                <div className="color-option w-8 h-8 rounded-full bg-[#FF9500]"></div>
                <div className="color-option w-8 h-8 rounded-full bg-[#FF3B30]"></div>
                <div className="color-option w-8 h-8 rounded-full bg-[#AF52DE]"></div>
              </div>
            </div>
            
            <div className="form-group mb-4">
              <label className="form-label block mb-2 font-medium text-sm">图标</label>
              <div className="color-options flex gap-3 mt-2">
                <div className="habit-icon w-10 h-10 rounded-xl flex items-center justify-center bg-[#007AFF] text-white border-2 border-[#007AFF] outline outline-2 outline-white">
                  <i className="fas fa-book"></i>
                </div>
                <div className="habit-icon w-10 h-10 rounded-xl flex items-center justify-center bg-[#007AFF] text-white">
                  <i className="fas fa-running"></i>
                </div>
                <div className="habit-icon w-10 h-10 rounded-xl flex items-center justify-center bg-[#007AFF] text-white">
                  <i className="fas fa-spa"></i>
                </div>
                <div className="habit-icon w-10 h-10 rounded-xl flex items-center justify-center bg-[#007AFF] text-white">
                  <i className="fas fa-pencil-alt"></i>
                </div>
                <div className="habit-icon w-10 h-10 rounded-xl flex items-center justify-center bg-[#007AFF] text-white">
                  <i className="fas fa-apple-alt"></i>
                </div>
              </div>
            </div>
            
            <button className="form-button w-full py-3.5 bg-[#007AFF] text-white font-semibold rounded-xl mt-5">
              创建习惯
            </button>
          </div>
        </>
      )}
    </div>
  );
} 