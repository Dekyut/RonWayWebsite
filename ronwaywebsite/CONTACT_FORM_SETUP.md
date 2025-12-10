# Contact Form Setup Guide

This guide explains how to set up the functional contact form with email capabilities.

## Overview

The contact form has been updated to send emails through a secure backend API. Here's how it works:

1. **Frontend (React)**: Collects form data and sends it to the backend API
2. **Backend (Node.js/Express)**: Receives the data, validates it, and sends emails securely
3. **Email Service**: Uses Nodemailer to send emails via Gmail or custom SMTP

## Architecture

### Do You Need a Separate Backend?

**Yes, you need a separate backend project** for security reasons:

- ✅ **Secure**: API keys and email credentials stay on the server (never exposed to users)
- ✅ **Protected**: Rate limiting prevents spam/abuse
- ✅ **Reliable**: Server-side validation and error handling
- ✅ **Professional**: Industry-standard approach

**Alternative (Not Recommended)**: You could use EmailJS (client-side), but it exposes API keys in your frontend code, which is less secure.

## Setup Instructions

### Step 1: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   # Copy the example file
   cp env.example.txt .env
   ```

4. Configure `.env` file (see Step 2 below)

5. Start the backend server:
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

The backend will run on `http://localhost:3001` by default.

### Step 2: Email Configuration

#### Option A: Gmail (Easiest)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. Update `backend/.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   RECEIVING_EMAIL=ronwaycars.travel@gmail.com
   ```

#### Option B: Custom SMTP (Any Email Provider)

Update `backend/.env`:
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
RECEIVING_EMAIL=ronwaycars.travel@gmail.com
```

### Step 3: Frontend Configuration

1. Create `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your backend URL:
   ```env
   # For local development
   VITE_API_URL=http://localhost:3001

   # For production (after deploying backend)
   VITE_API_URL=https://your-backend-domain.com
   ```

3. Restart your frontend dev server if it's running

### Step 4: Test the Form

1. Make sure both servers are running:
   - Backend: `http://localhost:3001`
   - Frontend: `http://localhost:5173` (or your Vite port)

2. Fill out the contact form on your website
3. Submit and check:
   - Success message appears on the form
   - Email arrives at `RECEIVING_EMAIL`

## Deployment

### Backend Deployment Options

#### Option 1: Vercel (Serverless - Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. In the `backend` directory:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard

4. Update frontend `.env` with Vercel URL:
   ```env
   VITE_API_URL=https://your-project.vercel.app
   ```

#### Option 2: Traditional Hosting (VPS/Cloud)

1. Upload backend files to your server
2. Install dependencies:
   ```bash
   npm install --production
   ```

3. Use PM2 to keep server running:
   ```bash
   npm install -g pm2
   pm2 start server.js --name ronway-api
   pm2 save
   pm2 startup
   ```

4. Set up reverse proxy (Nginx) if needed

#### Option 3: Railway/Render/Fly.io

These platforms make deployment easy:
- Connect your GitHub repo
- Set environment variables
- Deploy automatically

### Frontend Deployment

Deploy your frontend as usual (Vercel, Netlify, etc.). Make sure to:
- Set `VITE_API_URL` environment variable in your hosting platform
- Rebuild after setting environment variables

## Security Features

✅ **Rate Limiting**: 5 requests per 15 minutes per IP address  
✅ **Input Sanitization**: Prevents XSS attacks  
✅ **CORS Protection**: Only allows requests from your frontend  
✅ **Environment Variables**: Sensitive data never exposed  
✅ **Validation**: Server-side validation of all inputs  

## Troubleshooting

### "Network error" or CORS issues

- Check that backend is running
- Verify `VITE_API_URL` matches your backend URL
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check browser console for specific errors

### Email not sending

- Verify email credentials in `backend/.env`
- For Gmail: Make sure you're using an App Password, not regular password
- Check backend server logs for error messages
- Test SMTP settings with a simple email client first

### Form shows success but no email received

- Check spam folder
- Verify `RECEIVING_EMAIL` in backend `.env`
- Check backend server logs
- Test email credentials manually

## File Structure

```
ronwaywebsite/
├── backend/                 # Backend API server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── .env                # Backend environment variables (create this)
│   └── README.md           # Backend documentation
├── src/
│   └── pages/
│       ├── Contact.jsx     # Dark theme contact form
│       └── light/
│           └── ContactLight.jsx  # Light theme contact form
└── .env                    # Frontend environment variables (create this)
```

## Support

If you encounter issues:
1. Check backend server logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Test backend API directly with Postman/curl

## Next Steps

1. ✅ Set up backend server
2. ✅ Configure email credentials
3. ✅ Test locally
4. ✅ Deploy backend
5. ✅ Deploy frontend with updated API URL
6. ✅ Test in production

