import { useTranslations, useMessages } from 'next-intl';

export default function SourcesSection() {
  const t = useTranslations('sources');
  const messages = useMessages() as any;
  const items = (messages?.sources?.items || []) as Array<{
    label: string;
    note: string;
    url: string;
  }>;

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

        <p
          className="text-sm leading-relaxed mb-8 max-w-3xl"
          style={{ color: 'var(--text-muted)' }}
        >
          {t('intro')}
        </p>

        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-4 rounded-xl px-5 py-4 transition-colors hover:opacity-90"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
              >
                <span>
                  <span className="block font-medium text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </span>
                  {item.note && (
                    <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>
                      {item.note}
                    </span>
                  )}
                </span>
                <span
                  className="flex-shrink-0 mt-1 rounded-full p-1.5"
                  style={{ background: 'var(--accent)', color: 'white' }}
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
