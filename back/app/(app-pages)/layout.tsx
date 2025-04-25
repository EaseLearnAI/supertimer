"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  faTasks, 
  faCalendarCheck, 
  faRobot, 
  faCalendar, 
  faChartPie,
  faCog
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <div className="flex flex-col h-screen relative">
      
      {/* Header Bar */}
      <div className="h-11 flex justify-center items-center bg-white/80 backdrop-blur-md border-b border-b-black/10 relative">
        <div className="ios-header-title font-semibold text-base">SuperTimer</div>
        
        {/* Settings Button - Inside header but right aligned */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <Link 
            href="/settings" 
            className="flex items-center justify-center w-9 h-9 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-black/5"
          >
            <FontAwesomeIcon icon={faCog} className="text-[#007AFF] text-lg" />
          </Link>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      
      {/* Tab Bar */}
      <div className="h-[83px] bg-white/80 backdrop-blur-md border-t border-t-black/10 flex justify-around items-center pb-5">
        <Link href="/tasks" className={`flex flex-col items-center ${pathname.includes('/tasks') ? 'text-[#007AFF]' : 'text-[#8E8E93]'} text-xs`}>
          <div className="text-[22px] mb-1">
            <FontAwesomeIcon icon={faTasks} />
          </div>
          <div>任务</div>
        </Link>
        <Link href="/habits" className={`flex flex-col items-center ${pathname.includes('/habits') ? 'text-[#007AFF]' : 'text-[#8E8E93]'} text-xs`}>
          <div className="text-[22px] mb-1">
            <FontAwesomeIcon icon={faCalendarCheck} />
          </div>
          <div>习惯</div>
        </Link>
        <Link href="/ai-assistant" className={`flex flex-col items-center ${pathname.includes('/ai-assistant') ? 'text-[#007AFF]' : 'text-[#8E8E93]'} text-xs`}>
          <div className="text-[22px] mb-1">
            <FontAwesomeIcon icon={faRobot} />
          </div>
          <div>AI秘书</div>
        </Link>
        <Link href="/calendar" className={`flex flex-col items-center ${pathname.includes('/calendar') ? 'text-[#007AFF]' : 'text-[#8E8E93]'} text-xs`}>
          <div className="text-[22px] mb-1">
            <FontAwesomeIcon icon={faCalendar} />
          </div>
          <div>日历</div>
        </Link>
        <Link href="/stats" className={`flex flex-col items-center ${pathname.includes('/stats') ? 'text-[#007AFF]' : 'text-[#8E8E93]'} text-xs`}>
          <div className="text-[22px] mb-1">
            <FontAwesomeIcon icon={faChartPie} />
          </div>
          <div>统计</div>
        </Link>
      </div>
    </div>
  );
} 