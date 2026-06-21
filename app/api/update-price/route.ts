export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

// 1. GET: Fetch the current price
export async function GET() {
  try {
    // Fetch the first price record available
    const priceRecord = await prisma.price.findFirst();

    return Response.json({
      success: true,
      // Fallback to 55.00 if no record exists in the DB yet
      price: priceRecord ? Number(priceRecord.price) : 55.00, 
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch price",
      },
      { status: 500 }
    );
  }
}

// 2. PUT: Update or Create the global price
export async function PUT(req: Request) {
  try {
    const { price } = await req.json();

    // Validation: Check if price is provided and is a valid number
    if (price === undefined || isNaN(Number(price))) {
      return Response.json(
        { success: false, message: "A valid price number is required" },
        { status: 400 }
      );
    }

    // Find if a price record already exists
    const existingPrice = await prisma.price.findFirst();

    let updatedPrice;

    if (existingPrice) {
      // If it exists, update it using its unique ID
      updatedPrice = await prisma.price.update({
        where: { id: existingPrice.id },
        data: { price: Number(price) },
      });
    } else {
      // If the table is empty, create the very first record
      updatedPrice = await prisma.price.create({
        data: { price: Number(price) },
      });
    }

    return Response.json({
      success: true,
      message: "Price updated successfully",
      price: Number(updatedPrice.price),
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to update price",
      },
      { status: 500 }
    );
  }
}