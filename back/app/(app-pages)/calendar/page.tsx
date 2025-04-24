"use client";

import { useState, useEffect, ReactNode } from "react";

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [currentMonth, setCurrentMonth] = useState("2023年6月");
  const [calendarDays, setCalendarDays] = useState<ReactNode[]>([]);
  const [hasTasks, setHasTasks] = useState(true);
  
  // Generate calendar days
  useEffect(() => {
    generateCalendar();
  }, []);
  
  const generateCalendar = () => {
    const days: ReactNode[] = [];
    
    // Sample data for June 2023
    const firstDay = 4; // Thursday (0 is Sunday)
    const daysInMonth = 30;
    const today = 1; // Assuming today is June 1st
    
    // Add days from previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div 
          key={`prev-${i}`} 
          className="calendar-day aspect-square flex flex-col justify-center items-center text-[#8E8E93] opacity-50 fade-in"
          style={{ animationDelay: `${i * 0.02}s` }}
        >
          {31 - firstDay + i + 1}
        </div>
      );
    }
    
    // Add days for current month
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today;
      const hasTasksForDay = [1, 5, 10, 15, 20, 25].includes(i);
      
      days.push(
        <div 
          key={i}
          className={`calendar-day aspect-square flex flex-col justify-center items-center text-base relative cursor-pointer fade-in
                     ${isToday ? 'bg-[#007AFF] text-white rounded-full' : ''}
                     ${selectedDay === i && !isToday ? 'bg-[#007AFF]/10 border border-[#007AFF] rounded-full' : ''}`}
          style={{ animationDelay: `${(i + firstDay) * 0.02}s` }}
          onClick={() => selectDay(i)}
        >
          {i}
          {hasTasksForDay && (
            <div 
              className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-[#007AFF]'}`}
            ></div>
          )}
        </div>
      );
    }
    
    // Add days from next month
    const remainingCells = 42 - (firstDay + daysInMonth); // 6 rows of 7 days = 42 cells
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div 
          key={`next-${i}`} 
          className="calendar-day aspect-square flex flex-col justify-center items-center text-[#8E8E93] opacity-50 fade-in"
          style={{ animationDelay: `${(i + firstDay + daysInMonth) * 0.02}s` }}
        >
          {i}
        </div>
      );
    }
    
    setCalendarDays(days);
  };
  
  const selectDay = (day: number) => {
    setSelectedDay(day);
    // Check if this day has tasks (demo data)
    setHasTasks([1, 5, 10, 15, 20, 25].includes(day));
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const months = {
      prev: "2023年5月",
      current: "2023年6月",
      next: "2023年7月"
    };
    
    setCurrentMonth(direction === 'prev' ? months.prev : months.next);
    
    // Simulate month change for demo - reset back to current after a second
    setTimeout(() => {
      setCurrentMonth(months.current);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* iOS Header */}
      <div className="h-11 flex justify-center items-center bg-white/80 backdrop-blur-md border-b border-b-black/10">
        <div className="ios-header-title font-semibold text-base">日历</div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Calendar Header */}
        <div className="calendar-header flex justify-between items-center p-4">
          <div 
            className="calendar-nav text-[#007AFF] cursor-pointer p-2"
            onClick={() => navigateMonth('prev')}
          >
            <i className="fas fa-chevron-left"></i>
          </div>
          <div className="current-month font-semibold text-xl">{currentMonth}</div>
          <div 
            className="calendar-nav text-[#007AFF] cursor-pointer p-2"
            onClick={() => navigateMonth('next')}
          >
            <i className="fas fa-chevron-right"></i>
          </div>
        </div>
        
        {/* Calendar Weekdays */}
        <div className="calendar-weekdays grid grid-cols-7 text-center text-xs text-[#8E8E93] font-semibold py-2 px-4">
          <div>日</div>
          <div>一</div>
          <div>二</div>
          <div>三</div>
          <div>四</div>
          <div>五</div>
          <div>六</div>
        </div>
        
        {/* Calendar Days */}
        <div className="calendar-days grid grid-cols-7 gap-2 px-4 pb-4">
          {calendarDays}
        </div>
        
        {/* Task Panel */}
        <div className="task-panel bg-white rounded-t-2xl mt-4 p-5 flex-1 overflow-y-auto">
          <div className="task-panel-header flex justify-between items-center mb-4">
            <div className="task-panel-title font-semibold text-lg">{`2023年6月${selectedDay}日`}</div>
            <div className="task-count text-sm text-[#8E8E93]">{hasTasks ? '3项已完成' : '0项已完成'}</div>
          </div>
          
          {hasTasks ? (
            <div className="task-list">
              <div className="task-list-item flex items-center py-3 border-b border-[#F2F2F7] opacity-0 animate-[fadeIn_0.3s_ease_forwards]" style={{ animationDelay: '0s' }}>
                <div className="task-icon w-9 h-9 rounded-xl flex justify-center items-center mr-3 text-white bg-[#FF9500]">
                  <i className="fas fa-running"></i>
                </div>
                <div className="task-details flex-1">
                  <div className="task-name font-semibold mb-1">早晨锻炼</div>
                  <div className="task-time text-sm text-[#8E8E93]">07:00 - 08:00</div>
                </div>
              </div>
              
              <div className="task-list-item flex items-center py-3 border-b border-[#F2F2F7] opacity-0 animate-[fadeIn_0.3s_ease_forwards]" style={{ animationDelay: '0.1s' }}>
                <div className="task-icon w-9 h-9 rounded-xl flex justify-center items-center mr-3 text-white bg-[#007AFF]">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div className="task-details flex-1">
                  <div className="task-name font-semibold mb-1">项目会议</div>
                  <div className="task-time text-sm text-[#8E8E93]">10:00 - 11:30</div>
                </div>
              </div>
              
              <div className="task-list-item flex items-center py-3 opacity-0 animate-[fadeIn_0.3s_ease_forwards]" style={{ animationDelay: '0.2s' }}>
                <div className="task-icon w-9 h-9 rounded-xl flex justify-center items-center mr-3 text-white bg-[#5AC8FA]">
                  <i className="fas fa-book"></i>
                </div>
                <div className="task-details flex-1">
                  <div className="task-name font-semibold mb-1">阅读时间</div>
                  <div className="task-time text-sm text-[#8E8E93]">19:00 - 20:00</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-tasks text-center py-8 text-[#8E8E93] animate-[fadeIn_0.5s_ease_forwards]">
              <i className="fas fa-calendar-day text-4xl mb-4 text-gray-300"></i>
              <div>今天没有完成的任务</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 