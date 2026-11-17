import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Coordinator login required." }, { status: 401 });
    }

    const { qrData } = await req.json();
    if (!qrData) {
      return NextResponse.json({ error: "No QR scan data received." }, { status: 400 });
    }

    // Parse QR payload (supports both JSON payload or raw token / regCode)
    let token = "";
    let regCode = "";

    try {
      const parsed = typeof qrData === "string" ? JSON.parse(qrData) : qrData;
      token = parsed.token || "";
      regCode = parsed.regCode || "";
    } catch {
      // Raw string might be token or regCode
      if (qrData.startsWith("FX26-")) {
        regCode = qrData.trim();
      } else {
        token = qrData.trim();
      }
    }

    // Lookup registration
    const registration = await prisma.registration.findFirst({
      where: {
        OR: [
          token ? { ticketToken: token } : undefined,
          regCode ? { regCode } : undefined,
        ].filter(Boolean) as any,
      },
      include: {
        event: true,
        attendedByUser: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Invalid Pass. No matching registration record found in database." },
        { status: 404 }
      );
    }

    // RBAC: Verify if coordinator's assigned event matches the registration
    if (session.role === "COORDINATOR" && session.assignedEventId) {
      if (registration.eventId !== session.assignedEventId) {
        return NextResponse.json(
          {
            error: `Venue Room Mismatch: Delegate is registered for "${registration.event.title}" at ${registration.event.venue}, not for this arena.`,
            registeredEvent: registration.event.title,
            registeredVenue: registration.event.venue,
          },
          { status: 403 }
        );
      }
    }

    // DUPLICATE ENTRY CHECK: If already admitted, warn coordinator!
    if (registration.attendanceStatus === "PRESENT") {
      const formattedTime = registration.attendedAt
        ? new Date(registration.attendedAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "Earlier";

      return NextResponse.json(
        {
          alreadyAdmitted: true,
          message: `ALREADY ADMITTED: ${registration.fullName} was checked in at ${formattedTime}.`,
          registration: {
            regCode: registration.regCode,
            fullName: registration.fullName,
            rollNumber: registration.rollNumber,
            attendedAt: registration.attendedAt,
          },
        },
        { status: 200 }
      );
    }

    // Check payment clearance
    const isPaymentCleared =
      registration.paymentStatus === "VERIFIED" ||
      registration.paymentStatus === "CASH_PAID" ||
      registration.event.entryFee === 0;

    if (!isPaymentCleared) {
      return NextResponse.json(
        {
          error: `Payment Pending: Delegate has not completed payment verification (${registration.paymentStatus}). Please verify payment before admission.`,
          paymentStatus: registration.paymentStatus,
        },
        { status: 402 }
      );
    }

    // Mark Attendance as PRESENT
    const now = new Date();
    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: {
        attendanceStatus: "PRESENT",
        attendedAt: now,
        attendedByUserId: session.userId,
      },
    });

    // Create Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          action: "ATTENDANCE_SCAN_CHECKIN",
          performedBy: session.username,
          targetId: registration.id,
          details: JSON.stringify({
            regCode: registration.regCode,
            roll: registration.rollNumber,
            time: now.toISOString(),
          }),
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Checked In Successfully: ${registration.fullName} (${registration.rollNumber})`,
      registration: {
        id: updated.id,
        regCode: updated.regCode,
        fullName: updated.fullName,
        rollNumber: updated.rollNumber,
        college: updated.college,
        department: updated.department,
        eventTitle: registration.event.title,
        venueRoom: registration.event.venue,
        attendedAt: now,
        attendanceStatus: "PRESENT",
      },
    });
  } catch (err: any) {
    console.error("[Attendance Scan Error]", err);
    return NextResponse.json({ error: "Failed to process scan: " + err.message }, { status: 500 });
  }
}
