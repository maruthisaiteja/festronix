import { HeroSection } from "@/components/sections/HeroSection";
import { WhyAttendSection } from "@/components/sections/WhyAttendSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { FAQSection } from "@/components/sections/FAQSection";
import { RegisterCTA } from "@/components/sections/RegisterCTA";
import { ContactVenueSection } from "@/components/sections/ContactVenueSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhyAttendSection />
      <EventsSection />
      <AboutSection />
      <TimelineSection />
      <GallerySection />
      <FAQSection />
      <RegisterCTA />
      <ContactVenueSection />
    </>
  );
}
