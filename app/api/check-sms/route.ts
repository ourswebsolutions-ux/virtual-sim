export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { activationId } = await req.json();

    if (!activationId) {
      return Response.json(
        { success: false, message: "activationId required" },
        { status: 400 }
      );
    }

    // 1. Call external SMS API
    const response = await fetch(
      `https://temp-number-api.com/stubs/handler_api.php?api_key=${process.env.TEMP_API_KEY}&action=getStatus&id=${activationId}`
    );

    const result = await response.text();

    // 2. If OTP received
    if (result.startsWith("STATUS_OK")) {
      const otp = result.replace("STATUS_OK:", "");

      // 3. Update DB
      await prisma.phoneNumber.update({
        where: { activationId },
        data: {
          otpCode: otp,
          status: "COMPLETED",
          receivedAt: new Date(),
        },
      });
    }

    // 4. Get full record (IMPORTANT PART)
    const number = await prisma.phoneNumber.findUnique({
      where: { activationId },
      include: {
        user: true,
      },
    });

    // 5. Get price (cost)
    const price = await prisma.price.findFirst();

    if (!number) {
      return Response.json({
        success: false,
        message: "Number not found",
        status: result,
      });
    }

    return Response.json({
      success: true,
      status: number.status,
      otp: number.otpCode || null,

      number: {
        id: number.id,
        phoneNumber: number.phoneNumber,
        service: number.service,
        country: number.country,
        activationId: number.activationId,
        status: number.status,
        receivedAt: number.receivedAt,
        expiresAt: number.expiresAt,
      },

      cost: price?.price || 0,
      user: {
        id: number.user.id,
        fullName: number.user.fullName,
      },
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}