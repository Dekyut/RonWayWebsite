export function getRequiredEnvVars() {
  const required = ['EMAIL_USER'];
  if (process.env.EMAIL_SERVICE === 'gmail') {
    required.push('EMAIL_APP_PASSWORD');
  } else {
    required.push('SMTP_HOST', 'EMAIL_PASSWORD');
  }
  return required;
}

export function validateEnv() {
  const missing = getRequiredEnvVars().filter((name) => !process.env[name]);
  if (missing.length === 0) return null;
  return `Missing required environment variables: ${missing.join(', ')}`;
}
