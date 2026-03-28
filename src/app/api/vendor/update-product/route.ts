import Product from "@/app/model/product.model";
import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinery";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.id || !session.user.email) {
      return NextResponse.json(
        { message: "Unauthorized User." },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const productId = formData.get("productId");
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 400 },
      );
    }

    if (String(product.vendor) !== String(session.user.id)) {
      return NextResponse.json(
        { message: "Only product owner can edit the product." },
        { status: 403 },
      );
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    const isWearable = formData.get("isWearable") === "true";
    const sizes = formData.getAll("sizes");
    const replacementDays = Number(formData.get("replacementDays") || 0);
    const freeDelivery = formData.get("freeDelivery") === "true";
    const warranty = (formData.get("warranty") as string) || "No Warrenty";
    const payOnDelivery = formData.get("payOnDelivery") === "true";
    const detailsPoints = formData.getAll("detailsPoints");
    const image1 = formData.get("image1") as Blob | null;
    const image2 = formData.get("image2") as Blob | null;
    const image3 = formData.get("image3") as Blob | null;
    const image4 = formData.get("image4") as Blob | null;

    let img1 = product.image1;
    let img2 = product.image2;
    let img3 = product.image3;
    let img4 = product.image4;

    if (image1) {
      img1 = await uploadOnCloudinary(image1);
    }
    if (image2) {
      img2 = await uploadOnCloudinary(image2);
    }
    if (image3) {
      img3 = await uploadOnCloudinary(image3);
    }
    if (image4) {
      img4 = await uploadOnCloudinary(image4);
    }

    if (isWearable && sizes.length === 0) {
      return NextResponse.json(
        { message: "Sizes are required for wearable products." },
        { status: 400 },
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        description,
        price,
        stock,
        category,
        isStockAvailable: stock > 0,
        image1: img1,
        image2: img2,
        image3: img3,
        image4: img4,
        vendor: session?.user?.id,
        isWearable,
        sizes: isWearable ? sizes : [],
        replacementDays,
        warranty,
        payOnDelivery,
        freeDelivery,
        detailsPoints,
        verificationStatus: "pending",
        isActive: false,
      },
      { new: true },
    );

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Update Product Error." },
      { status: 500 },
    );
  }
}
