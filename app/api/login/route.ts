import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    let body;

    try {
      body = await req.json();
    } catch (err) {
      return Response.json(
        { message: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const { email, password } = body || {};

    // Validation
    if (!email || !password) {
      return Response.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    // Find User
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError: any) {
      console.error("DB Error (findUser):", dbError);

      return Response.json(
        { message: "Database error while fetching user" },
        { status: 500 }
      );
    }

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Check Password
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (bcryptError: any) {
      console.error("Bcrypt Error:", bcryptError);

      return Response.json(
        { message: "Password verification failed" },
        { status: 500 }
      );
    }

    if (!isMatch) {
      return Response.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Success
    return Response.json({
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error: any) {
    console.error("Login API Error:", error);

    return Response.json(
      {
        message: "Internal server error",
        error: process.env.NODE_ENV === "development"
          ? error?.message
          : undefined,
      },
      { status: 500 }
    );
  }
}