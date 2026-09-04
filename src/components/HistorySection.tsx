import { useTranslations, useMessages } from 'next-intl';

export default function HistorySection() {
  const t = useTranslations('history');
  const messages = useMessages() as any;
  const paragraphs: string[] = messages?.history?.paragraphs || [];

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <div className="space-y-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {p}
            </p>
          ))}
        </div>

        {/* Local legend callout */}
        <div
          className="mt-10 rounded-xl p-6 sm:p-8"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent)' }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
            {t('legendTitle')}
          </p>
          <p className="text-base leading-relaxed italic" style={{ color: 'var(--text-primary)' }}>
            {t('legendBody')}
          </p>
          <p className="mt-4 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {t('legendNote')}
          </p>
        </div>
      </div>
    </section>
  );
}
