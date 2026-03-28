import User from "@/app/model/user.model";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const admin = await User.findOne({ role: "admin" });
    return NextResponse.json({ exists: !!admin });
  } catch (error) {
    return NextResponse.json(
      {
        mesage: `Check admin error ${error}`,
      },
      { status: 500 },
    );
  }
}
