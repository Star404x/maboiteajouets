import { NextRequest, NextResponse } from "next/server";

const EMAIL_FROM = process.env.EMAIL_FROM || "info.maboiteajouets@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validation simple
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // TODO: Intégrer Resend, SendGrid, ou un autre service
    // Pour maintenant, on simule une réussite
    console.log(`📧 Contact form submission:
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
      Should be sent to: ${EMAIL_FROM}`);

    // Exemple avec Resend (à décommenter après setup):
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     from: EMAIL_FROM,
    //     to: EMAIL_FROM,
    //     replyTo: email,
    //     subject: `Nouveau message de contact: ${subject}`,
    //     html: `<p><strong>De:</strong> ${name} (${email})</p><p><strong>Sujet:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    //   }),
    // });

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
