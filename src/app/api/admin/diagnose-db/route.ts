import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const envVars = Object.keys(process.env)
      .filter(k => k.includes('POSTGRES') || k.includes('DATABASE') || k.includes('DB_'))
      .reduce((acc, key) => {
        acc[key] = process.env[key] ? '***SET***' : 'MISSING';
        return acc;
      }, {} as Record<string, string>);

    return NextResponse.json({
      status: 'diagnostics',
      availableDbEnvVars: envVars,
      allEnvVarCount: Object.keys(process.env).length,
      NODE_ENV: process.env.NODE_ENV,
      hasRequiredVars: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        POSTGRES_URL: !!process.env.POSTGRES_URL,
        POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
        POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Diagnostic failed', details: String(error) },
      { status: 500 }
    );
  }
}
