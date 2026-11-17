import nodemailer from "nodemailer";
import QRCode from "qrcode";

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
  const port = parseInt(process.env.SMTP_PORT || "587", 10);

  if (!user || !pass) {
    return null;
  }

  if (host.includes("gmail.com")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

export interface RegistrationEmailData {
  regCode: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  rollNumber: string;
  department: string;
  eventTitle: string;
  venueRoom: string;
  festDay: string;
  paymentMode: string;
  paymentAmount: number;
  paymentStatus: string;
  utrNumber?: string | null;
  ticketToken: string;
}

// ─────────────────────────────────────────────────────────────
// EMAIL 1: Registration Confirmation & Payment Receipt
// ─────────────────────────────────────────────────────────────
export async function sendRegistrationConfirmationEmail(data: RegistrationEmailData): Promise<{
  success: boolean;
  simulated?: boolean;
  error?: string;
}> {
  const transporter = getTransporter();

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Festronix 2026 Registration Confirmation</title>
  </head>
  <body style="margin: 0; padding: 24px; background-color: #06080C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #EEF0F5;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #0B0E17; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
      
      <!-- Top Institutional Banner -->
      <tr>
        <td style="padding: 28px; background: linear-gradient(135deg, #101422 0%, #07090F 100%); border-bottom: 1px solid rgba(255,255,255,0.08); text-align: center;">
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #12A4C4; letter-spacing: 2px; text-transform: uppercase;">
            Vardhaman College of Engineering
          </h3>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #7A8296;">
            Student Affairs Cell · Autonomous NAAC 'A++' Grade
          </p>
          <h1 style="margin: 16px 0 0 0; font-size: 28px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.5px;">
            FESTRONIX 2026
          </h1>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #00FF9D; font-weight: 600;">
            ✓ Registration Logged & Receipt Generated
          </p>
        </td>
      </tr>

      <!-- Registration Summary -->
      <tr>
        <td style="padding: 28px;">
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #A3A9B8; line-height: 1.6;">
            Hello <strong style="color: #FFFFFF;">${data.fullName}</strong>,<br />
            Your registration for <strong>Festronix 2026</strong> has been officially logged in the campus registration database.
          </p>

          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #121622; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; margin-bottom: 24px;">
            <tr>
              <td style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.06);">
                <span style="font-size: 11px; color: #7A8296; text-transform: uppercase; font-family: monospace;">Registration Code</span>
                <div style="font-size: 18px; font-weight: 800; color: #22D3EE; font-family: monospace; margin-top: 2px;">${data.regCode}</div>
              </td>
              <td style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); text-align: right;">
                <span style="font-size: 11px; color: #7A8296; text-transform: uppercase; font-family: monospace;">Fest Days</span>
                <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-top: 2px;">Dec 1 & 2, 2026</div>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 16px;">
                <div style="font-size: 12px; color: #7A8296; text-transform: uppercase; font-family: monospace;">Designated Arena</div>
                <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${data.eventTitle}</div>
                <div style="margin-top: 8px;">
                  <span style="display: inline-block; background-color: #161C2A; border: 1px solid #00FF9D; padding: 4px 10px; border-radius: 8px; font-size: 12px; color: #00FF9D; font-family: monospace; font-weight: 700;">
                    📍 Official Venue: ${data.venueRoom}
                  </span>
                </div>
              </td>
            </tr>
          </table>

          <!-- Delegate Academic Details Table -->
          <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 12px; color: #A3A9B8; margin-bottom: 24px;">
            <tr>
              <td width="35%" style="color: #7A8296;">Student Roll No:</td>
              <td style="color: #FFFFFF; font-family: monospace; font-weight: 600;">${data.rollNumber}</td>
            </tr>
            <tr>
              <td style="color: #7A8296;">Institution:</td>
              <td style="color: #FFFFFF;">${data.college}</td>
            </tr>
            <tr>
              <td style="color: #7A8296;">Branch & Year:</td>
              <td style="color: #FFFFFF;">${data.department}</td>
            </tr>
            <tr>
              <td style="color: #7A8296;">Payment Mode:</td>
              <td style="color: #FFFFFF; font-weight: 600;">${data.paymentMode} · ₹${data.paymentAmount}</td>
            </tr>
            ${data.utrNumber ? `
            <tr>
              <td style="color: #7A8296;">UPI UTR Ref:</td>
              <td style="color: #00FF9D; font-family: monospace;">${data.utrNumber}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="color: #7A8296;">Payment Status:</td>
              <td style="color: #818CF8; font-weight: 700;">${data.paymentStatus}</td>
            </tr>
          </table>

          <!-- Event Day Instructions -->
          <div style="padding: 16px; background-color: #161C2A; border-left: 3px solid #12A4C4; border-radius: 8px; font-size: 12px; color: #A3A9B8; line-height: 1.5;">
            <strong style="color: #FFFFFF;">Important Fest Instructions:</strong><br />
            • Delegate check-in begins at <strong>08:30 AM on December 1, 2026</strong> at the VCE Main Quadrangle.<br />
            • Bring your college ID card for physical verification.<br />
            • Your separate <strong>Attendance QR Pass</strong> has been generated and sent to this email.
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 20px; background-color: #07090F; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; font-size: 11px; color: #7A8296;">
          Student Affairs Cell · Vardhaman College of Engineering · Shamshabad, Hyderabad 501218
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  if (!transporter) {
    console.log(`[SIMULATED EMAIL 1 - REGISTRATION CONFIRMATION] To: ${data.email} | Event: ${data.eventTitle} | Code: ${data.regCode}`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Festronix 2026 <festronix@vardhaman.org>",
      to: data.email,
      subject: `Registration Confirmed: ${data.eventTitle} — Festronix 2026 [${data.regCode}]`,
      html: htmlContent,
    });
    return { success: true };
  } catch (err: any) {
    console.error("[Email 1 Error]", err);
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────
// EMAIL 2: Official Digital Admission Pass with Embedded Attendance QR
// ─────────────────────────────────────────────────────────────
export async function sendAdmissionTicketQrEmail(data: RegistrationEmailData): Promise<{
  success: boolean;
  simulated?: boolean;
  error?: string;
}> {
  const transporter = getTransporter();

  // Generate QR Code Buffer
  const qrPayload = JSON.stringify({
    regCode: data.regCode,
    token: data.ticketToken,
    roll: data.rollNumber,
    venue: data.venueRoom,
  });

  const qrBuffer = await QRCode.toBuffer(qrPayload, {
    width: 280,
    margin: 2,
    color: { dark: "#06080C", light: "#FFFFFF" },
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Festronix 2026 Attendance QR Pass</title>
  </head>
  <body style="margin: 0; padding: 24px; background-color: #06080C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #EEF0F5;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; margin: 0 auto; background-color: #0B0E17; border: 2px solid #12A4C4; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.8);">
      
      <!-- Pass Header -->
      <tr>
        <td style="padding: 24px; background: linear-gradient(135deg, #121826 0%, #07090F 100%); border-bottom: 1px solid rgba(255,255,255,0.1); text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: #12A4C4; letter-spacing: 2px; text-transform: uppercase;">
            OFFICIAL ATTENDANCE ENTRY PASS
          </div>
          <h1 style="margin: 8px 0 0 0; font-size: 26px; font-weight: 900; color: #FFFFFF;">
            FESTRONIX 2026
          </h1>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #A3A9B8;">
            Vardhaman College of Engineering · Dec 1 & 2, 2026
          </p>
        </td>
      </tr>

      <!-- QR Code Body -->
      <tr>
        <td style="padding: 32px 24px; text-align: center;">
          <div style="display: inline-block; background-color: #FFFFFF; padding: 14px; border-radius: 18px; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
            <img src="cid:attendance_qr_pass" width="220" height="220" alt="Attendance QR Code" style="display: block;" />
          </div>

          <div style="margin-top: 20px;">
            <div style="font-size: 20px; font-weight: 800; color: #FFFFFF;">${data.fullName}</div>
            <div style="font-size: 14px; font-family: monospace; color: #22D3EE; font-weight: 700; margin-top: 4px;">${data.rollNumber}</div>
            <div style="font-size: 12px; color: #7A8296; margin-top: 2px;">${data.college}</div>
          </div>

          <!-- Venue & Arena Pill -->
          <div style="margin-top: 24px; padding: 16px; background-color: #121622; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; text-align: left;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td>
                  <span style="font-size: 11px; color: #7A8296; text-transform: uppercase; font-family: monospace;">Registered Arena</span>
                  <div style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin-top: 2px;">${data.eventTitle}</div>
                </td>
                <td style="text-align: right;">
                  <span style="font-size: 11px; color: #7A8296; text-transform: uppercase; font-family: monospace;">Venue Room</span>
                  <div style="font-size: 16px; font-weight: 800; color: #00FF9D; font-family: monospace; margin-top: 2px;">${data.venueRoom}</div>
                </td>
              </tr>
            </table>
          </div>

          <p style="margin: 20px 0 0 0; font-size: 12px; color: #A3A9B8; line-height: 1.5;">
            Scan this QR code upon entrance at <strong>${data.venueRoom}</strong>.<br />
            The Student Coordinator will scan this pass to record your official fest attendance.
          </p>
        </td>
      </tr>

      <!-- Pass Security Footer -->
      <tr>
        <td style="padding: 16px; background-color: #07090F; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; font-size: 11px; color: #7A8296; font-family: monospace;">
          PASS ID: ${data.regCode} · NON-TRANSFERABLE
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  if (!transporter) {
    console.log(`[SIMULATED EMAIL 2 - ATTENDANCE QR PASS] To: ${data.email} | TicketToken: ${data.ticketToken} | Venue: ${data.venueRoom}`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Festronix 2026 <festronix@vardhaman.org>",
      to: data.email,
      subject: `Attendance QR Pass: ${data.eventTitle} (${data.venueRoom}) — Festronix 2026`,
      html: htmlContent,
      attachments: [
        {
          filename: "attendance_pass_qr.png",
          content: qrBuffer,
          cid: "attendance_qr_pass",
        },
      ],
    });
    return { success: true };
  } catch (err: any) {
    console.error("[Email 2 Error]", err);
    return { success: false, error: err.message };
  }
}
