import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
 
// ── Types ─────────────────────────────────────────────────────────────────────
interface ContactPayload {
  name: string;
  email: string;
  mobile: string;
  description: string;
}
 
// ── App Router handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();
    const { name, email, mobile, description } = body;
 
    // Basic validation
    if (!name || !email || !mobile || !description) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }
 
    // ── Nodemailer transporter ─────────────────────────────────────────────
    // Uses Gmail with an App Password.
    // Steps to get an App Password:
    //   1. Enable 2-Step Verification on the Gmail account.
    //   2. Go to myaccount.google.com → Security → App passwords.
    //   3. Generate a password for "Mail" / "Other" and paste it below (or in .env).
    //
    // .env.local:
    //   GMAIL_USER=Dushanprabashanarr@gmail.com
    //   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
    // ──────────────────────────────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // App Password, NOT your Gmail password
      },
    });
 
    // ── Email to Praba's team ──────────────────────────────────────────────
    const mailToArtist = {
      from: `"Lil Rome Praba Website" <${process.env.GMAIL_USER}>`,
      to: "Dushanprabashanarr@gmail.com",
      replyTo: email,
      subject: `[New Inquiry] ${name} — Booking / Press Contact`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body  { margin: 0; padding: 0; background: #0a0a0a; font-family: 'Helvetica Neue', Arial, sans-serif; }
              .wrap { max-width: 560px; margin: 40px auto; background: #111; border: 1px solid #1f1f1f; }
              .hdr  { background: #0a0a0a; padding: 32px 36px 24px; border-bottom: 1px solid #1f1f1f; }
              .ttl  { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #dc143c; margin-bottom: 6px; }
              .name { font-size: 28px; font-weight: 900; text-transform: uppercase; color: #fff; letter-spacing: 0.05em; }
              .body { padding: 32px 36px; }
              .row  { margin-bottom: 22px; }
              .lbl  { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #555; margin-bottom: 4px; }
              .val  { font-size: 14px; color: #ccc; line-height: 1.6; }
              .msg  { background: #0a0a0a; border: 1px solid #1f1f1f; padding: 16px 20px; border-radius: 2px; }
              .ftr  { padding: 20px 36px; border-top: 1px solid #1f1f1f; }
              .ftr p { font-size: 11px; color: #333; letter-spacing: 0.1em; margin: 0; }
              .accent { color: #c9a84c; }
            </style>
          </head>
          <body>
            <div class="wrap">
              <div class="hdr">
                <div class="ttl">New Inquiry</div>
                <div class="name">PRABA<span class="accent">.</span></div>
              </div>
              <div class="body">
                <div class="row">
                  <div class="lbl">Full Name</div>
                  <div class="val">${escapeHtml(name)}</div>
                </div>
                <div class="row">
                  <div class="lbl">Email</div>
                  <div class="val"><a href="mailto:${escapeHtml(email)}" style="color:#c9a84c;text-decoration:none;">${escapeHtml(email)}</a></div>
                </div>
                <div class="row">
                  <div class="lbl">Mobile</div>
                  <div class="val">${escapeHtml(mobile)}</div>
                </div>
                <div class="row">
                  <div class="lbl">Message</div>
                  <div class="val msg">${escapeHtml(description).replace(/\n/g, "<br/>")}</div>
                </div>
              </div>
              <div class="ftr">
                <p>Sent via lilromepraba.com contact form &nbsp;·&nbsp; Reply directly to respond to ${escapeHtml(name)}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
 
    // ── Auto-reply to the sender ───────────────────────────────────────────
    const mailToSender = {
      from: `"Lil Rome Praba" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "We got your message — Lil Rome Praba",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body  { margin: 0; padding: 0; background: #0a0a0a; font-family: 'Helvetica Neue', Arial, sans-serif; }
              .wrap { max-width: 560px; margin: 40px auto; background: #111; border: 1px solid #1f1f1f; }
              .hdr  { background: #0a0a0a; padding: 32px 36px 24px; border-bottom: 1px solid #1f1f1f; }
              .ttl  { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #dc143c; margin-bottom: 6px; }
              .name { font-size: 28px; font-weight: 900; text-transform: uppercase; color: #fff; letter-spacing: 0.05em; }
              .body { padding: 32px 36px; }
              .p    { font-size: 14px; color: #888; line-height: 1.8; margin-bottom: 16px; }
              .ftr  { padding: 20px 36px; border-top: 1px solid #1f1f1f; }
              .ftr p { font-size: 11px; color: #333; letter-spacing: 0.1em; margin: 0; }
              .accent { color: #c9a84c; }
            </style>
          </head>
          <body>
            <div class="wrap">
              <div class="hdr">
                <div class="ttl">Message Received</div>
                <div class="name">PRABA<span class="accent">.</span></div>
              </div>
              <div class="body">
                <p class="p">Hey ${escapeHtml(name)},</p>
                <p class="p">Your message has landed. The team will review your inquiry and get back to you within 24–48 hours.</p>
                <p class="p">Sri Lanka's hardest — every bar a statement.</p>
                <p class="p" style="color:#555;font-size:12px;font-style:italic;">— Lil Rome Praba Team</p>
              </div>
              <div class="ftr">
                <p>© 2026 LIL ROME PRABA Official. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
 
    // Send both in parallel
    await Promise.all([
      transporter.sendMail(mailToArtist),
      transporter.sendMail(mailToSender),
    ]);
 
    return NextResponse.json({ message: "Message sent successfully." }, { status: 200 });
  } catch (err) {
    console.error("[contact/route] Error sending email:", err);
    return NextResponse.json(
      { message: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
 
// ── HTML escape helper ────────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
 