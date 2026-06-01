import { useTranslation } from 'react-i18next';
import { sanitize } from '../../utils/sanitize';

export default function ContentBlock({ contentZh, contentEn, className = '' }) {
  const { i18n } = useTranslation();
  const html = i18n.language === 'zh' ? (contentZh || '') : (contentEn || contentZh || '');
  return (
    <div
      className={`content-block max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitize(html) }}
    />
  );
}
