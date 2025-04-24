"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <div className="flex flex-col h-screen">
      {/* Status Bar (simulated) */}
      <div className="h-11 bg-[#F2F2F7] flex justify-between items-center px-4 text-sm font-semibold">
        <div>9:41</div>
        <div className="flex items-center space-x-2">
          <i className="fas fa-signal"></i>
          <i className="fas fa-wifi"></i>
          <i className="fas fa-battery-full"></i>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      
      {/* Tab Bar */}
      <div className="h-[83px] bg-white/80 backdrop-blur-md border-t border-t-black/10 flex justify-around items-center pb-5">
        <Link href="/tasks" className={`flex flex-col items-center ${pathname.includes('/tasks') ? 'text-[#007AFF]' : 'text-[#8E8E93]'} text-xs`}>
          <div className="text-2xl mb-1"><i className="fas fa-tasks"></i></div>
          <div>任务</div>
        </Link>
        <Link href="/habits" className={`flex flex-col items-center ${pathname.includes('/habits') ? 'text-[#007AFF]' : 'text-[#8E8E93]'} text-xs`}>
          <div className="text-2xl mb-1"><i className="fas fa-calendar-check"></i></div>
          <div>习惯</div>
        </Link>
        <Link href="/ai-assistant" className={`flex flex-col items-center ${pathname.includes('/ai-assistant') ? 'text-[#007AFF]' : 'text-[#8E8E93]'} text-xs`}>
          <div className="text-2xl mb-1"><i className="fas fa-robot"></i></div>
          <div>AI秘书</div>
        </Link>
        <Link href="/calendar" className={`flex flex-col items-center ${pathname.includes('/calendar') ? 'text-[#007AFF]' : 'text-[#8E8E93]'} text-xs`}>
          <div className="text-2xl mb-1"><i className="fas fa-calendar"></i></div>
          <div>日历</div>
        </Link>
        <Link href="/stats" className={`flex flex-col items-center ${pathname.includes('/stats') ? 'text-[#007AFF]' : 'text-[#8E8E93]'} text-xs`}>
          <div className="text-2xl mb-1"><i className="fas fa-chart-pie"></i></div>
          <div>统计</div>
        </Link>
      </div>
    </div>
  );
} 