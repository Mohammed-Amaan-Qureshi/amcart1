import User from "@/app/model/user.model";
import connectDb from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name's maximum length is 50."),

  email: z.string().email("Invalid email."),

  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const POST = async (req: NextRequest) => {
  try {
    await connectDb();

    const body = await req.json();

    const parsedData = registerSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        {
          message: "validation error.",
          errors: parsedData.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = parsedData.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exits." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (error) {
    NextResponse.json(
      { message: "Error while register." + error },
      { status: 500 },
    );
  }
};

