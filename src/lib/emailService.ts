import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mail.me.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ICLOUD_EMAIL,
    pass: process.env.ICLOUD_APP_SPECIFIC_PASSWORD,
  },
});

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendEmail(data: EmailData) {
  const { name, email, subject, message } = data;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Message</title>
      </head>
      <body style="
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: hsl(0, 0%, 9%);
        color: hsl(0, 0%, 100%);
      ">
        <div style="
          max-width: 600px;
          margin: 40px auto;
          padding: 24px;
          background-color: hsl(0, 0%, 11%);
          border-radius: 12px;
          border: 1px solid hsl(0, 0%, 18%);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        ">
          <!-- Header Section -->
          <div style="
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding-bottom: 24px;
            border-bottom: 1px solid hsl(0, 0%, 18%);
            margin-bottom: 24px;
          ">
            <h2 style="
              margin: 0;
              color: hsl(0, 0%, 100%);
              font-size: 24px;
              font-weight: 600;
            ">New Message Received</h2>
            <p style="
              margin: 0;
              color: hsl(0, 0%, 45%);
              font-size: 16px;
            ">You have a new message from your website's contact form.</p>
          </div>

          <!-- Content Section -->
          <div style="
            display: flex;
            flex-direction: column;
            gap: 20px;
          ">
            <!-- From Field -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="
                font-weight: 500;
                color: hsl(0, 0%, 100%);
                font-size: 14px;
              ">From</div>
              <div style="
                padding: 12px;
                background-color: hsl(0, 0%, 13%);
                border: 1px solid hsl(0, 0%, 18%);
                border-radius: 6px;
                color: hsl(0, 0%, 100%);
                font-size: 15px;
              ">${name} (${email})</div>
            </div>

            <!-- Subject Field -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="
                font-weight: 500;
                color: hsl(0, 0%, 100%);
                font-size: 14px;
              ">Subject</div>
              <div style="
                padding: 12px;
                background-color: hsl(0, 0%, 13%);
                border: 1px solid hsl(0, 0%, 18%);
                border-radius: 6px;
                color: hsl(0, 0%, 100%);
                font-size: 15px;
              ">${subject}</div>
            </div>

            <!-- Message Field -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="
                font-weight: 500;
                color: hsl(0, 0%, 100%);
                font-size: 14px;
              ">Message</div>
              <div style="
                padding: 12px;
                background-color: hsl(0, 0%, 13%);
                border: 1px solid hsl(0, 0%, 18%);
                border-radius: 6px;
                color: hsl(0, 0%, 100%);
                font-size: 15px;
                white-space: pre-wrap;
              ">${message.replace(/\n/g, "<br>")}</div>
            </div>
          </div>

          <!-- Footer -->
          <div style="
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid hsl(0, 0%, 18%);
            color: hsl(0, 0%, 45%);
            font-size: 14px;
            text-align: center;
          ">
            <p style="margin: 0;">To reply to this message, simply reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
New Message from Contact Form

From: ${name} (${email})
Subject: ${subject}

Message:
${message}

---
To reply, simply reply to this email.
  `.trim();

  const mailOptions = {
    from: process.env.ICLOUD_EMAIL,
    to: process.env.ICLOUD_EMAIL,
    replyTo: email,
    subject: `New Message: ${subject}`,
    text: textContent,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error };
  }
}
