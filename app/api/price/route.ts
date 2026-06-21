export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const price = await prisma.price.findFirst();

    return Response.json({
      success: true,
      price: price?.price ?? 55,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { email, amount } = await req.json();

    if (!email || amount === undefined) {
      return Response.json(
        { message: "Email and amount are required" },
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

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        balance: {
          increment: Number(amount), // add balance (top-up)
        },
      },
    });

    return Response.json({
      success: true,
      message: "User balance updated successfully",
      user: {
        email: updatedUser.email,
        balance: updatedUser.balance,
      },
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}