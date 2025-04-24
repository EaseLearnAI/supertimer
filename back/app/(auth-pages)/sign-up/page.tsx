import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-sm">
        <FormMessage message={searchParams} className="mb-4" />
        <Link 
          href="/sign-in" 
          className="w-full bg-[#007AFF] text-white rounded-xl py-3.5 font-semibold text-base block text-center"
        >
          返回登录
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-sm">
      <form className="flex flex-col">
        <h1 className="text-2xl font-semibold text-center mb-6">注册</h1>
        
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
            <Label htmlFor="password" className="block mb-1.5 text-sm font-medium">密码</Label>
          <Input
            type="password"
            name="password"
              placeholder="设置密码"
              className="w-full px-4 py-3 rounded-xl bg-[#F2F2F7] border-none"
            minLength={6}
            required
          />
          </div>
        </div>
        
        <SubmitButton 
          formAction={signUpAction} 
          pendingText="注册中..."
          className="w-full bg-[#007AFF] text-white rounded-xl py-3.5 font-semibold text-base"
        >
          注册
        </SubmitButton>
        
        <FormMessage message={searchParams} className="mt-4 text-center" />
        
        <p className="mt-6 text-sm text-center">
          已有账号? {" "}
          <Link className="text-[#007AFF] font-medium" href="/sign-in">
            登录
          </Link>
        </p>
      </form>
      
      <div className="mt-6">
      <SmtpMessage />
      </div>
    </div>
  );
}
