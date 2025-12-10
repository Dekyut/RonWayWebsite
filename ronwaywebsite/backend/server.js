import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import isEmail from 'isemail';

// Load environment variables
dotenv.config();

// Initialize DOMPurify for server-side HTML sanitization
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Validate required environment variables on startup
const requiredEnvVars = ['EMAIL_USER'];
if (process.env.EMAIL_SERVICE === 'gmail') {
  requiredEnvVars.push('EMAIL_APP_PASSWORD');
} else {
  requiredEnvVars.push('SMTP_HOST', 'EMAIL_PASSWORD');
}

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file.');
  process.exit(1);
}

// Security: Helmet.js for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for email templates
      scriptSrc: ["'self'", "https://js.hcaptcha.com", "https://*.hcaptcha.com"],
      imgSrc: ["'self'", "data:", "https:"],
      frameSrc: ["'self'", "https://js.hcaptcha.com", "https://*.hcaptcha.com"],
      connectSrc: ["'self'", "https://hcaptcha.com", "https://*.hcaptcha.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for iframes (maps, etc.)
}));

// Security: CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Security: Request size limits to prevent DoS attacks
app.use(express.json({ limit: '10kb' })); // Limit JSON payload to 10KB
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security: Rate limiting to prevent spam/abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

app.use('/api/contact', limiter);

// Input validation constants
const MAX_FIELD_LENGTH = {
  firstName: 50,
  lastName: 50,
  email: 100,
  phoneNumber: 20,
  message: 2000,
  countryCode: 10
};

// Security: Enhanced sanitization function using DOMPurify
const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  // First, use DOMPurify to remove any HTML/script tags
  const sanitized = DOMPurify.sanitize(str, { 
    ALLOWED_TAGS: [], // Remove all HTML tags
    ALLOWED_ATTR: []  // Remove all attributes
  });
  // Additional sanitization: remove newlines and carriage returns to prevent header injection
  return sanitized.replace(/[\r\n]/g, '').trim();
};

// Security: Sanitize email address to prevent header injection
const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  // Remove any newlines, carriage returns, and other dangerous characters
  return email.replace(/[\r\n<>"']/g, '').trim();
};

// Security: Sanitize name for email headers (prevent header injection)
const sanitizeName = (name) => {
  if (typeof name !== 'string') return '';
  // Remove newlines, carriage returns, quotes, and angle brackets
  return name.replace(/[\r\n<>"]/g, '').trim();
};

// Security: Validate and sanitize input length
const validateLength = (field, value, maxLength) => {
  if (typeof value !== 'string') return false;
  return value.length <= maxLength;
};

// Email configuration
const createTransporter = () => {
  // Option 1: Gmail SMTP (requires app password)
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
      },
    });
  }
  
  // Option 2: Custom SMTP (works with any email provider)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, message, countryCode, captchaToken } = req.body;

    // Security: Verify hCaptcha token
    if (!captchaToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'Captcha verification is required' 
      });
    }

    // Verify captcha with hCaptcha API
    const HCAPTCHA_SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY;
    if (HCAPTCHA_SECRET_KEY) {
      try {
        const captchaVerifyResponse = await fetch('https://hcaptcha.com/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            secret: HCAPTCHA_SECRET_KEY,
            response: captchaToken
          })
        });

        const captchaData = await captchaVerifyResponse.json();
        
        if (!captchaData.success) {
          return res.status(400).json({ 
            success: false, 
            error: 'Captcha verification failed. Please try again.' 
          });
        }
      } catch (captchaError) {
        console.error('Error verifying captcha:', captchaError);
        // In production, you might want to fail here, but for development we'll allow it
        if (process.env.NODE_ENV === 'production') {
          return res.status(500).json({ 
            success: false, 
            error: 'Captcha verification service error. Please try again later.' 
          });
        }
      }
    }

    // Security: Input validation - check required fields
    if (!firstName || !lastName || !email || !phoneNumber || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Security: Input length validation
    if (!validateLength('firstName', firstName, MAX_FIELD_LENGTH.firstName)) {
      return res.status(400).json({ 
        success: false, 
        error: `First name must be ${MAX_FIELD_LENGTH.firstName} characters or less` 
      });
    }
    if (!validateLength('lastName', lastName, MAX_FIELD_LENGTH.lastName)) {
      return res.status(400).json({ 
        success: false, 
        error: `Last name must be ${MAX_FIELD_LENGTH.lastName} characters or less` 
      });
    }
    if (!validateLength('email', email, MAX_FIELD_LENGTH.email)) {
      return res.status(400).json({ 
        success: false, 
        error: `Email must be ${MAX_FIELD_LENGTH.email} characters or less` 
      });
    }
    if (!validateLength('phoneNumber', phoneNumber, MAX_FIELD_LENGTH.phoneNumber)) {
      return res.status(400).json({ 
        success: false, 
        error: `Phone number must be ${MAX_FIELD_LENGTH.phoneNumber} characters or less` 
      });
    }
    if (!validateLength('message', message, MAX_FIELD_LENGTH.message)) {
      return res.status(400).json({ 
        success: false, 
        error: `Message must be ${MAX_FIELD_LENGTH.message} characters or less` 
      });
    }

    // Security: Enhanced email validation using isemail library
    const sanitizedEmail = sanitizeEmail(email);
    if (!isEmail.validate(sanitizedEmail)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address' 
      });
    }

    // Security: Sanitize all inputs
    const sanitizedFirstName = sanitizeName(firstName);
    const sanitizedLastName = sanitizeName(lastName);
    const sanitizedMessage = sanitize(message);
    const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    const sanitizedCountryCode = (countryCode || '+63').replace(/[^+\d]/g, ''); // Only allow + and digits

    // Format phone number with spaces (e.g., +63 912 345 6789)
    const formatPhoneNumber = (phone, countryCode) => {
      const code = countryCode || '+63';
      // Remove any existing spaces and format
      const cleaned = phone.replace(/\s/g, '');
      // For Philippines numbers starting with 0, format as +63 XXX XXX XXXX
      if (code === '+63' && cleaned.startsWith('0')) {
        const number = cleaned.substring(1); // Remove leading 0
        if (number.length === 10) {
          return `${code} ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
        }
      }
      // For other formats, just add spaces every 3 digits
      if (cleaned.length > 0) {
        return `${code} ${cleaned.match(/.{1,3}/g)?.join(' ') || cleaned}`;
      }
      return `${code} ${phone}`;
    };

    // Get current date and time
    const now = new Date();
    const dateTime = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).replace(/,/g, '');

    const formattedPhone = formatPhoneNumber(sanitizedPhoneNumber, sanitizedCountryCode);
    // Security: Use sanitized names for email headers to prevent injection
    const fullName = `${sanitizedFirstName} ${sanitizedLastName}`;

    const transporter = createTransporter();

    // Security: Sanitize email address before using in replyTo
    const safeReplyTo = sanitizeEmail(sanitizedEmail);

    // Email to business
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

    // Security: Sanitize email subject to prevent header injection
    const safeSubject = `New Contact Form Submission from ${fullName}`.substring(0, 200); // Limit subject length

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Ronway Contact Form'}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVING_EMAIL || 'ronwaycars.travel@gmail.com',
      replyTo: safeReplyTo, // Use sanitized email
      subject: safeSubject, // Use sanitized subject
      text: emailBody,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          <p>You received a new inquiry from the website contact form.</p>
          
          <p><strong>Client Information</strong><br>
          ${'─'.repeat(24)}<br>
          Name: ${DOMPurify.sanitize(fullName)}<br>
          Email: ${DOMPurify.sanitize(safeReplyTo)}<br>
          Phone: ${DOMPurify.sanitize(formattedPhone)}</p>
          
          <p><strong>Message</strong><br>
          ${'─'.repeat(24)}<br>
          ${DOMPurify.sanitize(sanitizedMessage).replace(/\n/g, '<br>')}</p>
          
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            Submitted At: ${DOMPurify.sanitize(dateTime)}
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Optional: Send confirmation email to user
    if (process.env.SEND_CONFIRMATION_EMAIL === 'true') {
      const confirmationMail = {
        from: `"${process.env.FROM_NAME || 'Ronway'}" <${process.env.EMAIL_USER}>`,
        to: safeReplyTo, // Use sanitized email
        subject: 'Thank you for contacting Ronway',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #021945;">Thank you for contacting us!</h2>
            <p>Dear ${DOMPurify.sanitize(sanitizedFirstName)},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Best regards,<br>The Ronway Team</p>
          </div>
        `,
      };
      
      // Don't wait for confirmation email, send it in background
      // Security: Improved error handling - don't expose errors to client
      transporter.sendMail(confirmationMail).catch((err) => {
        // Log error server-side only, don't expose to client
        if (!isProduction) {
          console.error('Error sending confirmation email:', err);
        }
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully' 
    });

  } catch (error) {
    // Security: Improved error handling - don't leak sensitive information
    // Log full error details server-side only
    if (!isProduction) {
      console.error('Error sending email:', error);
    } else {
      // In production, log error without sensitive details
      console.error('Error sending email:', error.message);
    }
    
    // Return generic error message to client
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    environment: isProduction ? 'production' : 'development'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📦 Environment: ${NODE_ENV}`);
  if (!isProduction) {
    console.log('⚠️  Running in development mode - detailed errors enabled');
  }
});
