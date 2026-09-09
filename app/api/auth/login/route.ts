import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
export async function POST(request:Request){const {email,password}=await request.json();if(email!==process.env.ADMIN_EMAIL||password!==process.env.ADMIN_PASSWORD)return NextResponse.json({error:"The email or password is incorrect."},{status:401});await createSession(email);return NextResponse.json({ok:true});}