import { useEffect } from 'react';
import useSiteStore from '../store/siteStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../sections/HeroSection';
import StatsSection from '../sections/StatsSection';
import FeaturesSection from '../sections/FeaturesSection';
import CoursesSection from '../sections/CoursesSection';
import ProcessSection from '../sections/ProcessSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import CTASection from '../sections/CTASection';
import ContactSection from '../sections/ContactSection';

const SECTION_MAP = {
  hero: HeroSection,
  stats: StatsSection,
  features: FeaturesSection,
  courses: CoursesSection,
  process: ProcessSection,
  testimonials: TestimonialsSection,
  cta: CTASection,
  contact: ContactSection,
};

export default function PublicPage() {
  const { sections, fetchSections, fetchCourses, fetchTestimonials, fetchStats } = useSiteStore();

  useEffect(() => {
    fetchSections();
    fetchCourses();
    fetchTestimonials();
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0618] text-white overflow-x-hidden">
      {/* Background ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-saffron-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-600/10 rounded-full blur-[90px]" />
      </div>

      <Navbar />

      <main className="relative z-10">
        {sections
          .filter((s) => s.is_visible)          // ← Supabase snake_case
          .sort((a, b) => a.order - b.order)
          .map((section) => {
            const SectionComponent = SECTION_MAP[section.type];
            if (!SectionComponent) return null;
            return <SectionComponent key={section.id} section={section} />;   // ← .id not ._id
          })}
      </main>

      <Footer />
    </div>
  );
}
