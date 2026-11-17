import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Super Admin login required." }, { status: 403 });
    }

    // 1. Fetch all events with their coordinators and registrations
    const events = await prisma.event.findMany({
      include: {
        coordinators: {
          select: {
            id: true,
            username: true,
            name: true,
            phone: true,
          },
        },
        registrations: {
          select: {
            id: true,
            paymentStatus: true,
            paymentAmount: true,
            attendanceStatus: true,
          },
        },
      },
      orderBy: { title: "asc" },
    });

    // 2. Fetch pending verification queue (top 50 pending UTRs)
    const pendingUtrs = await prisma.registration.findMany({
      where: { paymentStatus: "PENDING_VERIFICATION" },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    });

    // 3. Compute aggregate analytics
    let totalFestRegistrations = 0;
    let totalFestRevenue = 0;
    let totalFestPresent = 0;

    const eventSummaries = events.map((evt) => {
      const regCount = evt.registrations.length;
      const presentCount = evt.registrations.filter((r) => r.attendanceStatus === "PRESENT").length;
      const eventRevenue = evt.registrations
        .filter((r) => r.paymentStatus === "VERIFIED" || r.paymentStatus === "CASH_PAID")
        .reduce((sum, r) => sum + r.paymentAmount, 0);

      totalFestRegistrations += regCount;
      totalFestPresent += presentCount;
      totalFestRevenue += eventRevenue;

      return {
        id: evt.id,
        slug: evt.slug,
        title: evt.title,
        venue: evt.venue,
        category: evt.category,
        day: evt.day,
        entryFee: evt.entryFee,
        coordinatorUsername: evt.coordinators[0]?.username || `coord_${evt.slug}`,
        coordinatorName: evt.coordinators[0]?.name || `${evt.title} Coordinator`,
        coordinatorPhone: evt.coordinators[0]?.phone || "SAC Helpdesk",
        registrationsCount: regCount,
        presentCount,
        revenue: eventRevenue,
      };
    });

    const globalAttendanceRate =
      totalFestRegistrations > 0
        ? Math.round((totalFestPresent / totalFestRegistrations) * 100)
        : 0;

    return NextResponse.json({
      success: true,
      metrics: {
        totalFestRegistrations,
        totalFestRevenue,
        totalFestPresent,
        globalAttendanceRate,
        pendingUtrCount: pendingUtrs.length,
        totalArenas: events.length,
      },
      events: eventSummaries,
      pendingUtrs,
    });
  } catch (err: any) {
    console.error("[Admin Stats API Error]", err);
    return NextResponse.json({ error: "Failed to load admin analytics: " + err.message }, { status: 500 });
  }
}
