import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  
  // If the user is authenticated, redirect to the tasks page
  if (data?.session) {
    return NextResponse.redirect(new URL("/tasks", process.env.VERCEL_URL || "http://localhost:3000"));
  }
  
  // Otherwise, redirect to the sign-in page
  return NextResponse.redirect(new URL("/sign-in", process.env.VERCEL_URL || "http://localhost:3000"));
} 