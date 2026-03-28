import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  phone?: string;
  role: "user" | "vendor" | "admin";

  // for vandor

  shopName?: string;
  shopAddress?: string;
  gstNumber: string;
  isAproved: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
  requestAt: Date;
  approvedAt: Date;
  rejectReason?: string;

  vendorProducts?: mongoose.Types.ObjectId[];
  orders?: mongoose.Types.ObjectId;

  cart?: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];

  chat?: {
    with: mongoose.Types.ObjectId;
    messages: {
      sender: mongoose.Types.ObjectId;
      text: string;
      createdAt: Date;
    }[];
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },
    shopName: {
      type: String,
    },
    shopAddress: {
      type: String,
    },
    gstNumber: {
      type: String,
    },
    isAproved: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedAt: {
      type: Date,
    },
    requestAt: {
      type: Date,
    },
    rejectReason: {
      type: String,
    },
    vendorProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
      },
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    chat: [
      {
        with: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        messages: [
          {
            sender: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            text: {
              type: String,
              required: true,
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);

export default User;
