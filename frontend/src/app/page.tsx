import { HeroSection } from "@/features/home/components/HeroSection";
import { Testimonials } from "@/features/home/components/TrustAndTestimonials";
import { ValuePropsSection } from "@/features/home/components/ValuePropsSection";
import { UseCaseCardsSection } from "@/features/home/components/UseCaseCardsSection";
import { WorkflowSection } from "@/features/home/components/WorkflowSection";
import { CTAFooterSection } from "@/features/home/components/CTAFooterSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <ValuePropsSection />
      <UseCaseCardsSection />
      <WorkflowSection />
      <Testimonials />
      <CTAFooterSection />
    </main>
  );
}
