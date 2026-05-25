import React, { useState } from 'react';
import { ChefHat, Flower, Camera, Music, Car, Palette, Cake, Shirt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star, Mail, Phone, Award } from 'lucide-react';

// Mock vendor data (unchanged, full list of 24 vendors)
const mockVendors = [
  {
    category: 'Catering',
    name: 'Gourmet Delights',
    location: 'New York, NY',
    details: 'Specializes in gourmet multi-course meals with vegan options.',
    contact: 'contact@gourmetdelights.com',
    rating: 4.8,
  },
  {
    category: 'Catering',
    name: 'Tasty Bites',
    location: 'Los Angeles, CA',
    details: 'Offers fusion cuisine with customizable menus.',
    contact: 'info@tastybites.com',
    rating: 4.5,
  },
  {
    category: 'Catering',
    name: 'Savory Seasons',
    location: 'Miami, FL',
    details: 'Seasonal menus with locally sourced ingredients.',
    contact: 'hello@savoryseasons.com',
    rating: 4.6,
  },
  {
    category: 'Catering',
    name: 'Elegant Eats',
    location: 'San Francisco, CA',
    details: 'High-end catering with a focus on organic dishes.',
    contact: 'info@eleganteats.com',
    rating: 4.7,
  },
  {
    category: 'Flowers & Decor',
    name: 'Bloom & Blossom',
    location: 'New York, NY',
    details: 'Custom floral arrangements and venue decor.',
    contact: 'bloom@blossom.com',
    rating: 4.7,
  },
  {
    category: 'Flowers & Decor',
    name: 'Petal Perfection',
    location: 'Austin, TX',
    details: 'Eco-friendly floral designs and rustic decor.',
    contact: 'contact@petalperfection.com',
    rating: 4.8,
  },
  {
    category: 'Flowers & Decor',
    name: 'Flora Fantasy',
    location: 'Seattle, WA',
    details: 'Modern and artistic floral installations.',
    contact: 'info@florafantasy.com',
    rating: 4.9,
  },
  {
    category: 'Photography',
    name: 'Capture Moments',
    location: 'Chicago, IL',
    details: 'Professional wedding photography with candid style.',
    contact: 'capture@moments.com',
    rating: 4.9,
  },
  {
    category: 'Photography',
    name: 'Shutter Bliss',
    location: 'Boston, MA',
    details: 'Specializes in cinematic wedding photography.',
    contact: 'hello@shutterbliss.com',
    rating: 4.7,
  },
  {
    category: 'Photography',
    name: 'Timeless Snaps',
    location: 'Denver, CO',
    details: 'Classic and timeless wedding photo packages.',
    contact: 'contact@timelesssnaps.com',
    rating: 4.6,
  },
  {
    category: 'Music & DJ',
    name: 'Rhythm Vibes',
    location: 'Atlanta, GA',
    details: 'Live bands and DJs for all music genres.',
    contact: 'book@rhythmvibes.com',
    rating: 4.8,
  },
  {
    category: 'Music & DJ',
    name: 'Melody Haven',
    location: 'Las Vegas, NV',
    details: 'High-energy DJ performances with light shows.',
    contact: 'info@melodyhaven.com',
    rating: 4.7,
  },
  {
    category: 'Transportation',
    name: 'Classic Rides',
    location: 'Philadelphia, PA',
    details: 'Vintage cars and limousines for weddings.',
    contact: 'ride@classicrides.com',
    rating: 4.6,
  },
  {
    category: 'Transportation',
    name: 'Elite Transports',
    location: 'Houston, TX',
    details: 'Luxury SUVs and party buses for wedding guests.',
    contact: 'info@elitetransports.com',
    rating: 4.8,
  },
  {
    category: 'Makeup & Beauty',
    name: 'Glam Glow',
    location: 'Phoenix, AZ',
    details: 'Bridal makeup and hairstyling services.',
    contact: 'glam@glow.com',
    rating: 4.9,
  },
  {
    category: 'Makeup & Beauty',
    name: 'Radiant Beauty',
    location: 'Dallas, TX',
    details: 'Customized bridal and party makeup packages.',
    contact: 'contact@radiantbeauty.com',
    rating: 4.7,
  },
  {
    category: 'Wedding Cakes',
    name: 'Sweet Layers',
    location: 'Portland, OR',
    details: 'Artisanal wedding cakes with unique flavors.',
    contact: 'orders@sweetlayers.com',
    rating: 4.8,
  },
  {
    category: 'Wedding Cakes',
    name: 'Cake Couture',
    location: 'Orlando, FL',
    details: 'Custom-designed cakes for all wedding themes.',
    contact: 'info@cakecouture.com',
    rating: 4.6,
  },
  {
    category: 'Attire & Jewelry',
    name: 'Bridal Elegance',
    location: 'San Diego, CA',
    details: 'Designer wedding gowns and accessories.',
    contact: 'shop@bridalelegance.com',
    rating: 4.7,
  },
  {
    category: 'Attire & Jewelry',
    name: 'Timeless Threads',
    location: 'Charlotte, NC',
    details: 'Bespoke suits and dresses for weddings.',
    contact: 'contact@timelessthreads.com',
    rating: 4.8,
  },
  {
    category: 'Catering',
    name: 'Flavor Fusion',
    location: 'Seattle, WA',
    details: 'Global-inspired menus with a modern twist.',
    contact: 'info@flavorfusion.com',
    rating: 4.7,
  },
  {
    category: 'Photography',
    name: 'Lens Love',
    location: 'Miami, FL',
    details: 'Romantic and candid wedding photography.',
    contact: 'info@lenslove.com',
    rating: 4.8,
  },
  {
    category: 'Music & DJ',
    name: 'Beat Bliss',
    location: 'Miami, FL',
    details: 'High-energy DJs with customizable playlists.',
    contact: 'info@beatbliss.com',
    rating: 4.7,
  },
  {
    category: 'Flowers & Decor',
    name: 'Garden Grace',
    location: 'Miami, FL',
    details: 'Tropical floral designs and beach-themed decor.',
    contact: 'info@gardengrace.com',
    rating: 4.7,
  },
];

// Category definitions with enhanced styling
const categories = [
  {
    icon: ChefHat,
    title: 'Catering',
    description: 'Delicious food & beverages',
    color: 'from-orange-400 to-red-500',
    bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
    iconColor: 'text-orange-600',
    count: mockVendors.filter(v => v.category === 'Catering').length,
  },
  {
    icon: Flower,
    title: 'Flowers & Decor',
    description: 'Beautiful floral arrangements',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
    iconColor: 'text-pink-600',
    count: mockVendors.filter(v => v.category === 'Flowers & Decor').length,
  },
  {
    icon: Camera,
    title: 'Photography',
    description: 'Capture your special moments',
    color: 'from-purple-400 to-indigo-500',
    bgColor: 'bg-gradient-to-br from-purple-50 to-indigo-50',
    iconColor: 'text-purple-600',
    count: mockVendors.filter(v => v.category === 'Photography').length,
  },
  {
    icon: Music,
    title: 'Music & DJ',
    description: 'Perfect soundtrack for your day',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    iconColor: 'text-blue-600',
    count: mockVendors.filter(v => v.category === 'Music & DJ').length,
  },
  {
    icon: Car,
    title: 'Transportation',
    description: 'Elegant wedding transport',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    iconColor: 'text-green-600',
    count: mockVendors.filter(v => v.category === 'Transportation').length,
  },
  {
    icon: Palette,
    title: 'Makeup & Beauty',
    description: 'Look stunning on your day',
    color: 'from-rose-400 to-pink-500',
    bgColor: 'bg-gradient-to-br from-rose-50 to-pink-50',
    iconColor: 'text-rose-600',
    count: mockVendors.filter(v => v.category === 'Makeup & Beauty').length,
  },
  {
    icon: Cake,
    title: 'Wedding Cakes',
    description: 'Sweet celebrations',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    iconColor: 'text-yellow-600',
    count: mockVendors.filter(v => v.category === 'Wedding Cakes').length,
  },
  {
    icon: Shirt,
    title: 'Attire & Jewelry',
    description: 'Perfect wedding outfits',
    color: 'from-indigo-400 to-purple-500',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    iconColor: 'text-indigo-600',
    count: mockVendors.filter(v => v.category === 'Attire & Jewelry').length,
  },
];

const VendorCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<(typeof mockVendors)[0] | null>(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [nameError, setNameError] = useState<string>('');
  const [locationError, setLocationError] = useState<string>('');

  // Regex patterns for validation
  const regexPatterns = {
    name: /^[A-Za-z][A-Za-z0-9\s&'-]*$/,
    location: /^[A-Za-z][A-Za-z0-9\s,]*$/,
  };

  // Validation functions
  const validateName = (name: string): string => {
    if (name && name.length < 2) {
      return 'Vendor name must be at least 2 characters long';
    }
    if (name && !regexPatterns.name.test(name)) {
      return 'Vendor name must start with a letter and can only contain letters, numbers, spaces, &, \', or -';
    }
    return '';
  };

  const validateLocation = (location: string): string => {
    if (location && location.length < 2) {
      return 'Location must be at least 2 characters long';
    }
    if (location && !regexPatterns.location.test(location)) {
      return 'Location must start with a letter and can only contain letters, numbers, spaces, or commas';
    }
    return '';
  };

  // Handle input changes with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchName(value);
    setNameError(validateName(value));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    setLocationError(validateLocation(value));
  };

  // Filter vendors only if validations pass
  const filteredVendors = mockVendors.filter((vendor) => {
    if (!selectedCategory) return false;
    if (nameError || locationError) return false;
    return (
      vendor.category === selectedCategory &&
      (searchName === '' || vendor.name.toLowerCase().includes(searchName.toLowerCase())) &&
      (location === '' || vendor.location.toLowerCase().includes(location.toLowerCase()))
    );
  });

  const handleCardClick = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
    setIsCategoryModalOpen(true);
    setLocation('');
    setSearchName('');
    setNameError('');
    setLocationError('');
  };

  const handleVendorClick = (vendor: (typeof mockVendors)[0]) => {
    setSelectedVendor(vendor);
    setIsVendorModalOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='5' cy='5' r='5'/%3E%3Ccircle cx='55' cy='55' r='5'/%3E%3Ccircle cx='30' cy='30' r='5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <section id="services" className="relative py-24" style={{
        backgroundImage: `url('https://www.paperlesspost.com/blog/wp-content/uploads/080822_Blog_DecorationsForAnOutdoorWedding_01-hero.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-block p-2 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full mb-6">
              <Award className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-gray-900 bg-clip-text text-transparent mb-6 tracking-tight">
              Premium Wedding Vendors
            </h2>
            <p className="text-xl text-white max-w-4xl mx-auto leading-relaxed">
              Discover and connect with carefully curated, top-rated wedding professionals 
              to bring your dream celebration to life with unmatched elegance and quality.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"></div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden bg-white/90 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border-0 backdrop-blur-sm"
                onClick={() => handleCardClick(category.title)}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Content */}
                <CardContent className="p-8 text-center relative z-10">
                  {/* Icon Container */}
                  <div className={`w-20 h-20 rounded-2xl ${category.bgColor} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <category.icon className={`h-10 w-10 ${category.iconColor}`} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-rose-700 transition-colors duration-300">
                    {category.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-base mb-4 leading-relaxed">{category.description}</p>
                  
                  {/* Vendor Count */}
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-full">
                    <p className="text-rose-700 font-semibold text-sm">
                      {category.count} Vendors Available
                    </p>
                  </div>
                  
                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Category Modal for Vendor List */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="max-w-6xl rounded-2xl bg-white shadow-2xl p-0 border-0">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-8 rounded-t-2xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-white flex items-center gap-3">
                {categories.find(cat => cat.title === selectedCategory)?.icon && (
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    {React.createElement(categories.find(cat => cat.title === selectedCategory)!.icon, {
                      className: "h-6 w-6 text-white"
                    })}
                  </div>
                )}
                {selectedCategory} Professionals
              </DialogTitle>
              <DialogDescription className="text-rose-100 text-lg mt-2">
                Explore our handpicked selection of premium 
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8">
            {/* Search Section */}
            <div className="mb-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by vendor name..."
                    value={searchName}
                    onChange={handleNameChange}
                    className={`pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 transition-all text-lg ${nameError ? 'border-red-400' : ''}`}
                  />
                  {nameError && <p className="text-red-500 text-sm mt-2" role="alert">{nameError}</p>}
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Filter by location..."
                    value={location}
                    onChange={handleLocationChange}
                    className={`pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 transition-all text-lg ${locationError ? 'border-red-400' : ''}`}
                  />
                  {locationError && <p className="text-red-500 text-sm mt-2" role="alert">{locationError}</p>}
                </div>
              </div>
            </div>

            {/* Vendors Grid */}
            {filteredVendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-2">
                {filteredVendors.map((vendor, index) => (
                  <Card
                    key={index}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-0 overflow-hidden"
                    onClick={() => handleVendorClick(vendor)}
                  >
                    <CardContent className="p-6">
                      {/* Vendor Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 group-hover:text-rose-700 transition-colors mb-2">
                            {vendor.name}
                          </h4>
                          <div className="flex items-center text-gray-500 mb-2">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="text-sm">{vendor.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-semibold text-yellow-700">{vendor.rating}</span>
                        </div>
                      </div>

                      {/* Vendor Details */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vendor.details}</p>

                      {/* Contact Info */}
                      <div className="flex items-center text-gray-500 mb-4">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm truncate">{vendor.contact}</span>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {renderStars(Math.floor(vendor.rating))}
                          <span className="text-sm text-gray-500 ml-2">({vendor.rating}/5)</span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all shadow-md hover:shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVendorClick(vendor);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  {nameError || locationError
                    ? 'Please correct the search inputs to view vendors.'
                    : 'No vendors found matching your criteria. Try adjusting your search.'}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Vendor Details Modal */}
      <Dialog open={isVendorModalOpen} onOpenChange={setIsVendorModalOpen}>
        <DialogContent className="max-w-2xl rounded-2xl bg-white shadow-2xl p-0 border-0">
          {selectedVendor && (
            <>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-t-2xl">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-white mb-2">
                    {selectedVendor.name}
                  </DialogTitle>
                  <DialogDescription className="text-gray-300 text-lg">
                    Premium {selectedVendor.category} Services
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-8 space-y-6">
                {/* Rating Section */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.floor(selectedVendor.rating))}
                    </div>
                    <span className="text-2xl font-bold text-yellow-700">{selectedVendor.rating}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Excellent Rating</p>
                    <p className="text-lg font-semibold text-gray-900">Highly Recommended</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Award className="w-4 h-4 mr-2 text-rose-600" />
                        Category
                      </h4>
                      <p className="text-gray-900 font-medium">{selectedVendor.category}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-rose-600" />
                        Location
                      </h4>
                      <p className="text-gray-900 font-medium">{selectedVendor.location}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-rose-600" />
                        Contact
                      </h4>
                      <p className="text-gray-900 font-medium break-all">{selectedVendor.contact}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">About This Vendor</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedVendor.details}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl py-3 text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                    onClick={() => {
                      window.location.href = `mailto:${selectedVendor.contact}`;
                    }}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Vendor
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 hover:border-rose-500 text-gray-700 hover:text-rose-700 rounded-xl py-3 text-lg font-semibold transition-all"
                    onClick={() => {
                      // Add to favorites functionality could go here
                      alert('Added to favorites!');
                    }}
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Save Vendor
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorCategories;