'use client';

import { useTranslations, useMessages } from 'next-intl';
import { useState, useCallback } from 'react';

const photoFiles = [
  'diukivskyi-sad (1).jpg',
  'diukivskyi-sad (2).jpg',
  'diukivskyi-sad (3).jpg',
  'diukivskyi-sad (4).jpg',
  'diukivskyi-sad (7).jpg',
  'diukivskyi-sad (8).jpg',
  'diukivskyi-sad (9).jpg',
  'diukivskyi-sad (10).jpg',
  'diukivskyi-sad (11).jpg',
  'diukivskyi-sad (13).jpg',
  'diukivskyi-sad (14).jpg',
  'diukivskyi-sad (16).jpg',
  'diukivskyi-sad (17).jpg',
  'diukivskyi-sad (18).jpg',
  'diukivskyi-sad (19).jpg',
  'diukivskyi-sad (20).jpg',
  'diukivskyi-sad (21).jpg',
  'diukivskyi-sad (23).jpg',
  'diukivskyi-sad (24).jpg',
];

export default function Gallery() {
  const t = useTranslations('gallery');
  const messages = useMessages() as any;
  const captions = t.raw('captions') as string[];
  const altPostfix: string = messages?.galleryAlt?.postfix || '';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showAll, setShowAll] = useState(true);

  const photos = photoFiles.map((file, i) => {
    const base = `/gallery/${file.replace(/\.jpe?g$/i, '')}`;
    const label = captions?.[i] || `Diukivskyi Sad ${i + 1}`;
    return {
      thumb: `${base}.thumb.webp`,
      full: `${base}.webp`,
      alt: altPostfix ? `${label}, ${altPostfix}` : label,
      label,
    };
  });

  const visiblePhotos = photos;

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => setIsLightboxOpen(false);

  return (
    <>
      <section id="gallery" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('title')}
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
          <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {visiblePhotos.map((photo, i) => (
                <div
                  key={i}
                  className={`gallery-item relative group cursor-pointer ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                  onClick={() => openLightbox(i)}
                >
                  <picture>
                    <source srcSet={i === 0 ? photo.full : photo.thumb} type="image/webp" />
                    <img
                      src={
                        i === 0
                          ? photo.full.replace(/\.webp$/, '.jpg')
                          : photo.thumb.replace(/\.thumb\.webp$/, '.jpg')
                      }
                      alt={photo.alt}
                      className="w-full h-full object-cover rounded-lg"
                      style={{ minHeight: i === 0 ? '400px' : '180px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg flex items-end">
                    <p className="text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {photo.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center mt-8 gap-4">
              <a
                href="https://maps.app.goo.gl/drj7Vr1ua1Lsm4UM8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                {t('viewAll')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <picture>
            <source srcSet={photos[currentIndex].full} type="image/webp" />
            <img
              src={`${photos[currentIndex].full.replace(/\.webp$/, '.jpg')}`}
              alt={photos[currentIndex].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
              decoding="async"
            />
          </picture>

          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Next photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
