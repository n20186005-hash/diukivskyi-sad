import { useTranslations, useMessages } from 'next-intl';

type TodoCard = { name: string; text: string };

export default function ThingsToDoSection() {
  const t = useTranslations('thingsToDo');
  const messages = useMessages() as any;
  const cards: TodoCard[] = messages?.thingsToDo?.cards || [];

  return (
    <section id="things-to-do" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <div
              key={i}
              className="rounded-xl p-6 transition-colors"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid rgba(127,127,127,0.15)' }}
            >
              <h3 className="font-display text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                {card.name}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
