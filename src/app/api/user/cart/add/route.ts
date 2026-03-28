import Product from "@/app/model/product.model";
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

    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { message: "ProductID is required." },
        { status: 400 },
      );
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 400 });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 400 },
      );
    }

    const existingProduct = user.cart.find((item: any)=> item.product.toString() === productId.toString())

    if(existingProduct){
        existingProduct.quantity += quantity
    }else{
        user.cart.push({
            product: product._id,
            quantity
        })
    }

    await user.save()

    return NextResponse.json(
        { message: "Product added to cart.✅" },
        { status: 200 },
      );
  } catch (error) {
    return NextResponse.json(
        { message: `Failed to add product in card.\n${error}` },
        { status: 500 },
      );
  }
}
