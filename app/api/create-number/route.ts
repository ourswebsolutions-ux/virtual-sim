export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, service, country } = await req.json();

    if (!userId || !service || !country) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Get price
    const priceRow = await prisma.price.findFirst();
    const price = Number(priceRow?.price || 0);

    if (price <= 0) {
      return Response.json(
        { message: "Invalid price configuration" },
        { status: 500 }
      );
    }

    // 2️⃣ Check user balance (fast pre-check)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const userBalance = Number(user.balance || 0);

    if (userBalance < price) {
      return Response.json(
        { message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // 3️⃣ External API call (KEEP OUTSIDE TRANSACTION)
    const MAX_PRICE = 0.08;

    const response = await fetch(
      `https://temp-number-api.com/stubs/handler_api.php?api_key=${process.env.TEMP_API_KEY}&action=getNumber&service=${service}&country=${country}&maxPrice=${MAX_PRICE}`
    );

    const data = await response.text();
    console.log(data, "API RESPONSE");

    if (!data.startsWith("ACCESS_NUMBER")) {
      return Response.json(
        {
          message: "Failed to get number",
          response: data,
        },
        { status: 400 }
      );
    }

    const [, activationId, phoneNumber] = data.split(":");

    // 4️⃣ ONLY DB WORK INSIDE TRANSACTION (FAST)
    const result = await prisma.$transaction(
      async (tx) => {
        // re-check balance (important for race conditions)
        const freshUser = await tx.user.findUnique({
          where: { id: userId },
          select: { balance: true },
        });

        if (!freshUser) {
          throw new Error("User not found");
        }

        const freshBalance = Number(freshUser.balance || 0);

        if (freshBalance < price) {
          throw new Error("Insufficient balance");
        }

        // create number record
        const number = await tx.phoneNumber.create({
          data: {
            userId,
            phoneNumber,
            service,
            country: String(country),
            activationId,
            status: "ACTIVE",
            expiresAt: new Date(Date.now() + 3 * 60 * 1000),
          },
        });

        // deduct balance (IMPORTANT: use tx, not prisma)
        await tx.user.update({
          where: { id: userId },
          data: {
            balance: {
              decrement: price,
            },
          },
        });

        return number;
      },
      {
        timeout: 15000, // optional safety (15s instead of 5s)
      }
    );

    return Response.json({
      message: "Number generated and balance deducted",
      number: result,
      deducted: price,
    });
  } catch (error: any) {
    return Response.json(
      {
        message: "Server error",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}