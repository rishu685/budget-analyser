import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Demo user data (in a real app, this would be in a database)
const DEMO_USER = {
  id: 'demo-user-123',
  email: 'hire-me@anshumat.org',
  passwordHash: '$2b$10$BWuT0qP9ZMZxZrc0mWKDNuJzVuHbOCwGZ9PcnIIjweVIboBN/fO42' // HireMe@2025!
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    
    console.log('Login attempt:', { email: normalizedEmail, password: '***' });

    // Check if it's the demo user
    if (normalizedEmail === DEMO_USER.email) {
      console.log('Email matches demo user');
      const isValid = await bcrypt.compare(password, DEMO_USER.passwordHash);
      console.log('Password validation result:', isValid);
      
      if (isValid) {
        console.log('Login successful for demo user');
        return NextResponse.json({
          success: true,
          user: {
            id: DEMO_USER.id,
            email: DEMO_USER.email,
          },
        });
      }
    }

    console.log('Login failed - invalid credentials');
    // Invalid credentials
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}