import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { regCode, utrNumber } = await req.json();

    if (!regCode || !utrNumber) {
      return NextResponse.json(
        { error: "Registration code and 12-digit UTR number are required." },
        { status: 400 }
      );
    }

    const cleanUtr = String(utrNumber).trim();
    if (!/^\d{12}$/.test(cleanUtr)) {
      return NextResponse.json(
        { error: "Invalid UTR. Please enter a valid 12-digit UPI reference number." },
        { status: 400 }
      );
    }

    // Check if this UTR was already submitted on another registration
    const existingUtr = await prisma.registration.findFirst({
      where: {
        utrNumber: cleanUtr,
        NOT: { regCode },
      },
    });

    if (existingUtr) {
      return NextResponse.json(
        { error: "This UPI Reference Number has already been submitted for another registration." },
        { status: 409 }
      );
    }

    const registration = await prisma.registration.findUnique({
      where: { regCode },
      include: { event: true },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration record not found for code: " + regCode },
        { status: 404 }
      );
    }

    const updated = await prisma.registration.update({
      where: { regCode },
      data: {
        utrNumber: cleanUtr,
        paymentStatus: "PENDING_VERIFICATION",
      },
    });

    return NextResponse.json({
      success: true,
      message: "UTR submitted successfully. Awaiting coordinator verification.",
      registration: {
        regCode: updated.regCode,
        utrNumber: updated.utrNumber,
        paymentStatus: updated.paymentStatus,
      },
    });
  } catch (err: any) {
    console.error("[Submit UTR Error]", err);
    return NextResponse.json(
      { error: "Failed to submit UTR: " + err.message },
      { status: 500 }
    );
  }
}
