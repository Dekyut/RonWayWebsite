import nodemailer from 'nodemailer';

function normalizeSecret(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s/g, '');
}

export function createTransporter() {
  const user = process.env.EMAIL_USER;

  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user,
        pass: normalizeSecret(process.env.EMAIL_APP_PASSWORD),
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user,
      pass: normalizeSecret(process.env.EMAIL_PASSWORD),
    },
  });
}
