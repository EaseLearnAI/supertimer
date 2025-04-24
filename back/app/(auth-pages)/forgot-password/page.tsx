import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-sm">
      <form className="flex flex-col">
        <h1 className="text-2xl font-semibold text-center mb-6">重置密码</h1>
        <p className="text-sm text-center text-[#8E8E93] mb-6">
          请输入您的邮箱地址，我们将发送重置密码的链接给您
        </p>
        
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
        </div>
        
        <SubmitButton 
          formAction={forgotPasswordAction}
          className="w-full bg-[#007AFF] text-white rounded-xl py-3.5 font-semibold text-base"
        >
          发送重置链接
          </SubmitButton>
        
        <FormMessage message={searchParams} className="mt-4 text-center" />
        
        <p className="mt-6 text-sm text-center">
          <Link className="text-[#007AFF] font-medium" href="/sign-in">
            返回登录
          </Link>
        </p>
      </form>
      
      <div className="mt-6">
      <SmtpMessage />
      </div>
    </div>
  );
}
