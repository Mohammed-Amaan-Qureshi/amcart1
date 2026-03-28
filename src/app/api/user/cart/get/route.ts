import User from "@/app/model/user.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized User." },
        { status: 400 },
      );
    }

    const user = await User.findById(session.user.id).populate(
      "cart.product");

    if(!user){
        return NextResponse.json(
        { message: "User not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
        {cart: user.cart },
        { status: 200 },
      );
  } catch (error) {
    return NextResponse.json(
        { message: `Failed to get cart \n${error}` },
        { status: 500 },
      );
  }
}
