export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, amount } = await req.json();

    if (!email || amount === undefined) {
      return Response.json(
        { message: "Email and amount are required" },
        { status: 400 }
      );
    }

    const addAmount = Number(amount);

    if (isNaN(addAmount)) {
      return Response.json(
        { message: "Invalid amount" },
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
          increment: addAmount,
        },
      },
    });

    return Response.json({
      success: true,
      message: "Balance added successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        balance: updatedUser.balance,
      },
    });
  } catch (error: any) {
    return Response.json(
      {
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}