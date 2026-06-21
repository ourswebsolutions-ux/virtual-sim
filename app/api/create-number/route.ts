export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId, service, country } = await req.json();

    if (!userId || !service || !country) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // 2️⃣ Get price
    const priceRow = await prisma.price.findFirst();
    const price = Number(priceRow?.price || 0);

    const userBalance = Number(user.balance || 0);

    // 3️⃣ Check balance
    if (userBalance < price) {
      return Response.json(
        { message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // 4️⃣ Call external API
    const response = await fetch(
      `https://temp-number-api.com/stubs/handler_api.php?api_key=${process.env.TEMP_API_KEY}&action=getNumber&service=${service}&country=${country}`
    );

    const data = await response.text();

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

    // 5️⃣ Transaction (VERY IMPORTANT)
    const result = await prisma.$transaction(async (tx : any) => {
      // create number
      const number = await tx.phoneNumber.create({
        data: {
          userId,
          phoneNumber,
          service,
          country: String(country),
          activationId,
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + 3 * 60 * 1000), // 3 min expiry
        },
      });

      // deduct balance
      await tx.user.update({
        where: { id: userId },
        data: {
          balance: userBalance - price,
        },
      });

      return number;
    });

    return Response.json({
      message: "Number generated and balance deducted",
      number: result,
      deducted: price,
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