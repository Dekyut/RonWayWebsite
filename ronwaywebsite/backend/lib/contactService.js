import isEmail from 'isemail';
import { createTransporter } from './email.js';
import {
  MAX_FIELD_LENGTH,
  escapeHtml,
  sanitize,
  sanitizeEmail,
  sanitizeName,
  validateLength,
} from './sanitize.js';

const isProduction = process.env.NODE_ENV === 'production';

function formatPhoneNumber(phone, countryCode) {
  const code = countryCode || '+63';
  const cleaned = phone.replace(/\s/g, '');

  if (code === '+63' && cleaned.startsWith('0')) {
    const number = cleaned.substring(1);
    if (number.length === 10) {
      return `${code} ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
  }

  if (cleaned.length > 0) {
    return `${code} ${cleaned.match(/.{1,3}/g)?.join(' ') || cleaned}`;
  }

  return `${code} ${phone}`;
}

export async function processContactForm(body) {
  try {
    const { firstName, lastName, email, phoneNumber, message, countryCode } = body ?? {};

    if (!firstName || !lastName || !email || !phoneNumber || !message) {
      return {
        status: 400,
        body: { success: false, error: 'All fields are required' },
      };
    }

    if (!validateLength(firstName, MAX_FIELD_LENGTH.firstName)) {
      return {
        status: 400,
        body: {
          success: false,
          error: `First name must be ${MAX_FIELD_LENGTH.firstName} characters or less`,
        },
      };
    }
    if (!validateLength(lastName, MAX_FIELD_LENGTH.lastName)) {
      return {
        status: 400,
        body: {
          success: false,
          error: `Last name must be ${MAX_FIELD_LENGTH.lastName} characters or less`,
        },
      };
    }
    if (!validateLength(email, MAX_FIELD_LENGTH.email)) {
      return {
        status: 400,
        body: {
          success: false,
          error: `Email must be ${MAX_FIELD_LENGTH.email} characters or less`,
        },
      };
    }
    if (!validateLength(phoneNumber, MAX_FIELD_LENGTH.phoneNumber)) {
      return {
        status: 400,
        body: {
          success: false,
          error: `Phone number must be ${MAX_FIELD_LENGTH.phoneNumber} characters or less`,
        },
      };
    }
    if (!validateLength(message, MAX_FIELD_LENGTH.message)) {
      return {
        status: 400,
        body: {
          success: false,
          error: `Message must be ${MAX_FIELD_LENGTH.message} characters or less`,
        },
      };
    }

    const sanitizedEmail = sanitizeEmail(email);
    if (!isEmail.validate(sanitizedEmail)) {
      return {
        status: 400,
        body: { success: false, error: 'Invalid email address' },
      };
    }

    const sanitizedFirstName = sanitizeName(firstName);
    const sanitizedLastName = sanitizeName(lastName);
    const sanitizedMessage = sanitize(message);
    const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, '');
    const sanitizedCountryCode = (countryCode || '+63').replace(/[^+\d]/g, '');

    const now = new Date();
    const dateTime = now
      .toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .replace(/,/g, '');

    const formattedPhone = formatPhoneNumber(sanitizedPhoneNumber, sanitizedCountryCode);
    const fullName = `${sanitizedFirstName} ${sanitizedLastName}`;
    const transporter = createTransporter();
    const safeReplyTo = sanitizeEmail(sanitizedEmail);

    const emailBody = `You received a new inquiry from the website contact form.

Client Information
------------------------
Name: ${fullName}
Email: ${safeReplyTo}
Phone: ${formattedPhone}

Message
------------------------
${sanitizedMessage}


Submitted At: ${dateTime}`;

    const safeSubject = `New Contact Form Submission from ${fullName}`.substring(0, 200);

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'Ronway Contact Form'}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVING_EMAIL || 'ronwaycars.travel@gmail.com',
      replyTo: safeReplyTo,
      subject: safeSubject,
      text: emailBody,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          <p>You received a new inquiry from the website contact form.</p>
          
          <p><strong>Client Information</strong><br>
          ${'─'.repeat(24)}<br>
          Name: ${escapeHtml(fullName)}<br>
          Email: ${escapeHtml(safeReplyTo)}<br>
          Phone: ${escapeHtml(formattedPhone)}</p>
          
          <p><strong>Message</strong><br>
          ${'─'.repeat(24)}<br>
          ${escapeHtml(sanitizedMessage).replace(/\n/g, '<br>')}</p>
          
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            Submitted At: ${escapeHtml(dateTime)}
          </p>
        </div>
      `,
    });

    if (process.env.SEND_CONFIRMATION_EMAIL === 'true') {
      transporter
        .sendMail({
          from: `"${process.env.FROM_NAME || 'Ronway'}" <${process.env.EMAIL_USER}>`,
          to: safeReplyTo,
          subject: 'Thank you for contacting Ronway',
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #021945;">Thank you for contacting us!</h2>
            <p>Dear ${escapeHtml(sanitizedFirstName)},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Best regards,<br>The Ronway Team</p>
          </div>
        `,
        })
        .catch((err) => {
          if (!isProduction) {
            console.error('Error sending confirmation email:', err);
          }
        });
    }

    return {
      status: 200,
      body: { success: true, message: 'Email sent successfully' },
    };
  } catch (error) {
    console.error('Error sending email:', error?.message || error);
    if (error?.code) console.error('Email error code:', error.code);

    return {
      status: 500,
      body: { success: false, error: 'Failed to send email. Please try again later.' },
    };
  }
}
