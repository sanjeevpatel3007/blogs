import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function auth(handler) {
  return async (req) => {
    try {
      const token = req.headers.get('authorization')?.split(' ')[1];
      
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      
      return handler(req);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  };
} 