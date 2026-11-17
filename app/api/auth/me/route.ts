import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { assignedEvent: true },
  });

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      phone: user.phone,
      assignedVenue: user.assignedVenue || user.assignedEvent?.venue,
      assignedEvent: user.assignedEvent
        ? {
            id: user.assignedEvent.id,
            slug: user.assignedEvent.slug,
            title: user.assignedEvent.title,
            venue: user.assignedEvent.venue,
            day: user.assignedEvent.day,
            entryFee: user.assignedEvent.entryFee,
            category: user.assignedEvent.category,
          }
        : null,
    },
  });
}
