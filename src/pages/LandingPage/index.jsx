import React from "react";
import { ThemeProvider } from "./ThemeContext";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import StatsSection from "./components/StatsSection";
import AboutSection from "./components/AboutSection";
import HowItWorksSection from "./components/HowItWorksSection";
import NewsSection from "./components/NewsSection";
import HelpSection from "./components/HelpSection";
import FAQSection from "./components/FAQSection";
import LandingFooter from "./components/LandingFooter";

const LandingPage = () => {
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-white text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <Navbar />
        <HeroSection />
        <ServicesSection />
        <StatsSection />
        <AboutSection />
        <HowItWorksSection />
        <NewsSection />
        <HelpSection />
        <FAQSection />
        <LandingFooter />
      </main>
    </ThemeProvider>
  );
};

export default LandingPage;
