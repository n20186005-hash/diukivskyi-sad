import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import HistorySection from '@/components/HistorySection';
import NatureSection from '@/components/NatureSection';
import OdesaParksSection from '@/components/OdesaParksSection';
import LandmarksSection from '@/components/LandmarksSection';
import BasicInfo from '@/components/BasicInfo';
import HoursSection from '@/components/HoursSection';
import WeatherSection from '@/components/WeatherSection';
import TicketsSection from '@/components/TicketsSection';
import TransportSection from '@/components/TransportSection';
import FacilitiesSection from '@/components/FacilitiesSection';
import ThingsToDoSection from '@/components/ThingsToDoSection';
import RouteSection from '@/components/RouteSection';
import PhotoSpotsSection from '@/components/PhotoSpotsSection';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import FaqSection from '@/components/FaqSection';
import SourcesSection from '@/components/SourcesSection';
import MapEmbed from '@/components/MapEmbed';
import Footer from '@/components/Footer';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <HistorySection />
        <NatureSection />
        <OdesaParksSection />
        <LandmarksSection />
        <ThingsToDoSection />
        <BasicInfo />
        <HoursSection />
        <WeatherSection />
        <TicketsSection />
        <TransportSection />
        <FacilitiesSection />
        <RouteSection />
        <PhotoSpotsSection />
        <Gallery />
        <Reviews />
        <FaqSection />
        <SourcesSection />
        <MapEmbed />
      </main>
      <Footer />
    </>
  );
}
