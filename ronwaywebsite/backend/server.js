import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { processContactForm } from './lib/contactService.js';
import { validateEnv } from './lib/env.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

const envError = validateEnv();
if (envError) {
  console.error(`❌ ${envError}`);
  console.error('Please check your .env file.');
  process.exit(1);
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", 'https://js.hcaptcha.com', 'https://*.hcaptcha.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        frameSrc: ["'self'", 'https://js.hcaptcha.com', 'https://*.hcaptcha.com'],
        connectSrc: ["'self'", 'https://hcaptcha.com', 'https://*.hcaptcha.com'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/contact', limiter);

app.post('/api/contact', async (req, res) => {
  const result = await processContactForm(req.body);
  res.status(result.status).json(result.body);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    environment: isProduction ? 'production' : 'development',
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📦 Environment: ${NODE_ENV}`);
  if (!isProduction) {
    console.log('⚠️  Running in development mode - detailed errors enabled');
  }
});
