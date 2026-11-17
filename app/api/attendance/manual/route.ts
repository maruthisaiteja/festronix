import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { registrationId, status } = await req.json();

    if (!registrationId || !status) {
      return NextResponse.json({ error: "Registration ID and status ('PRESENT' | 'ABSENT') are required." }, { status: 400 });
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    // RBAC: If coordinator, verify assigned event
    if (session.role === "COORDINATOR" && session.assignedEventId !== registration.eventId) {
      return NextResponse.json({ error: "Forbidden: You can only mark attendance for your assigned arena." }, { status: 403 });
    }

    const isPresent = status === "PRESENT";
    const updated = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        attendanceStatus: isPresent ? "PRESENT" : "ABSENT",
        attendedAt: isPresent ? new Date() : null,
        attendedByUserId: isPresent ? session.userId : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Attendance updated to ${status} for ${registration.fullName}`,
      registration: updated,
    });
  } catch (err: any) {
    console.error("[Manual Attendance Error]", err);
    return NextResponse.json({ error: "Failed to update attendance: " + err.message }, { status: 500 });
  }
}
