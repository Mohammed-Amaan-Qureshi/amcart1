import User from "@/app/model/user.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDb()
        const {phone, role} = await req.json()
        const session = await auth()
        const user = await User.findOneAndUpdate({email: session?.user?.email}, {phone, role}, {new: true})

        if(!user){
            return NextResponse.json(
                {message: "User  not found."},
                {status: 400}
            )
        }

        return NextResponse.json(
            {user},
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
                {message: "Edit role and phone error!!"+error},
                {status: 500}
            )
    }
}