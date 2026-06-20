export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { activationId } = await req.json();

    if (!activationId) {
      return Response.json(
        { message: "Activation ID is required" },
        { status: 400 }
      );
    }

    const number = await prisma.phoneNumber.findFirst({
      where: { activationId },
    });

    if (!number) {
      return Response.json(
        { message: "Number not found" },
        { status: 404 }
      );
    }

    const response = await fetch(
      `https://temp-number-api.com/stubs/handler_api.php?api_key=${process.env.TEMP_API_KEY}&action=setStatus&id=${activationId}&status=8`
    );

    const result = await response.text();

    // ❌ DO NOT update DB if API denied cancel
    if (result === "EARLY_CANCEL_DENIED") {
      return Response.json({
        success: false,
        message: "Cancel not allowed by provider",
        response: result,
      });
    }

    if (result.includes("ACCESS_CANCEL") || result.includes("OK")) {
      await prisma.phoneNumber.update({
        where: { id: number.id },
        data: {
          status: "CANCELLED",
        },
      });

      return Response.json({
        success: true,
        message: "Number cancelled successfully",
        response: result,
      });
    }

    return Response.json({
      success: false,
      message: "Unknown response from provider",
      response: result,
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



export async function DELETE(req: Request) {
  try {
    const { numberId, userId } = await req.json();

    if (!numberId) {
      return Response.json(
        { message: "numberId is required" },
        { status: 400 }
      );
    }

    // Optional security check
    const number = await prisma.phoneNumber.findUnique({
      where: {
        id: numberId,
      },
    });

    if (!number) {
      return Response.json(
        { message: "Number not found" },
        { status: 404 }
      );
    }

    // Make sure user owns the number
    if (userId && number.userId !== userId) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.phoneNumber.delete({
      where: {
        id: numberId,
      },
    });

    return Response.json({
      success: true,
      message: "Number cancelled successfully",
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