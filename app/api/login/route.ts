import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return Response.json(
        { message: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find User
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check Password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return Response.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Success
    return Response.json({
      message: 'Login successful',
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