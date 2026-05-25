import React from 'react';
import { Heart, Users, Package, Calendar } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="bg-gradient-to-b from-rose-50 via-pink-50 to-white py-16">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl shadow-md">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
            About Shaadi Mubaraak
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">
            Your trusted partner in creating unforgettable love stories and seamless wedding experiences.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              At Shaadi Mubaraak, we believe that every love story deserves a perfect beginning. Our mission is to connect individuals with their ideal partners and provide a seamless platform to plan their dream weddings. We strive to make every moment of your journey—from finding the perfect match to organizing a flawless celebration—memorable and stress-free.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With a commitment to authenticity, trust, and excellence, we bring together verified profiles and top-tier vendors to ensure your special day reflects your unique vision.
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-semibold mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-white opacity-80" />
                  <span>Verified profiles for safe and meaningful connections</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-white opacity-80" />
                  <span>Trusted vendors for all your wedding needs</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-white opacity-80" />
                  <span>Seamless planning tools for a stress-free experience</span>
                </li>
              </ul>
            </div>
            <div className="absolute top-10 -right-10 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Our Story</h3>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Founded with a passion for celebrating love, Shaadi Mubaraak was created to bridge the gap between meaningful connections and exceptional wedding planning. Our platform was born out of a desire to simplify the journey of finding a life partner and crafting a wedding that reflects your unique love story. With a team dedicated to innovation and customer satisfaction, we have grown into a trusted name, helping thousands of couples start their forever with joy and confidence.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Join Our Community</h3>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            Whether you're searching for your soulmate or planning your dream wedding, Shaadi Mubaraak is here to make it happen. Join our community today and let us help you create moments that last a lifetime.
          </p>
          <a
            href="#signup"
            className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
            aria-label="Get Started with Shaadi Mubaraak"
          >
            Get Started
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default About;