import { applyCors, handlePreflight } from '../lib/cors.js';
import { processContactForm } from '../lib/contactService.js';
import { validateEnv } from '../lib/env.js';
import { checkRateLimit, getClientIp } from '../lib/rateLimit.js';

export default async function handler(req, res) {
  applyCors(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const envError = validateEnv();
  if (envError) {
    console.error(envError);
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  if (!checkRateLimit(getClientIp(req))) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
    });
  }

  const result = await processContactForm(req.body);
  return res.status(result.status).json(result.body);
}
