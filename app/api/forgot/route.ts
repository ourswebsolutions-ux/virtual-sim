export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const newPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    console.log(process.env.EMAIL_USER,process.env.EMAIL_PASS,"helo ")
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `
        <h3>Your New Password</h3>
        <p>${newPassword}</p>
        <p>Please login and change it immediately.</p>
      `,
    });

    return Response.json({
      message: "New password sent to your email",
    });

  } catch (error: any) {
    return Response.json(
      {
        message: "Server error",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}