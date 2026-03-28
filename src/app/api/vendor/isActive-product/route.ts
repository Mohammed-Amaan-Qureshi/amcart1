import Product from "@/app/model/product.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized access!!" },
        { status: 400 },
      );
    }

    const { productId, isActive } = await req.json();
    const product = await Product.findByIdAndUpdate(
      productId,
      { isActive },
      { new: true },
    );

    if (!product) {
      return NextResponse.json(
        { message: "Product not found!!" },
        { status: 400 },
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Update isActive Error.\n${error}` },
      { status: 500 },
    );
  }
}
