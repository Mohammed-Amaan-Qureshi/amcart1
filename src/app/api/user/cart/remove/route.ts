import User from "@/app/model/user.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized User." },
        { status: 400 },
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: "ProductId is required." }, { status: 400 });
    }

    const user = await User.findById(session.user.id).populate("cart.product");

    if (!user || !user.cart) {
      return NextResponse.json({ message: "Cart not found." }, { status: 404 });
    }

    user.cart = user.cart.filter(
      (item: any) => item.product._id.toString() !== productId.toString(),
    );

    await user.save();

    return NextResponse.json(
      { message: "Item removed successfully."},
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to remove cart item.\n ${error}` },
      { status: 500 },
    );
  }
}
