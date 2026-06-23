import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const MAX_FIELD_LENGTH = {
  firstName: 50,
  lastName: 50,
  email: 100,
  phoneNumber: 20,
  message: 2000,
  countryCode: 10,
};

export const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  const sanitized = DOMPurify.sanitize(str, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  return sanitized.replace(/[\r\n]/g, '').trim();
};

export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  return email.replace(/[\r\n<>"']/g, '').trim();
};

export const sanitizeName = (name) => {
  if (typeof name !== 'string') return '';
  return name.replace(/[\r\n<>"]/g, '').trim();
};

export const validateLength = (value, maxLength) => {
  if (typeof value !== 'string') return false;
  return value.length <= maxLength;
};

export { DOMPurify };
