import { createClient } from "@/utils/supabase/server";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SuperTimer",
  description: "Your personal productivity app for tasks, habits, and time management",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-[#F2F2F7] text-[#1C1C1E]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* For desktop development, we wrap the mobile app in a container that resembles a phone */}
          <div className="mx-auto flex flex-col min-h-screen 
                          max-w-full md:max-w-md lg:max-w-md 
                          md:my-8 md:border md:rounded-3xl md:shadow-xl md:overflow-hidden">
                {children}
              </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
