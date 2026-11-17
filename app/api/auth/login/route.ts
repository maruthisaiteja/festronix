import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();

    // Query user with assigned event details
    const user = await prisma.user.findUnique({
      where: { username: cleanUsername },
      include: { assignedEvent: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Sign session token
    const token = signToken({
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role as "ADMIN" | "COORDINATOR",
      assignedEventId: user.assignedEventId,
      assignedVenue: user.assignedVenue || user.assignedEvent?.venue || null,
    });

    // Create Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          action: "LOGIN",
          performedBy: user.username,
          targetId: user.id,
          details: JSON.stringify({ role: user.role, time: new Date().toISOString() }),
        },
      });
    } catch {}

    const response = NextResponse.json({
      success: true,
      role: user.role,
      assignedEventId: user.assignedEventId,
      assignedVenue: user.assignedVenue || user.assignedEvent?.venue,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        assignedEvent: user.assignedEvent
          ? {
              id: user.assignedEvent.id,
              title: user.assignedEvent.title,
              venue: user.assignedEvent.venue,
              day: user.assignedEvent.day,
            }
          : null,
      },
    });

    // Set HTTP-only session cookie
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[Login API Error]", err);
    return NextResponse.json(
      { error: "Internal server error occurred" },
      { status: 500 }
    );
  }
}
