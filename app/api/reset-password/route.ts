import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return Response.json(
        { message: "Email and new password are required" },
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return Response.json({
      message: "Password reset successful",
    });

  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        message: "Server error",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}