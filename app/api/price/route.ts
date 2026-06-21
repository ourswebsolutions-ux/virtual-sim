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
    const { price } = await req.json();

    if (price === undefined) {
      return Response.json(
        { message: "Price is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.price.findFirst();

    const result = existing
      ? await prisma.price.update({
          where: { id: existing.id },
          data: {
            price: Number(price),
          },
        })
      : await prisma.price.create({
          data: {
            price: Number(price),
          },
        });

    return Response.json({
      success: true,
      message: "Price updated successfully",
      price: result.price,
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