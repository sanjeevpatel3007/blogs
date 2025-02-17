import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function auth(handler) {
  return async (request, context) => {
    try {
      const token = request.headers.get('authorization')?.split(' ')[1];
      
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.userId = decoded.userId;
      
      return handler(request, context);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  };
} 