"use client";

import { Message, FormMessage } from "@/components/form-message";
import { resetPasswordAction } from "@/app/actions";
import { encodedRedirect } from "@/utils/utils";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    const message = searchParams.get("message");
    const error = searchParams.get("error");
    const success = searchParams.get("success");
    
    if (error) {
      setMessage({ error });
    } else if (success) {
      setMessage({ success });
    } else if (message) {
      setMessage({ message });
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col h-full">
      {/* iOS Header */}
      <div className="h-11 flex justify-center items-center bg-white/80 backdrop-blur-md border-b border-b-black/10">
        <div className="ios-header-title font-semibold text-base">重置密码</div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 flex justify-center items-center p-4 bg-[#F2F2F7]">
        <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-sm">
          <form className="flex flex-col">
            <h1 className="text-2xl font-semibold text-center mb-6">设置新密码</h1>
            <p className="text-sm text-center text-[#8E8E93] mb-6">
              请输入您的新密码
            </p>
            
            <div className="flex flex-col gap-4 mb-6">
              <div className="form-group">
                <Label htmlFor="password" className="block mb-1.5 text-sm font-medium">新密码</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="您的新密码"
                  className="w-full px-4 py-3 rounded-xl bg-[#F2F2F7] border-none"
                  required
                />
              </div>
              
              <div className="form-group">
                <Label htmlFor="confirmPassword" className="block mb-1.5 text-sm font-medium">确认密码</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="再次输入密码"
                  className="w-full px-4 py-3 rounded-xl bg-[#F2F2F7] border-none"
                  required
                />
              </div>
            </div>
            
            <SubmitButton 
              formAction={resetPasswordAction}
              className="w-full bg-[#007AFF] text-white rounded-xl py-3.5 font-semibold text-base"
            >
              重置密码
            </SubmitButton>
            
            {message && <FormMessage message={message} className="mt-4 text-center" />}
          </form>
        </div>
      </div>
    </div>
  );
} 