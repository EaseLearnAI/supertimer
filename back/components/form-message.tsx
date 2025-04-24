export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ 
  message, 
  className = "" 
}: { 
  message: Message;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 w-full text-sm ${className}`}>
      {"success" in message && (
        <div className="text-[#34C759] border-l-2 border-[#34C759] px-4">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="text-[#FF3B30] border-l-2 border-[#FF3B30] px-4">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-foreground border-l-2 px-4">{message.message}</div>
      )}
    </div>
  );
}
