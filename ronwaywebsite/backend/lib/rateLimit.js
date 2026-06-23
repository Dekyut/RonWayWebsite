const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const store = new Map();

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export function checkRateLimit(ip) {
  const now = Date.now();
  let record = store.get(ip);

  if (!record || now - record.start > WINDOW_MS) {
    record = { start: now, count: 0 };
    store.set(ip, record);
  }

  record.count += 1;
  return record.count <= MAX_REQUESTS;
}
