import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const allProjects = await prisma.project.findMany({ select: { id: true, name: true, status: true } });
  const activeCount = await prisma.project.count({ where: { status: 'ACTIVE' } });
  const completedCount = await prisma.project.count({ where: { status: 'COMPLETED' } });
  
  return NextResponse.json({
    activeCount,
    completedCount,
    allProjects
  });
}
