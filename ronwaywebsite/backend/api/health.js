import { applyCors, handlePreflight } from '../lib/cors.js';

export default async function handler(req, res) {
  applyCors(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isProduction = process.env.NODE_ENV === 'production';

  return res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    environment: isProduction ? 'production' : 'development',
  });
}
