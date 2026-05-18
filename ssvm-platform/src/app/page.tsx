"use client";

import {
  NewNavbar,
  CinematicHeroSection,
  StatsSection,
  CoreValuesSection,
  AcademicProgramsSection,
  EventsNoticesSection,
  GallerySection,
  AdmissionCTASection,
  NewFooter,
} from "@/components";

export default function HomePage() {
  return (
    <>
      <NewNavbar />
      <main>
        <CinematicHeroSection />
        <StatsSection />
        <CoreValuesSection />
        <AcademicProgramsSection />
        <EventsNoticesSection />
        <GallerySection />
        <AdmissionCTASection />
      </main>
      <NewFooter />
    </>
  );
}
