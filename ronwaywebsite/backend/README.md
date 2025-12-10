# Ronway Backend API

This is the backend server for handling contact form submissions from the Ronway website.

## Features

- ✅ Secure email sending via Nodemailer
- ✅ Rate limiting to prevent spam/abuse
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Error handling

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your email credentials:

```bash
cp .env.example .env
```

### 3. Configure hCaptcha (Required for Form Submission)

1. Sign up for a free hCaptcha account at https://www.hcaptcha.com/
2. Create a new site and get your Site Key and Secret Key
3. Add the keys to your `.env` file:

```env
HCAPTCHA_SECRET_KEY=your-secret-key-here
```

4. In your frontend `.env` file (or `vite.config.js`), add:

```env
VITE_HCAPTCHA_SITE_KEY=your-site-key-here
```

**Note:** For development/testing, you can use the test keys:
- Site Key: `10000000-ffff-ffff-ffff-000000000001`
- Secret Key: `0x0000000000000000000000000000000000000000`

### 4. Email Configuration Options

#### Option A: Gmail (Recommended for Quick Setup)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Create a new app password for "Mail"
   - Copy the 16-character password

3. Update `.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-char-app-password
```

#### Option B: Custom SMTP (Any Email Provider)

Update `.env` with your SMTP settings:
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
```

### 5. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### POST `/api/contact`

Submit contact form data.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "09123456789",
  "message": "Hello, I need a ride...",
  "countryCode": "+63",
  "captchaToken": "hcaptcha-token-here"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Error message"
}
```

### GET `/api/health`

Health check endpoint.

## Security Features

1. **hCaptcha Verification**: Prevents bot submissions
2. **Rate Limiting**: 5 requests per 15 minutes per IP
3. **Input Sanitization**: Prevents XSS attacks
4. **CORS**: Only allows requests from configured frontend URL
5. **Environment Variables**: Sensitive data stored securely

## Deployment

### Deploy to Vercel/Netlify (Serverless)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the backend directory
3. Add environment variables in Vercel dashboard

### Deploy to Traditional Hosting

1. Upload files to your server
2. Run `npm install --production`
3. Set up environment variables
4. Use PM2 or similar to keep server running:
   ```bash
   npm install -g pm2
   pm2 start server.js --name ronway-api
   ```

## Troubleshooting

### Email Not Sending

1. Check that environment variables are set correctly
2. For Gmail: Ensure you're using an App Password, not your regular password
3. Check server logs for error messages
4. Verify SMTP settings if using custom SMTP

### CORS Errors

Update `FRONTEND_URL` in `.env` to match your frontend URL.

