import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/app/model/user.model";

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

    const senderId = session.user.id;
    const { receiverId, text } = await req.json();

    if (!receiverId || !text) {
      return NextResponse.json(
        { message: "receiverId and text is required" },
        { status: 400 },
      );
    }

    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    // svae in sender
    await User.updateOne(
      {
        _id: senderObjectId,
        "chat.with": receiverObjectId,
      },
      {
        $push: {
          "chat.$.messages": {
            sender: senderObjectId,
            text,
            createdAt: new Date(),
          },
        },
      },
    );

    const senderHasChat = await User.findOne({
      _id: senderObjectId,
      "chat.with": receiverObjectId,
    });

    if (!senderHasChat) {
      await User.updateOne(
        { _id: senderObjectId },
        {
          $push: {
            chat: {
              with: receiverObjectId,
              messages: [
                {
                  sender: senderObjectId,
                  text,
                  createdAt: new Date(),
                },
              ],
            },
          },
        },
      );
    }

    // save in receiver
    await User.updateOne(
      {
        _id: receiverObjectId,
        "chat.with": senderObjectId,
      },
      {
        $push: {
          "chat.$.messages": {
            sender: senderObjectId,
            text,
            createdAt: new Date(),
          },
        },
      },
    );

    const receiverHasChat = await User.findOne({
      _id: receiverObjectId,
      "chat.with": senderObjectId,
    });

    if (!receiverHasChat) {
      await User.updateOne(
        {
          _id: receiverObjectId,
        },
        {
          $push: {
            chat: {
              with: senderObjectId,
              messages: [
                {
                  sender: senderObjectId,
                  text,
                  createdAt: new Date(),
                },
              ],
            },
          },
        },
      );
    }

    return NextResponse.json(
        {success: true}
      );
  } catch (error) {
    return NextResponse.json(
        { message: "Sending message Error.\n"+error },
        { status: 500 },
      );
  }
}
