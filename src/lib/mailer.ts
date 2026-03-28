import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendDeliveryOtpEmail(email: string, otp: string) {
  console.log("send mail init")
  await transporter.sendMail({
    from: `"Order Delivery" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your Delivery Otp",
    html: `
    <div style="font-family: Arial,sans-serif">
    <h2>Delivery Verification</h2>
    <p>Your order delivery OTP is:</p>
    <h1 style="letter-spacing:4px">${otp}</h1>
    <p>The OTP is valid for 10 minutes.</p>
    </div>`,
  });
  console.log("send mail sent")
}
