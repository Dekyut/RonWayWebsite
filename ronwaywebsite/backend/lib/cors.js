const LOCAL_ORIGINS = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'];

function getAllowedOrigins() {
  const origins = new Set(LOCAL_ORIGINS);

  if (process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
      .forEach((origin) => origins.add(origin));
  }

  return origins;
}

function isOriginAllowed(requestOrigin) {
  if (!requestOrigin) return false;
  return getAllowedOrigins().has(requestOrigin);
}

export function applyCors(req, res) {
  const requestOrigin = req.headers.origin;

  if (isOriginAllowed(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

export function handlePreflight(req, res) {
  if (req.method !== 'OPTIONS') return false;

  applyCors(req, res);

  if (!isOriginAllowed(req.headers.origin)) {
    res.status(403).end();
    return true;
  }

  res.status(200).end();
  return true;
}
