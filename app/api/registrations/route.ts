import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { buildUpiUri, generateQrDataUrl } from "@/lib/upi";
import { sendRegistrationConfirmationEmail, sendAdmissionTicketQrEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      eventId,
      fullName,
      email,
      phone,
      college,
      rollNumber,
      department,
      yearOfStudy,
      isTeam,
      teamName,
      teamMembers,
      paymentMode, // "UPI_QR" | "CASH" | "FREE"
      utrNumber,
      isSpotRegistration,
    } = body;

    // Validate required fields
    if (!eventId || !fullName || !email || !phone || !rollNumber) {
      return NextResponse.json(
        { error: "Required fields missing: eventId, fullName, email, phone, rollNumber are required." },
        { status: 400 }
      );
    }

    // Clean inputs
    const cleanRollNumber = String(rollNumber).trim().toUpperCase();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).trim();

    // Verify event exists (by id or slug)
    const event = await prisma.event.findFirst({
      where: {
        OR: [
          { id: String(eventId) },
          { slug: String(eventId) },
        ],
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Selected competition arena not found." },
        { status: 404 }
      );
    }

    // Check for duplicate registration for this student and this event
    const existingReg = await prisma.registration.findUnique({
      where: {
        eventId_rollNumber: {
          eventId: event.id,
          rollNumber: cleanRollNumber,
        },
      },
    });

    if (existingReg) {
      return NextResponse.json(
        {
          error: `Roll Number ${cleanRollNumber} is already registered for ${event.title}.`,
          existingRegCode: existingReg.regCode,
        },
        { status: 409 }
      );
    }

    // Check optional session (if spot registered by coordinator)
    const session = getSessionFromRequest(req);
    const isRegistrar = session && (session.role === "ADMIN" || session.role === "COORDINATOR");

    // Generate unique Registration Code: FX26-ROOM-RANDOM
    const roomClean = event.venue.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase() || "MAIN";
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regCode = `FX26-${roomClean}-${randomSuffix}`;
    const ticketToken = crypto.randomBytes(16).toString("hex");

    // Determine initial payment status
    let paymentStatus = "PENDING_VERIFICATION";
    const cleanPaymentMode = paymentMode || (event.entryFee > 0 ? "UPI_QR" : "FREE");

    if (cleanPaymentMode === "FREE" || event.entryFee === 0) {
      paymentStatus = "VERIFIED";
    } else if (cleanPaymentMode === "CASH" && isRegistrar) {
      paymentStatus = "CASH_PAID";
    }

    // Check UTR uniqueness if provided
    if (utrNumber && String(utrNumber).trim()) {
      const cleanUtr = String(utrNumber).trim();
      const existingUtr = await prisma.registration.findFirst({
        where: { utrNumber: cleanUtr },
      });
      if (existingUtr) {
        return NextResponse.json(
          { error: "This UPI Reference Number (UTR) has already been submitted for another registration." },
          { status: 409 }
        );
      }
    }

    // Create registration in database
    const registration = await prisma.registration.create({
      data: {
        regCode,
        ticketToken,
        eventId: event.id,
        fullName: String(fullName).trim(),
        email: cleanEmail,
        phone: cleanPhone,
        college: String(college || "Vardhaman College of Engineering").trim(),
        rollNumber: cleanRollNumber,
        department: String(department || "Engineering").trim(),
        yearOfStudy: String(yearOfStudy || "3rd Year").trim(),
        isTeam: Boolean(isTeam),
        teamName: isTeam ? String(teamName || "").trim() : null,
        teamMembers: isTeam && teamMembers ? JSON.stringify(teamMembers) : null,
        registrationMode: isSpotRegistration && isRegistrar ? "OFFLINE_SPOT" : "ONLINE",
        registeredById: isRegistrar ? session.userId : null,
        paymentMode: cleanPaymentMode,
        paymentAmount: event.entryFee,
        paymentStatus,
        utrNumber: utrNumber ? String(utrNumber).trim() : null,
        verifiedAt: paymentStatus === "VERIFIED" || paymentStatus === "CASH_PAID" ? new Date() : null,
        verifiedBy: isRegistrar ? session.username : null,
      },
      include: { event: true },
    });

    // Build UPI URI for dynamic QR
    const upiUri = buildUpiUri({
      amount: event.entryFee,
      transactionNote: `Festronix ${regCode}`,
    });
    const upiQrDataUrl = await generateQrDataUrl(upiUri);

    // Build Attendance QR Data URL
    const attendancePayload = JSON.stringify({
      regCode: registration.regCode,
      token: registration.ticketToken,
      roll: registration.rollNumber,
      venue: event.venue,
    });
    const attendanceQrDataUrl = await generateQrDataUrl(attendancePayload);

    // Trigger Email 1: Registration Confirmation & Receipt asynchronously
    sendRegistrationConfirmationEmail({
      regCode: registration.regCode,
      fullName: registration.fullName,
      email: registration.email,
      phone: registration.phone,
      college: registration.college,
      rollNumber: registration.rollNumber,
      department: registration.department,
      eventTitle: event.title,
      venueRoom: event.venue,
      festDay: event.day,
      paymentMode: registration.paymentMode,
      paymentAmount: registration.paymentAmount,
      paymentStatus: registration.paymentStatus,
      utrNumber: registration.utrNumber,
      ticketToken: registration.ticketToken,
    }).catch((e) => console.error("[Async Email 1 error]", e));

    // If verified or cash paid, also trigger Email 2: Attendance QR Pass
    if (paymentStatus === "VERIFIED" || paymentStatus === "CASH_PAID") {
      sendAdmissionTicketQrEmail({
        regCode: registration.regCode,
        fullName: registration.fullName,
        email: registration.email,
        phone: registration.phone,
        college: registration.college,
        rollNumber: registration.rollNumber,
        department: registration.department,
        eventTitle: event.title,
        venueRoom: event.venue,
        festDay: event.day,
        paymentMode: registration.paymentMode,
        paymentAmount: registration.paymentAmount,
        paymentStatus: registration.paymentStatus,
        utrNumber: registration.utrNumber,
        ticketToken: registration.ticketToken,
      }).catch((e) => console.error("[Async Email 2 error]", e));
    }

    return NextResponse.json({
      success: true,
      registration: {
        id: registration.id,
        regCode: registration.regCode,
        ticketToken: registration.ticketToken,
        fullName: registration.fullName,
        rollNumber: registration.rollNumber,
        college: registration.college,
        department: registration.department,
        yearOfStudy: registration.yearOfStudy,
        eventTitle: event.title,
        venueRoom: event.venue,
        festDay: event.day,
        paymentMode: registration.paymentMode,
        paymentAmount: registration.paymentAmount,
        paymentStatus: registration.paymentStatus,
        isTeam: registration.isTeam,
        teamName: registration.teamName,
      },
      upi: {
        uri: upiUri,
        qrDataUrl: upiQrDataUrl,
        amount: event.entryFee,
        note: `Festronix ${regCode}`,
      },
      attendanceQrDataUrl,
    });
  } catch (err: any) {
    console.error("[Create Registration API Error]", err);
    return NextResponse.json(
      { error: "Failed to process registration. " + (err.message || "") },
      { status: 500 }
    );
  }
}

// GET: Filterable registrations listing for authorized dashboards
export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventIdParam = searchParams.get("eventId");
    const paymentStatusParam = searchParams.get("paymentStatus");
    const attendanceStatusParam = searchParams.get("attendanceStatus");
    const searchParam = searchParams.get("search");

    // Scoped restriction: Coordinators can ONLY see their assigned event!
    let targetEventId = eventIdParam;
    if (session.role === "COORDINATOR") {
      targetEventId = session.assignedEventId;
    }

    const where: any = {};
    if (targetEventId) where.eventId = targetEventId;
    if (paymentStatusParam && paymentStatusParam !== "ALL") where.paymentStatus = paymentStatusParam;
    if (attendanceStatusParam && attendanceStatusParam !== "ALL") where.attendanceStatus = attendanceStatusParam;

    if (searchParam && searchParam.trim()) {
      const q = searchParam.trim();
      where.OR = [
        { fullName: { contains: q } },
        { rollNumber: { contains: q } },
        { regCode: { contains: q } },
        { email: { contains: q } },
        { utrNumber: { contains: q } },
      ];
    }

    const registrations = await prisma.registration.findMany({
      where,
      include: { event: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (err: any) {
    console.error("[Get Registrations API Error]", err);
    return NextResponse.json({ error: "Failed to fetch registrations." }, { status: 500 });
  }
}
