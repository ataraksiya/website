import { verifyRecaptchaToken } from "@/lib/recaptcha";
import { sendEmail } from "@/lib/emailService";
import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { recaptchaToken, ...formData } = validationResult.data;

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
