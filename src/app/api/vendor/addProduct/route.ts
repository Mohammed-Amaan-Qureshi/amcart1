import Product from "@/app/model/product.model";
import User from "@/app/model/user.model";
import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinery";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.id || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized user!" },
        { status: 400 },
      );
    }

    const formData = await req.formData();
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
    const image1 = formData.get("image1") as Blob;
    const image2 = formData.get("image2") as Blob;
    const image3 = formData.get("image3") as Blob;
    const image4 = formData.get("image4") as Blob;

    if (
      !title ||
      !description ||
      price === undefined ||
      stock === undefined ||
      !category ||
      !image1 ||
      !image2 ||
      !image3 ||
      !image4
    ) {
      return NextResponse.json(
        { message: "All fields and 4 images are required." },
        { status: 400 },
      );
    }

    if (isWearable && sizes.length === 0) {
      return NextResponse.json(
        { message: "Sizes are required for wearable products." },
        { status: 400 },
      );
    }

    const [img1, img2, img3, img4] = await Promise.all([
      uploadOnCloudinary(image1),
      uploadOnCloudinary(image2),
      uploadOnCloudinary(image3),
      uploadOnCloudinary(image4),
    ]);

    const product = await Product.create({
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
    });

    await User.findByIdAndUpdate(
      session.user.id,
      {
        $push: { vendorProducts: product._id },
      },
      { new: true },
    );

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: error || "Failed to create new product." },
      { status: 500 },
    );
  }
}
