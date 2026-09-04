'use client';

import { useTranslations, useMessages, useLocale } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

const LAT = 46.4822407;
const LON = 30.7046189;
const CACHE_KEY = 'diukivskyi_weather_v1';
const CACHE_TTL = 20 * 60 * 1000; // 20 minutes
const REFRESH_MS = 30 * 60 * 1000;

const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto&forecast_days=7`;

interface WeatherData {
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    precipitation: number;
    is_day: number;
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
    sunrise: string[];
    sunset: string[];
  };
}

type Bucket =
  | 'clear'
  | 'mainlyClear'
  | 'partlyCloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'rainShowers'
  | 'snowShowers'
  | 'thunderstorm'
  | 'thunderstormHail';

function codeToBucket(code: number): Bucket {
  if (code === 0) return 'clear';
  if (code === 1) return 'mainlyClear';
  if (code === 2) return 'partlyCloudy';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rainShowers';
  if (code === 85 || code === 86) return 'snowShowers';
  if (code === 95) return 'thunderstorm';
  if (code === 96 || code === 99) return 'thunderstormHail';
  return 'partlyCloudy';
}

const localeForIntl: Record<string, string> = {
  zh: 'zh-CN',
  en: 'en-GB',
  ru: 'ru-RU',
  uk: 'uk-UA',
};

function readCache(): { at: number; data: WeatherData } | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at: number; data: WeatherData };
    if (!parsed || typeof parsed.at !== 'number' || !parsed.data) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data: WeatherData) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // Storage may be unavailable (private mode); caching is optional.
  }
}

async function fetchForecast(signal: AbortSignal): Promise<WeatherData> {
  const res = await fetch(API_URL, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as WeatherData;
}

export default function WeatherSection() {
  const t = useTranslations('weather');
  const locale = useLocale();
  const messages = useMessages() as any;
  const conditions = (messages?.weather?.condition || {}) as Record<string, string>;

  const [data, setData] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  const load = useCallback(async (force: boolean) => {
    if (!force) {
      const cached = readCache();
      if (cached && Date.now() - cached.at < CACHE_TTL) {
        setData(cached.data);
        setUpdatedAt(cached.at);
        setStatus('ready');
        return;
      }
    }
    setStatus('loading');
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 12000);
    try {
      const json = await fetchForecast(controller.signal);
      writeCache(json);
      setData(json);
      setUpdatedAt(Date.now());
      setStatus('ready');
    } catch {
      // Fall back to any cached copy, even if stale.
      const cached = readCache();
      if (cached?.data) {
        setData(cached.data);
        setUpdatedAt(cached.at);
        setStatus('ready');
      } else {
        setStatus('error');
      }
    } finally {
      window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    load(false);
    const id = window.setInterval(() => load(true), REFRESH_MS);
    return () => window.clearInterval(id);
  }, [load]);

  const current = data?.current;
  const daily = data?.daily;
  const todayIndex = 0;

  const formatTime = (iso?: string) => (iso ? iso.slice(11, 16) : '');
  const formatUpdated = (ts: number) => {
    try {
      return new Date(ts).toLocaleTimeString(localeForIntl[locale] || locale, {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };
  const formatDay = (iso: string, index: number) => {
    if (index === todayIndex) return t('today');
    try {
      return new Date(`${iso}T00:00:00`).toLocaleDateString(localeForIntl[locale] || locale, {
        weekday: 'short',
      });
    } catch {
      return iso.slice(5);
    }
  };

  const bucket = current ? codeToBucket(current.weather_code) : 'clear';

  return (
    <section id="weather" className="section-padding">
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

        {status === 'error' && !data ? (
          <div
            className="rounded-xl p-6 text-center"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('unavailable')}
            </p>
            <button
              type="button"
              onClick={() => load(true)}
              className="px-5 py-2 rounded-full text-sm font-medium text-white transition-colors"
              style={{ background: 'var(--accent)' }}
            >
              {t('retry')}
            </button>
          </div>
        ) : (
          <>
            {/* Current conditions */}
            <div
              className="rounded-2xl p-6 sm:p-8 mb-8"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {!current ? (
                  <div className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>
                    {t('loading')}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-5">
                      <WeatherIcon bucket={bucket} size={64} />
                      <div>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                          {t('now')}
                        </p>
                        <p className="text-5xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
                          {Math.round(current.temperature_2m)}°C
                        </p>
                        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {conditions[bucket] || conditions.partlyCloudy}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-8 gap-y-3 flex-1 sm:pl-6 sm:border-l sm:border-[var(--border-color)]">
                      <MetaItem label={t('feelsLike')} value={`${Math.round(current.apparent_temperature)}°C`} />
                      <MetaItem label={t('humidity')} value={`${current.relative_humidity_2m}%`} />
                      <MetaItem label={t('wind')} value={`${Math.round(current.wind_speed_10m)} km/h`} />
                      {daily && (
                        <MetaItem label={t('rainProbability')} value={`${daily.precipitation_probability_max[0] ?? 0}%`} />
                      )}
                    </div>
                  </>
                )}
              </div>

              {daily && daily.sunrise[0] && (
                <div className="mt-6 pt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-[var(--border-color)]">
                  <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                      <path d="M12 2v4" />
                      <path d="M4 20l2-1" />
                      <path d="M18 19l2 1" />
                      <path d="M7 10a5 5 0 0 1 10 0" />
                      <path d="M3 19h18" />
                      <path d="M12 14v4" />
                    </svg>
                    {t('sunrise')} {formatTime(daily.sunrise[0])}
                  </span>
                  <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                      <path d="M12 2v4" />
                      <path d="M4 20l2-1" />
                      <path d="M18 19l2 1" />
                      <path d="M7 10a5 5 0 0 1 10 0" />
                      <path d="M3 18h18" />
                      <path d="M12 14v-4" />
                    </svg>
                    {t('sunset')} {formatTime(daily.sunset[0])}
                  </span>
                  {updatedAt && (
                    <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
                      {t('updatedAt')} {formatUpdated(updatedAt)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 7-day forecast */}
            {daily && (
              <>
                <h3
                  className="font-display text-xl font-semibold mb-6"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {t('forecast')}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {daily.time.map((day, i) => {
                    const b = codeToBucket(daily.weather_code[i] ?? 2);
                    return (
                      <div
                        key={day}
                        className="rounded-xl p-4 flex flex-col items-center text-center gap-1"
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: i === todayIndex ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                        }}
                      >
                        <span
                          className="text-xs font-medium"
                          style={{ color: i === todayIndex ? 'var(--accent)' : 'var(--text-secondary)' }}
                        >
                          {formatDay(day, i)}
                        </span>
                        <WeatherIcon bucket={b} size={34} />
                        <span className="text-xs mt-1 leading-tight h-8" style={{ color: 'var(--text-muted)' }}>
                          {conditions[b] || conditions.partlyCloudy}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {Math.round(daily.temperature_2m_max[i])}°{' '}
                          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                            {Math.round(daily.temperature_2m_min[i])}°
                          </span>
                        </span>
                        {(daily.precipitation_probability_max[i] ?? 0) > 0 && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#3b82f6' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 3v3" />
                              <path d="M12 12v3" />
                              <path d="M12 21v-3" />
                              <path d="M5.6 6.6l1.1 1.1" />
                              <path d="M18.4 6.6l-1.1 1.1" />
                            </svg>
                            {daily.precipitation_probability_max[i] ?? 0}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  );
}

function WeatherIcon({ bucket, size = 32 }: { bucket: Bucket; size?: number }) {
  const w = { width: size, height: size };
  const sunColor = '#f5b301';
  const cloudColor = '#93a4b8';
  const rainColor = '#5b9cf5';
  const snowColor = '#a9c8f5';
  const boltColor = '#f59e0b';

  switch (bucket) {
    case 'clear':
      return (
        <svg viewBox="0 0 24 24" {...w} fill="none">
          <circle cx="12" cy="12" r="4.2" fill={sunColor} />
          <g stroke={sunColor} strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2.6v2.2" />
            <path d="M12 19.2v2.2" />
            <path d="M2.6 12h2.2" />
            <path d="M19.2 12h2.2" />
            <path d="M5.3 5.3l1.6 1.6" />
            <path d="M17.1 17.1l1.6 1.6" />
            <path d="M18.7 5.3l-1.6 1.6" />
            <path d="M6.9 17.1l-1.6 1.6" />
          </g>
        </svg>
      );
    case 'mainlyClear':
      return (
        <svg viewBox="0 0 24 24" {...w} fill="none">
          <circle cx="15" cy="9" r="3.6" fill={sunColor} />
          <g stroke={sunColor} strokeWidth="1.6" strokeLinecap="round">
            <path d="M15 2.8v1.4" />
            <path d="M15 15.2v1.4" />
            <path d="M10.2 6.5l1 1" />
            <path d="M18.8 6.5l-1 1" />
          </g>
          <path
            d="M20 17a3.6 3.6 0 0 0-1.2-7 5 5 0 0 0-9.4 1.6A3.2 3.2 0 0 0 10.3 18H20a3.6 3.6 0 0 0 0-1z"
            fill={cloudColor}
            opacity="0.9"
          />
        </svg>
      );
    case 'partlyCloudy':
      return (
        <svg viewBox="0 0 24 24" {...w} fill="none">
          <circle cx="7" cy="8" r="3.4" fill={sunColor} />
          <g stroke={sunColor} strokeWidth="1.6" strokeLinecap="round">
            <path d="M7 2.6v1.2" />
            <path d="M7 14.2v1.2" />
            <path d="M2.8 5.2l1 1" />
            <path d="M11.2 5.2l-1 1" />
          </g>
          <path
            d="M21 16.5a3.6 3.6 0 0 0-1.2-7 5 5 0 0 0-9.2 1.9A3.2 3.2 0 0 0 11.4 17.6H21a3.4 3.4 0 0 0 0-1.1z"
            fill={cloudColor}
            opacity="0.92"
          />
        </svg>
      );
    case 'overcast':
      return (
        <svg viewBox="0 0 24 24" {...w} fill="none">
          <path d="M7.6 18.4a5.4 5.4 0 0 1 .3-10.8 6.2 6.2 0 0 1 12 .9A3.9 3.9 0 0 1 18.9 18.4z" fill={cloudColor} opacity="0.85" />
          <path d="M4.4 15.2h15.2" stroke={cloudColor} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
        </svg>
      );
    case 'fog':
      return (
        <svg viewBox="0 0 24 24" {...w} fill="none">
          <path d="M8 8.6a4.4 4.4 0 0 1 8.5-.4A3 3 0 0 1 16 14.4H7.5a3.4 3.4 0 0 1 .5-5.8z" fill={cloudColor} opacity="0.85" />
          <path d="M4.5 12h3" stroke={cloudColor} strokeWidth="1.7" strokeLinecap="round" />
          <path d="M16 12h3.5" stroke={cloudColor} strokeWidth="1.7" strokeLinecap="round" />
          <path d="M5 15.5h14" stroke={cloudColor} strokeWidth="1.7" strokeLinecap="round" opacity="0.6" />
          <path d="M6.5 18.2h11" stroke={cloudColor} strokeWidth="1.7" strokeLinecap="round" opacity="0.45" />
        </svg>
      );
    case 'drizzle':
      return (
        <svg viewBox="0 0 24 24" {...w} fill="none">
          <path d="M8 8.4a4.4 4.4 0 0 1 8.5-.3 3.2 3.2 0 0 1-.4 6.3H7.6a3.3 3.3 0 0 1 .4-6z" fill={cloudColor} opacity="0.88" />
          <g stroke={rainColor} strokeWidth="1.5" strokeLinecap="round">
            <path d="M9.5 16.5l-1 2.6" />
            <path d="M14.5 16.5l-1 2.6" />
            <path d="M12 17.4l-1 2.6" />
          </g>
        </svg>
      );
    case 'rain':
    case 'rainShowers':
      return (
        <svg viewBox="0 0 24 24" {...w} fill="none">
          <path d="M8 8.2a4.4 4.4 0 0 1 8.6-.3 3.3 3.3 0 0 1-.3 6.5H7.5a3.4 3.4 0 0 1 .5-6.2z" fill={cloudColor} opacity="0.88" />
          {bucket === 'rainShowers' && <circle cx="5" cy="7" r="2.6" fill={sunColor} opacity="0.9" />}
          <g stroke={rainColor} strokeWidth="1.6" strokeLinecap="round">
            <path d="M9.2 16l-1.4 3.4" />
            <path d="M14.2 16l-1.4 3.4" />
            <path d="M11.7 16l-1.4 3.4" />
          </g>
        </svg>
      );
    case 'snow':
    case 'snowShowers':
      return (
        <svg viewBox="0 0 24 24" {...w} fill="none">
          <path d="M8 8.2a4.4 4.4 0 0 1 8.6-.3 3.3 3.3 0 0 1-.3 6.5H7.5a3.4 3.4 0 0 1 .5-6.2z" fill={cloudColor} opacity="0.88" />
          {bucket === 'snowShowers' && <circle cx="5" cy="7" r="2.6" fill={sunColor} opacity="0.9" />}
          <g stroke={snowColor} strokeWidth="1.5" strokeLinecap="round">
            <path d="M9.5 15.6l-.9 2.4" />
            <path d="M14.5 15.6l-.9 2.4" />
            <path d="M12 15.6l-.9 2.4" />
          </g>
        </svg>
      );
    case 'thunderstorm':
    case 'thunderstormHail':
      return (
        <svg viewBox="0 0 24 24" {...w} fill="none">
          <path d="M8 8.4a4.4 4.4 0 0 1 8.6-.3 3.3 3.3 0 0 1-.3 6.5H7.5a3.4 3.4 0 0 1 .5-6.2z" fill={cloudColor} opacity="0.88" />
          <path d="M12.6 12.6l-2.6 3.6h2.4l-1.3 3.4 3-4.2h-2.3l1.4-2.8z" fill={boltColor} />
          {bucket === 'thunderstormHail' && (
            <g fill={snowColor}>
              <circle cx="5.6" cy="18.6" r="1.1" />
              <circle cx="18.2" cy="17.8" r="1.1" />
              <circle cx="7" cy="21.6" r="1" />
            </g>
          )}
        </svg>
      );
    default:
      return null;
  }
}
