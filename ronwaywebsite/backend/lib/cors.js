export function applyCors(req, res) {
  const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
  const requestOrigin = req.headers.origin;

  if (requestOrigin && (requestOrigin === allowedOrigin || process.env.NODE_ENV !== 'production')) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    applyCors(req, res);
    res.status(200).end();
    return true;
  }
  return false;
}
