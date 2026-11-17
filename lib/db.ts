import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function getWritableDatabaseUrl(): string {
  // If explicitly pointing to /tmp already
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("/tmp/")) {
    return process.env.DATABASE_URL;
  }

  // In production / Linux containers (like Zoho Catalyst AppSail), the app directory can be read-only.
  // SQLite requires write access to the db file directory for journals and lock files.
  if (process.platform === "linux" || process.env.NODE_ENV === "production") {
    const tmpDbPath = "/tmp/festronix.db";
    try {
      let needsCopy = true;
      if (fs.existsSync(tmpDbPath)) {
        const stats = fs.statSync(tmpDbPath);
        if (stats.size > 0) {
          needsCopy = false;
        }
      }

      if (needsCopy) {
        const candidatePaths = [
          path.join(process.cwd(), "prisma", "festronix.db"),
          path.join(process.cwd(), "festronix.db"),
          path.join(__dirname, "..", "prisma", "festronix.db"),
          path.join(__dirname, "..", "..", "prisma", "festronix.db"),
          path.join(__dirname, "festronix.db"),
          "/catalyst/prisma/festronix.db",
          "/catalyst/festronix.db",
        ];

        let copied = false;
        for (const candidate of candidatePaths) {
          if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
            fs.copyFileSync(candidate, tmpDbPath);
            try {
              fs.chmodSync(tmpDbPath, 0o666);
            } catch {}
            console.log(`[Festronix DB] Copied database from ${candidate} to ${tmpDbPath}`);
            copied = true;
            break;
          }
        }

        if (!copied) {
          console.warn("[Festronix DB] Warning: Seeded festronix.db not found in candidates, creating empty or using fallback");
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        const resolvedUrl = `file:${tmpDbPath}`;
        process.env.DATABASE_URL = resolvedUrl;
        return resolvedUrl;
      }
    } catch (err) {
      console.error("[Festronix DB] Error ensuring writable db in /tmp:", err);
    }
  }

  return process.env.DATABASE_URL || "file:./prisma/festronix.db";
}

const activeDbUrl = getWritableDatabaseUrl();

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: activeDbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
