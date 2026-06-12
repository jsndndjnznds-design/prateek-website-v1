import { BenefitsSection } from "@/components/home/BenefitsSection";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { FAQSection } from "@/components/home/FAQSection";
import { GallerySection } from "@/components/home/GallerySection";
import { HeroSection } from "@/components/home/HeroSection";
import { RecentPurchaseToast } from "@/components/home/RecentPurchaseToast";
import { SocialProofSection } from "@/components/home/SocialProofSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <SocialProofSection />
      <GallerySection />
      <ComparisonSection />
      <FAQSection />
      <RecentPurchaseToast />
    </>
  );
}
