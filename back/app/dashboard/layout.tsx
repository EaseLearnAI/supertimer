import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">SuperTimer</h1>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link href="/dashboard/tasks" className="text-primary hover:underline">
                  任务
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  习惯
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  统计
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          SuperTimer © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
} 