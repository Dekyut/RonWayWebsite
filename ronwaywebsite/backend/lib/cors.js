const LOCAL_ORIGINS = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'];

function normalizeOrigin(origin) {
  return origin.trim().replace(/\/+$/, '');
}

function getAllowedOrigins() {
  const origins = new Set(LOCAL_ORIGINS);

  if (process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL.split(',')
      .map(normalizeOrigin)
      .filter(Boolean)
      .forEach((origin) => origins.add(origin));
  }

  return origins;
}

function isVercelPreviewOfAllowedOrigin(requestOrigin, allowedOrigins) {
  let hostname;
  try {
    hostname = new URL(requestOrigin).hostname;
  } catch {
    return false;
  }

  if (!hostname.endsWith('.vercel.app')) return false;

  for (const allowed of allowedOrigins) {
    let allowedHost;
    try {
      allowedHost = new URL(allowed).hostname;
    } catch {
      continue;
    }

    // Allow https://my-app-*.vercel.app when FRONTEND_URL is https://my-app.vercel.app
    if (
      allowedHost.endsWith('.vercel.app') &&
      !allowedHost.includes('---') &&
      hostname.startsWith(`${allowedHost.replace(/\.vercel\.app$/, '')}-`) &&
      hostname.endsWith('.vercel.app')
    ) {
      return true;
    }
  }

  return false;
}

function isOriginAllowed(requestOrigin) {
  if (!requestOrigin) return false;
  const origin = normalizeOrigin(requestOrigin);
  const allowedOrigins = getAllowedOrigins();
  return allowedOrigins.has(origin) || isVercelPreviewOfAllowedOrigin(origin, allowedOrigins);
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
