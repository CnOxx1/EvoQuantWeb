import DOMPurify from 'dompurify';

export function sanitize(dirty) {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span', 'code', 'pre', 'blockquote'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel', 'style'],
  });
}
