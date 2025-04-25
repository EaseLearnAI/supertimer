export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      {/* Status Bar (simulated) */}

      
      {/* iOS Header */}
      <div className="h-11 flex justify-center items-center bg-white/80 backdrop-blur-md border-b border-b-black/10">
        <div className="ios-header-title font-semibold text-base">SuperTimer</div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 flex justify-center items-center p-4 bg-[#F2F2F7]">
        {children}
      </div>
    </div>
  );
}
