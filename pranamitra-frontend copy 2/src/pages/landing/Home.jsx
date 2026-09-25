import Navbar from "../../components/landing/Navbar";
import HeroSection from "../../components/landing/HeroSection";
import About from "../../components/landing/About";
import Features from "../../components/landing/Features";
import HowItWorks from "../../components/landing/HowItWorks";
import Statistics from "../../components/landing/Statistics";
import Compatibility from "../../components/landing/Compatibility";
import BloodBanks from "../../components/landing/BloodBanks";
import WhyDonate from "../../components/landing/WhyDonate";
import Testimonials from "../../components/landing/Testimonials";
import FAQ from "../../components/landing/FAQ";
import CTA from "../../components/landing/CTA";
import Contact from "../../components/landing/Contact";
import Footer from "../../components/landing/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-red-500 selection:text-white">
      {/* Header Sticky Navbar */}
      <Navbar />

      {/* Main content grid sections */}
      <main className="flex-1">
        <HeroSection />
        <About />
        <Features />
        <HowItWorks />
        <Statistics />
        <Compatibility />
        <BloodBanks />
        <WhyDonate />
        <Testimonials />
        <FAQ />
        <CTA />
        <Contact />
      </main>

      {/* Footer copyright and quick links */}
      <Footer />
    </div>
  );
}

export default Home;