import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  try {
    // Basic health checks
    const checks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    // Check if critical services are available
    const serviceChecks = {
      memory: {
        used: process.memoryUsage().heapUsed / 1024 / 1024,
        total: process.memoryUsage().heapTotal / 1024 / 1024,
        percentage: (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100,
        status: process.memoryUsage().heapUsed / process.memoryUsage().heapTotal < 0.9 ? 'healthy' : 'warning',
      },
      responseTime: Date.now() - startTime,
    };

    return NextResponse.json(
      {
        ...checks,
        services: serviceChecks,
        message: 'All systems operational',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Health check failed',
      },
      { status: 503 }
    );
  }
}
