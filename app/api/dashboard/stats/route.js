import { NextResponse } from 'next/server';
import { auth } from '@/middleware/auth';
import { dashboardService } from '@/services/dashboardService';

export const GET = auth(async (req) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.userId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}); 