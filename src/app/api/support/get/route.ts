import User from "@/app/model/user.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized User!!" },
        { status: 401 },
      );
    }

    const { withUserId } = await req.json();
    if(!withUserId){
        return NextResponse.json(
        { message: "with user id required" },
        { status: 400 },
      );
    }
    const user = await User.findById(session.user.id).populate(
      "chat.with",
      "name imgae role shopName",
    );

    if(!user){
        return NextResponse.json(
        { message: "User not found" },
        { status: 404 },
      );
    }

    const chat = user.chat.find(
        (c: any)=> String(c.with._id) === String(withUserId)
    )

    return NextResponse.json(
        chat.messages || [],
        { status: 200 },
      );

  } catch (error) {
    return NextResponse.json(
        { message: "Error while getting chat.\n",error },
        { status: 500 },
      );
  }
}
