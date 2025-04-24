import { InfoIcon } from "lucide-react";
import Link from "next/link";

export function SmtpMessage() {
  return (
    <div className="bg-[#F2F2F7] p-4 rounded-xl text-sm">
      <div className="flex gap-3">
        <InfoIcon size={18} className="text-[#8E8E93] flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-2">
          <p className="text-[#1C1C1E]">
            <strong>注意:</strong> 默认邮件发送有速率限制。如需提高发送限制，请配置自定义SMTP服务。
          </p>
          <Link
            href="https://supabase.com/docs/guides/auth/auth-smtp"
            target="_blank"
            className="text-[#007AFF] flex items-center gap-1"
          >
            了解更多 <i className="fas fa-external-link-alt text-xs"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
