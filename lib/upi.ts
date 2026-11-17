import QRCode from "qrcode";

export interface UpiPaymentDetails {
  upiId?: string;
  upiName?: string;
  amount: number;
  transactionNote: string;
}

export function buildUpiUri(details: UpiPaymentDetails): string {
  const upiId = details.upiId || process.env.NEXT_PUBLIC_UPI_ID || "9490298994-2@ybl";
  const upiName = details.upiName || process.env.NEXT_PUBLIC_UPI_NAME || "Vardhaman College of Engineering";
  const amount = details.amount;
  const note = details.transactionNote;

  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
}

export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 320,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });
  } catch (err) {
    console.error("[QR Code Generation Error]", err);
    return "";
  }
}
