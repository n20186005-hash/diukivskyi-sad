import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata, Viewport } from 'next';
import PwaRegister from '@/components/PwaRegister';

export const viewport: Viewport = {
  themeColor: '#234830',
};

const baseUrl = 'https://diukivskyisad.com';
const ogImageUrl = `${baseUrl}/gallery/diukivskyi-sad%20(2).jpg`;

// Park / TouristAttraction structured data (Schema.org / JSON-LD)
// Binds the domain entity to the real-world geographic landmark for Google.
// alternateName covers the native spellings users search in RU and UK.
const touristAttractionSchema = (description: string) => ({
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'Park'],
  '@id': `${baseUrl}/#attraction`,
  name: 'Diukivskyi Sad (Дюківський Сад)',
  alternateName: [
    'Дюківський Сад',
    'Дюківський сад',
    'Дюківський парк',
    'Дюковський сад',
    'Дюковський парк',
    'Дюковский парк',
    'Дюковский сад',
    'Парк Дюка',
    "Duke's Garden",
    'Duke Garden',
    'Dyukovsky Park',
    'Dyukivsky Park',
  ],
  description: description || 'Visitor guide to Diukivskyi Sad in Odesa, Odesa Oblast, Ukraine.',
  url: `${baseUrl}/`,
  image: [
    ogImageUrl,
    `${baseUrl}/gallery/diukivskyi-sad%20(3).jpg`,
    `${baseUrl}/gallery/diukivskyi-sad%20(1).jpg`,
  ],
  isAccessibleForFree: true,
  publicAccess: true,
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Rozkydailivs'ka St, 56",
    addressLocality: 'Odesa',
    addressRegion: 'Odesa Oblast',
    postalCode: '65000',
    addressCountry: 'UA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 46.4822407,
    longitude: 30.7046189,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Free entry', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Pets allowed', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Children playground', value: true },
  ],
  hasMap: 'https://maps.app.goo.gl/drj7Vr1ua1Lsm4UM8',
  sameAs: [
    'https://maps.app.goo.gl/drj7Vr1ua1Lsm4UM8',
    'https://www.tourism.gov.ua/',
    'https://omr.gov.ua/',
    'https://oda.od.gov.ua/',
  ],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  const zhUrl = `${baseUrl}/zh`;
  const enUrl = `${baseUrl}/en`;
  const ruUrl = `${baseUrl}/ru`;
  const ukUrl = `${baseUrl}/uk`;

  let selfUrl = zhUrl;
  if (locale === 'en') selfUrl = enUrl;
  else if (locale === 'ru') selfUrl = ruUrl;
  else if (locale === 'uk') selfUrl = ukUrl;

  const localeMap: Record<string, string> = {
    'zh': 'zh_CN',
    'en': 'en_US',
    'ru': 'ru_RU',
    'uk': 'uk_UA',
  };

  return {
    metadataBase: new URL(baseUrl),
    title: messages.meta.title,
    description: messages.meta.description,
    alternates: {
      canonical: selfUrl,
      languages: {
        'zh': zhUrl,
        'en': enUrl,
        'ru': ruUrl,
        'uk': ukUrl,
        'x-default': ruUrl,
      } as Record<string, string>,
    },
    icons: {
      icon: '/icons/icon-192.png',
      shortcut: '/icons/favicon-32.png',
      apple: '/icons/apple-touch-icon-180.png',
    },
    manifest: '/manifest.webmanifest',
    appleWebApp: {
      capable: true,
      title: 'Diukivskyi Sad',
      statusBarStyle: 'default',
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      url: selfUrl,
      siteName: 'Diukivskyi Sad',
      locale: localeMap[locale] || 'zh_CN',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          alt: 'Diukivskyi Sad - Odesa, Ukraine',
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const schema = touristAttractionSchema(((messages as any)?.meta?.description as string) ?? '');

  const langMap: Record<string, string> = {
    'zh': 'zh-CN',
    'en': 'en',
    'ru': 'ru',
    'uk': 'uk',
  };

  return (
    <html lang={langMap[locale] || 'zh-CN'} suppressHydrationWarning>
      <head>
        {/* Preload the hero image (WebP) for faster LCP */}
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/gallery/diukivskyi-sad%20(2).webp"
        />
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HXM22WWPKP" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HXM22WWPKP');
            `,
          }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossOrigin="anonymous" />
        <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXX" />
        {/* PWA meta */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Diukivskyi Sad" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Structured data: Park / TouristAttraction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
