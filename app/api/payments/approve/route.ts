import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { sendAdmissionTicketQrEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { registrationId, status } = await req.json();

    if (!registrationId || !status) {
      return NextResponse.json(
        { error: "Registration ID and new payment status are required." },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { event: true },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    // RBAC: If coordinator, ensure this registration belongs to their assigned event!
    if (session.role === "COORDINATOR" && session.assignedEventId !== registration.eventId) {
      return NextResponse.json(
        { error: "Forbidden. You can only manage registrations for your assigned arena." },
        { status: 403 }
      );
    }

    const updated = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        paymentStatus: status, // "VERIFIED" | "CASH_PAID" | "REJECTED"
        verifiedAt: new Date(),
        verifiedBy: session.username,
      },
    });

    // If payment approved, send Email 2 (Attendance QR pass)
    if (status === "VERIFIED" || status === "CASH_PAID") {
      sendAdmissionTicketQrEmail({
        regCode: updated.regCode,
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        college: updated.college,
        rollNumber: updated.rollNumber,
        department: updated.department,
        eventTitle: registration.event.title,
        venueRoom: registration.event.venue,
        festDay: registration.event.day,
        paymentMode: updated.paymentMode,
        paymentAmount: updated.paymentAmount,
        paymentStatus: updated.paymentStatus,
        utrNumber: updated.utrNumber,
        ticketToken: updated.ticketToken,
      }).catch((e) => console.error("[Payment Approval Email 2 Error]", e));
    }

    // Audit log
    try {
      await prisma.auditLog.create({
        data: {
          action: "PAYMENT_STATUS_UPDATE",
          performedBy: session.username,
          targetId: registration.id,
          details: JSON.stringify({ oldStatus: registration.paymentStatus, newStatus: status }),
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Payment status updated to ${status}. Admission pass dispatched.`,
      registration: updated,
    });
  } catch (err: any) {
    console.error("[Payment Approve Error]", err);
    return NextResponse.json({ error: "Failed to update payment status: " + err.message }, { status: 500 });
  }
}
