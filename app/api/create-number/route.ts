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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const response = await fetch(
      `https://temp-number-api.com/stubs/handler_api.php?api_key=${process.env.TEMP_API_KEY}&action=getNumber&service=${service}&country=${country}`
    );

    const data = await response.text();

    // Example response:
    // ACCESS_NUMBER:123456:+447123456789

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

    const number = await prisma.phoneNumber.create({
      data: {
        userId,
        phoneNumber,
        service,
        country: String(country),
        activationId,
        status: "ACTIVE",
      },
    });

    return Response.json({
      message: "Number generated successfully",
      number,
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