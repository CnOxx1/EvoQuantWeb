import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { submitContact } from '../api/endpoints';

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitContact({ ...form, lang: i18n.language });
      setStatus('success');
      setForm({ name: '', email: '', company: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-center border-b border-[var(--border-color)]">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        {status === 'success' ? (
          <div className="text-center py-12">
            <p className="text-lg text-[var(--text-primary)]">{t('contact.form.success')}</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-6 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-4"
            >
              {i18n.language === 'zh' ? '发送另一条消息' : 'Send another message'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-2 tracking-wide uppercase">{t('contact.form.name')}</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[var(--text-muted)] outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-2 tracking-wide uppercase">{t('contact.form.email')}</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[var(--text-muted)] outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-2 tracking-wide uppercase">{t('contact.form.company')}</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[var(--text-muted)] outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-2 tracking-wide uppercase">{t('contact.form.message')}</label>
              <textarea
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[var(--text-muted)] outline-none transition-colors text-sm resize-none"
              />
            </div>
            {status === 'error' && (
              <p className="text-red-400 text-sm">{t('contact.form.error')}</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 text-sm tracking-widest uppercase disabled:opacity-50"
            >
              {status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
