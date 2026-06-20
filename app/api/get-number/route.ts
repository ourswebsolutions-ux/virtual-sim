export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    const numbers = await prisma.phoneNumber.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      count: numbers.length,
      numbers,
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