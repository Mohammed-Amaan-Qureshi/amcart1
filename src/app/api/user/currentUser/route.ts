import User from "@/app/model/user.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    const user = await User.findOne({ email: session?.user?.email }).select(
      "-password",
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found!!",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      user,
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
        {
          message: "Error while getting current user!!",
        },
        { status: 500 },
      );
  }
}
