import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import VendorCategories from '@/components/VendorCategories';
import FeaturedVendors from '@/components/FeaturedVendors';
import GovernmentSchemes from '@/components/GovernmentSchemes';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import About from '@/components/About';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <VendorCategories />
        <div id="featured-vendors">
          <FeaturedVendors />
        </div>
        <GovernmentSchemes />
      </main>
      <Footer />
      <Chatbot />
      <About/>
    </div>
  );
};

export default Index;