import { useTranslations, useMessages } from 'next-intl';

export default function NatureSection() {
  const t = useTranslations('nature');
  const messages = useMessages() as any;
  const paragraphs: string[] = messages?.nature?.paragraphs || [];

  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p className="text-lg leading-relaxed mb-8 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </p>

        <div className="space-y-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
