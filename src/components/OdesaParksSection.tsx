import { useTranslations, useMessages } from 'next-intl';

type ParkItem = { name: string; text: string };

export default function OdesaParksSection() {
  const t = useTranslations('odesaParks');
  const messages = useMessages() as any;
  const items: ParkItem[] = messages?.odesaParks?.items || [];

  return (
    <section id="parks-of-odesa" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="space-y-5">
          {items.map((park, i) => (
            <div
              key={i}
              className="rounded-xl p-6 sm:p-8"
              style={{
                background: 'var(--bg-tertiary)',
                border: i === 0 ? '1px solid var(--accent)' : '1px solid rgba(127,127,127,0.15)',
              }}
            >
              <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                {park.name}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {park.text}
              </p>
            </div>
          ))}
        </div>

        <p
          className="mt-10 p-6 rounded-xl text-base leading-relaxed"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
        >
          {t('note')}
        </p>
      </div>
    </section>
  );
}
