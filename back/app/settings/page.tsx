"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faUser, 
  faUserPlus, 
  faSignOutAlt,
  faKey
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-[#F2F2F7]">
      {/* Header */}
      <div className="h-11 flex items-center px-4 bg-white/80 backdrop-blur-md border-b border-b-black/10">
        <button 
          onClick={() => router.back()}
          className="text-[#007AFF]"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          返回
        </button>
        <div className="flex-1 text-center font-semibold">设置</div>
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <h2 className="px-4 py-2 text-sm font-medium text-[#8E8E93]">账户</h2>
          
          {!isLoggedIn ? (
            <>
              <Link href="/sign-in" className="flex items-center px-4 py-4 border-b border-b-black/10">
                <FontAwesomeIcon icon={faUser} className="text-[#007AFF] w-5" />
                <span className="ml-3">登录</span>
                <div className="ml-auto text-[#8E8E93]">
                  <i className="fas fa-chevron-right text-xs"></i>
                </div>
              </Link>
              
              <Link href="/sign-up" className="flex items-center px-4 py-4 border-b border-b-black/10">
                <FontAwesomeIcon icon={faUserPlus} className="text-[#007AFF] w-5" />
                <span className="ml-3">注册</span>
                <div className="ml-auto text-[#8E8E93]">
                  <i className="fas fa-chevron-right text-xs"></i>
                </div>
              </Link>
              
              <Link href="/forgot-password" className="flex items-center px-4 py-4">
                <FontAwesomeIcon icon={faKey} className="text-[#007AFF] w-5" />
                <span className="ml-3">忘记密码</span>
                <div className="ml-auto text-[#8E8E93]">
                  <i className="fas fa-chevron-right text-xs"></i>
                </div>
              </Link>
            </>
          ) : (
            <div className="px-4 py-4 text-center">
              您已登录
            </div>
          )}
        </div>
        
        {/* 已登录用户才显示此按钮 */}
        {isLoggedIn && (
          <form action={signOutAction}>
            <button 
              type="submit"
              className="w-full bg-red-500 text-white rounded-xl py-3.5 font-semibold text-base mt-6 flex justify-center items-center"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              退出登录
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 