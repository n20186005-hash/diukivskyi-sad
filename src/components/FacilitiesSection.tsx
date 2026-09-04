import { useTranslations, useMessages } from 'next-intl';
import type { ReactNode } from 'react';

const facilityIcons: ReactNode[] = [
  // Public toilets
  <svg key="wc" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="6" width="4" height="15" rx="1" />
    <rect x="17" y="6" width="4" height="15" rx="1" />
    <rect x="9" y="9" width="6" height="3" />
  </svg>,
  // Parking
  <svg key="parking" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
  </svg>,
  // Food & drink
  <svg key="food" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2v6a2 2 0 0 0 4 0V2" />
    <path d="M8 16v6" />
    <path d="M4 2v4a4 4 0 0 0 8 0V2" />
    <path d="M15 2h3v20h-3" />
  </svg>,
  // Shops
  <svg key="shops" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l1.5-5h15L21 9" />
    <path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
    <path d="M9 21v-6h6v6" />
  </svg>,
  // Accommodation
  <svg key="bed" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 18v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" />
    <path d="M3 14h18" />
    <path d="M6 10V7h6v3" />
  </svg>,
  // Fuel & EV charging
  <svg key="fuel" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 4H6a2 2 0 0 0-2 2v14h12V6a2 2 0 0 0-2-2z" />
    <path d="M8 9h6" />
    <path d="M18 8l2-1v6l-2 1" />
    <path d="M14 20h-3" />
  </svg>,
  // Families & accessibility
  <svg key="family" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <circle cx="18" cy="8" r="2.2" />
    <path d="M16.8 14.5a4 4 0 0 1 4.2 2.7" />
    <path d="M3.5 13.2a2 2 0 1 0 1.2 3.7" />
  </svg>,
];

export default function FacilitiesSection() {
  const t = useTranslations('facilities');
  const messages = useMessages() as any;
  const items = (messages?.facilities?.items || []) as Array<{ name: string; text: string }>;

  return (
    <section id="facilities" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('subtitle')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-6 flex flex-col"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                {facilityIcons[i % facilityIcons.length]}
              </div>
              <h3
                className="font-display text-lg font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.name}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Neutrality note */}
        <div
          className="mt-10 rounded-xl p-5 sm:p-6 flex items-start gap-4"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent)' }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            className="flex-shrink-0 mt-0.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('neutrality')}
          </p>
        </div>
      </div>
    </section>
  );
}
