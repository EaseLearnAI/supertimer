import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-sm">
      <form className="flex flex-col">
        <h1 className="text-2xl font-semibold text-center mb-6">登录</h1>
        
        <div className="flex flex-col gap-4 mb-6">
          <div className="form-group">
            <Label htmlFor="email" className="block mb-1.5 text-sm font-medium">邮箱</Label>
            <Input 
              name="email" 
              placeholder="您的邮箱地址" 
              className="w-full px-4 py-3 rounded-xl bg-[#F2F2F7] border-none" 
              required 
            />
          </div>
          
          <div className="form-group">
            <div className="flex justify-between items-center mb-1.5">
              <Label htmlFor="password" className="text-sm font-medium">密码</Label>
          <Link
                className="text-xs text-[#007AFF]"
            href="/forgot-password"
          >
                忘记密码?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
              placeholder="您的密码"
              className="w-full px-4 py-3 rounded-xl bg-[#F2F2F7] border-none"
          required
        />
          </div>
        </div>
        
        <SubmitButton 
          pendingText="登录中..." 
          formAction={signInAction}
          className="w-full bg-[#007AFF] text-white rounded-xl py-3.5 font-semibold text-base"
        >
          登录
        </SubmitButton>
        
        <FormMessage message={searchParams} className="mt-4 text-center" />
        
        <p className="mt-6 text-sm text-center">
          没有账号? {" "}
          <Link className="text-[#007AFF] font-medium" href="/sign-up">
            注册
          </Link>
        </p>
      </form>
      </div>
  );
}
