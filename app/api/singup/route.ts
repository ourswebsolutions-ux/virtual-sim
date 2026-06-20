import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return Response.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return Response.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword
      }
    });

    return Response.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        message: 'Server error',
        error: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}