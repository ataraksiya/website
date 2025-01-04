import { verifyRecaptchaToken } from "@/lib/recaptcha";
import { sendEmail } from "@/lib/emailService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recaptchaToken, ...formData } = body;

    const verification = await verifyRecaptchaToken(recaptchaToken);

    if (!verification.success || verification.score < 0.5) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 },
      );
    }

    const emailResult = await sendEmail(formData);

    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
