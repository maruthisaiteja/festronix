import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { FEST_EVENTS } from "../data/events";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Festronix 2026 database seed...");

  // 1. Seed Master Super Admin
  const adminPasswordHash = await bcrypt.hash("FestronixAdmin@2026", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin_sac" },
    update: {
      passwordHash: adminPasswordHash,
      name: "Student Affairs Cell Leadership",
      role: "ADMIN",
    },
    create: {
      username: "admin_sac",
      passwordHash: adminPasswordHash,
      name: "Student Affairs Cell Leadership",
      role: "ADMIN",
      phone: "+91 98765 43210",
      assignedVenue: "Main Administration",
    },
  });
  console.log(`✅ Master Admin seeded: ${admin.username} (${admin.name})`);

  // 2. Seed All 52 Official Events & Dedicated Coordinator Accounts
  const coordPasswordHash = await bcrypt.hash("Coord@Festronix2026", 10);

  for (const evt of FEST_EVENTS) {
    // Determine entry fee numeric
    let numericFee = 0;
    if (evt.entryFee && evt.entryFee.includes("₹")) {
      const match = evt.entryFee.match(/₹\s*(\d+)/);
      if (match) numericFee = parseFloat(match[1]);
    } else if (evt.entryFee && evt.entryFee.toLowerCase().includes("free")) {
      numericFee = 0;
    } else {
      numericFee = 100; // default nominal standard fee
    }

    // Upsert Event
    const eventRecord = await prisma.event.upsert({
      where: { id: evt.id },
      update: {
        slug: evt.slug,
        title: evt.title,
        category: evt.category,
        trackTag: evt.trackTag,
        day: evt.day,
        venue: evt.venue,
        entryFee: numericFee,
        teamSize: evt.teamSize,
        maxCapacity: 150,
      },
      create: {
        id: evt.id,
        slug: evt.slug,
        title: evt.title,
        category: evt.category,
        trackTag: evt.trackTag,
        day: evt.day,
        venue: evt.venue,
        entryFee: numericFee,
        teamSize: evt.teamSize,
        maxCapacity: 150,
      },
    });

    // Create / Upsert Coordinator Account for this event
    const coordUsername = `coord_${evt.slug.replace(/[^a-zA-Z0-9_]/g, "_")}`;
    const primaryCoordName = evt.coordinators[0]?.name || `${evt.title} Lead`;
    const primaryCoordPhone = evt.coordinators[0]?.phone || "+91 98480 00000";

    await prisma.user.upsert({
      where: { username: coordUsername },
      update: {
        passwordHash: coordPasswordHash,
        name: `${primaryCoordName} (${evt.title} Coordinator)`,
        role: "COORDINATOR",
        phone: primaryCoordPhone,
        assignedEventId: eventRecord.id,
        assignedVenue: evt.venue,
      },
      create: {
        username: coordUsername,
        passwordHash: coordPasswordHash,
        name: `${primaryCoordName} (${evt.title} Coordinator)`,
        role: "COORDINATOR",
        phone: primaryCoordPhone,
        assignedEventId: eventRecord.id,
        assignedVenue: evt.venue,
      },
    });
  }

  console.log(`✅ All ${FEST_EVENTS.length} events and coordinator accounts seeded successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
