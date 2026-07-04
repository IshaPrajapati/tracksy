import { Navbar } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/stats-features';
import { ProductSection } from '@/components/landing/product-section';
import { HowItWorksSection, SolutionsSection, WhyTracksySection } from '@/components/landing/how-solutions';
import { PricingSection, FAQSection, CTASection, ContactSection, Footer } from '@/components/landing/bottom-sections';

export default function LandingPage() {
  return (
    <div className="bg-[#070b0a] text-white selection:bg-[#5ed29c] selection:text-[#070b0a]">
      <Navbar />
      <HeroSection />

      <FeaturesSection />
      <ProductSection />
      <HowItWorksSection />
      <SolutionsSection />
      <WhyTracksySection />
      <PricingSection />

      <FAQSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </div>
  );
}
