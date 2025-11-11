import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Process from "@/components/Process";
import PlatformPreview from "@/components/PlatformPreview";
import { AIProductNaming } from "@/components/AIProductNaming";
import CafeMatching from "@/components/CafeMatching";
import LiveDemo from "@/components/LiveDemo";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <Process />
      <PlatformPreview />
      <AIProductNaming />
      <CafeMatching />
      <LiveDemo />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
