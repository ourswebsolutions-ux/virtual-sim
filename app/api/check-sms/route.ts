export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { activationId } = await req.json();

    const response = await fetch(
      `https://temp-number-api.com/stubs/handler_api.php?api_key=${process.env.TEMP_API_KEY}&action=getStatus&id=${activationId}`
    );

    const result = await response.text();

    if (result.startsWith("STATUS_OK")) {
      const otp = result.replace("STATUS_OK:", "");

      await prisma.phoneNumber.update({
        where: {
          activationId,
        },
        data: {
          otpCode: otp,
          status: "COMPLETED",
          receivedAt: new Date(),
        },
      });

      return Response.json({
        success: true,
        otp,
      });
    }

    return Response.json({
      success: false,
      status: result,
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