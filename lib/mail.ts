import "server-only";
import nodemailer from "nodemailer";

export async function sendGmail(options: { to: string; subject: string; text: string }): Promise<boolean> {
  const user = process.env.GMAIL_MAIL_USERNAME;
  const pass = process.env.GMAIL_MAIL_PASSWORD;
  if (!user || !pass) return false;
  const transport = nodemailer.createTransport({
    host: process.env.GMAIL_MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.GMAIL_MAIL_PORT || 587),
    secure: false,
    auth: { user, pass },
  });
  await transport.sendMail({
    from: process.env.GMAIL_MAIL_FROM_ADDRESS || user,
    to: options.to,
    subject: options.subject,
    text: options.text,
  });
  return true;
}

export async function sendZoho(options: { to: string; subject: string; text: string }): Promise<boolean> {
  const user = process.env.ZOHO_MAIL_USERNAME;
  const pass = process.env.ZOHO_MAIL_PASSWORD;
  if (!user || !pass) return false;
  const transport = nodemailer.createTransport({
    host: process.env.ZOHO_MAIL_HOST || "smtp.zoho.com",
    port: Number(process.env.ZOHO_MAIL_PORT || 587),
    secure: false,
    auth: { user, pass },
  });
  await transport.sendMail({
    from: process.env.NOREPLY_MAIL_FROM_ADDRESS || "noreply@bansalimmigration.com.au",
    to: options.to,
    subject: options.subject,
    text: options.text,
  });
  return true;
}
