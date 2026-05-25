import React, { useState } from 'react';
import { Search, MapPin, Calendar, Heart, Plane, Hotel, Map, DollarSign, Star, Clock, X } from 'lucide-react';
import emailjs from '@emailjs/browser';

// Define TypeScript interface for honeymoon data to match backend structure
interface HoneymoonData {
  flights: Array<{
    airline: string;
    price: number;
    duration: string;
    stops: number | string;
    rating: number;
  }>;
  hotels: Array<{
    hotelName: string;
    rating: number;
    pricePerNight: number;
    description: string;
  }>;
  packages: Array<{
    name: string;
    price: number;
    duration: string;
    includes: string;
  }>;
  itinerary: {
    honeymoonItinerary: Array<{
      day: string;
      activity: string;
      description: string;
    }>;
  };
}

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<'vendors' | 'honeymoon'>('vendors');
  const [honeymoonData, setHoneymoonData] = useState<HoneymoonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');

  const [showCheckoutSummary, setShowCheckoutSummary] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Mock data aligned with backend structure for Mumbai
  const mockData: HoneymoonData = {
    flights: [
      {
        airline: 'Air India',
        price: 1200,
        duration: '20 hours',
        stops: '1',
        rating: 3.8,
      },
      {
        airline: 'Emirates',
        price: 1500,
        duration: '18 hours',
        stops: '1',
        rating: 4.2,
      },
      {
        airline: 'Delta',
        price: 1800,
        duration: '22 hours',
        stops: '1',
        rating: 4.0,
      },
    ],
    hotels: [
      {
        hotelName: 'The Taj Mahal Palace',
        rating: 4.8,
        pricePerNight: 350,
        description: 'Iconic luxury hotel with stunning views of the Arabian Sea.',
      },
      {
        hotelName: 'The Oberoi, Mumbai',
        rating: 4.7,
        pricePerNight: 300,
        description: 'Elegant hotel offering exceptional service and fine dining options.',
      },
      {
        hotelName: 'St. Regis Mumbai',
        rating: 4.6,
        pricePerNight: 250,
        description: 'Luxurious hotel with a sophisticated ambiance and world-class amenities.',
      },
    ],
    packages: [
      {
        name: 'Romantic Mumbai Getaway',
        price: 1000,
        duration: '3 days',
        includes: 'Private car transfers, couple’s spa treatment, romantic dinner cruise.',
      },
      {
        name: 'Mumbai Culture & Cuisine Tour',
        price: 700,
        duration: '4 days',
        includes: 'Guided tours of historical sites, cooking class, street food tour.',
      },
      {
        name: 'Luxury Mumbai Experience',
        price: 1500,
        duration: '5 days',
        includes: 'Luxury hotel stay, private yacht tour, personal shopper experience.',
      },
    ],
    itinerary: {
      honeymoonItinerary: [
        {
          day: 'Day 1',
          activity: 'Arrival & Hotel Check-in',
          description: 'Arrive at Mumbai Airport, transfer to your hotel, relax and enjoy the city view.',
        },
        {
          day: 'Day 2',
          activity: 'Gateway of India & Elephanta Caves',
          description:
            'Visit the iconic Gateway of India, take a ferry to the Elephanta Caves, enjoy a romantic dinner at a waterfront restaurant.',
        },
        {
          day: 'Day 3',
          activity: 'Dhobi Ghat & Street Food Tour',
          description:
            'Explore the unique Dhobi Ghat open-air laundry, enjoy a street food tour, and have a romantic dinner at a rooftop restaurant with city views.',
        },
        {
          day: 'Day 4',
          activity: 'Couple’s Spa & Marine Drive Stroll',
          description:
            'Indulge in a couple’s spa treatment, take a romantic evening stroll along Marine Drive, enjoy dinner at a fine dining restaurant.',
        },
        {
          day: 'Day 5',
          activity: 'Chhatrapati Shivaji Maharaj Terminus & Museums',
          description:
            'Explore the Chhatrapati Shivaji Maharaj Terminus, visit a museum (e.g., the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya), enjoy dinner at a restaurant serving traditional Maharashtrian cuisine.',
        },
        {
          day: 'Day 6',
          activity: 'Shopping & Romantic Dinner Cruise',
          description: 'Enjoy shopping at Colaba Causeway, experience a romantic dinner cruise on the Arabian Sea.',
        },
        {
          day: 'Day 7',
          activity: 'Departure',
          description: 'Enjoy a final breakfast, transfer to the airport for your departure.',
        },
      ],
    },
  };

  const planHoneymoon = async (destination: string, budget: string, duration: number, origin: string) => {
    setLoading(true);
    setHoneymoonData(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/plan-honeymoon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination, budget, duration, origin }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response body:', text);
        throw new Error('Server returned non-JSON response. Please check the backend server.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch honeymoon data: ${response.status}`);
      }

      const data: HoneymoonData = await response.json();
      setHoneymoonData(data);
    } catch (err) {
      console.error('Error planning honeymoon:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setTimeout(() => {
        setHoneymoonData(mockData);
        setError('Using mock data due to API failure.');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleHoneymoonSearch = () => {
    const destinationInput = document.querySelector('input[name="destination"]') as HTMLInputElement | null;
    const budgetSelect = document.querySelector('select[name="budget"]') as HTMLSelectElement | null;
    const durationSelect = document.querySelector('select[name="duration"]') as HTMLSelectElement | null;
    const originInput = document.querySelector('input[name="origin"]') as HTMLInputElement | null;
    const checkInInput = document.querySelector('input[name="checkIn"]') as HTMLInputElement | null;
    const checkOutInput = document.querySelector('input[name="checkOut"]') as HTMLInputElement | null;

    const destination = destinationInput?.value;
    const budget = budgetSelect?.value;
    const duration = durationSelect?.value;
    const origin = originInput?.value || 'New York';
    const checkIn = checkInInput?.value;
    const checkOut = checkOutInput?.value;

    if (!destination || !budget || !duration || !origin || !checkIn || !checkOut) {
      setError('Please fill out all fields.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
    const checkInDateObj = new Date(checkIn);
    const checkOutDateObj = new Date(checkOut);

    // Validate check-in date (not before today)
    if (checkInDateObj < today) {
      setError('Check-in date cannot be before today.');
      return;
    }

    // Validate check-out date (must be after check-in date)
    if (checkOutDateObj <= checkInDateObj) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
    console.log('Sending request with:', { destination, budget, duration, origin });
    planHoneymoon(destination, budget, parseInt(duration, 10), origin);
  };

  const calculateTotalPrice = () => {
    if (!honeymoonData) return 0;
    let total = 0;

    if (selectedFlight !== null) {
      total += honeymoonData.flights[selectedFlight].price;
    }

    if (selectedHotel !== null && selectedPackage !== null) {
      const hotelPricePerNight = honeymoonData.hotels[selectedHotel].pricePerNight;
      const packageDurationDays = parseInt(honeymoonData.packages[selectedPackage].duration.split(' ')[0]);
      total += hotelPricePerNight * packageDurationDays;
    } else if (selectedHotel !== null) {
      total += honeymoonData.hotels[selectedHotel].pricePerNight;
    }

    if (selectedPackage !== null) {
      total += honeymoonData.packages[selectedPackage].price;
    }

    return total;
  };

  const handleCheckout = () => {
    if (selectedFlight === null && selectedHotel === null && selectedPackage === null) {
      setError('Please select at least one flight, hotel, or package to proceed with checkout.');
      return;
    }
    setShowCheckoutSummary(true);
  };

  const handlePayNow = async () => {
    setIsPaying(true);
    const totalPriceUSD = calculateTotalPrice();
    if (totalPriceUSD === 0) {
      setError('No items selected for payment.');
      setIsPaying(false);
      return;
    }
    const totalPriceINR = totalPriceUSD * 83 * 100; // Convert USD to INR paise (1 USD = 83 INR)

    try {
      const response = await fetch('http://localhost:5000/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPriceINR,
          currency: 'INR',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await response.json();

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: totalPriceINR,
          currency: 'INR',
          name: 'Shaadi Connect',
          description: 'Honeymoon Booking Payment',
          order_id: order.id,
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            try {
              const verifyResponse = await fetch('http://localhost:5000/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              if (!verifyResponse.ok) {
                const errorData = await verifyResponse.json();
                throw new Error(errorData.error || 'Payment verification failed');
              }

              const verifyData = await verifyResponse.json();
              if (verifyData.status === 'ok') {
                const templateParams: any = {
                  to_email: 'harshranjan215@gmail.com',
                  destination: (document.querySelector('input[name="destination"]') as HTMLInputElement)?.value || 'Unknown',
                  origin: (document.querySelector('input[name="origin"]') as HTMLInputElement)?.value || 'Unknown',
                  check_in_date: checkInDate,
                  check_out_date: checkOutDate,
                  total_price: `$${totalPriceUSD.toFixed(2)} (₹${(totalPriceUSD * 83).toFixed(2)})`,
                };

                if (selectedFlight !== null) {
                  const selectedFlightData = honeymoonData!.flights[selectedFlight];
                  templateParams.flight_details = `Airline: ${selectedFlightData.airline}, Price: $${selectedFlightData.price.toFixed(2)}, Duration: ${selectedFlightData.duration}, Stops: ${selectedFlightData.stops}, Rating: ${selectedFlightData.rating}`;
                }

                if (selectedHotel !== null) {
                  const selectedHotelData = honeymoonData!.hotels[selectedHotel];
                  templateParams.hotel_details = `Hotel: ${selectedHotelData.hotelName}, Price per Night: $${selectedHotelData.pricePerNight.toFixed(2)}, Rating: ${selectedHotelData.rating}`;
                }

                if (selectedPackage !== null) {
                  const selectedPackageData = honeymoonData!.packages[selectedPackage];
                  templateParams.package_details = `Package: ${selectedPackageData.name}, Price: $${selectedPackageData.price.toFixed(2)}, Duration: ${selectedPackageData.duration}, Includes: ${selectedPackageData.includes}`;
                }

                emailjs
                  .send(
                    'service_84tlz45',
                    'template_79jsuul',
                    templateParams,
                    'IxOEsFVvtMZiXxQrM'
                  )
                  .then(
                    (emailResponse) => {
                      console.log('Email sent successfully:', emailResponse.status, emailResponse.text);
                      alert('Payment successful! Confirmation email sent to harshranjan215@gmail.com.');
                      setShowCheckoutSummary(false);
                      setSelectedFlight(null);
                      setSelectedHotel(null);
                      setSelectedPackage(null);
                      setCheckInDate('');
                      setCheckOutDate('');
                      setHoneymoonData(null);
                    },
                    (emailError) => {
                      console.error('Failed to send email:', emailError);
                      setError('Payment successful, but failed to send confirmation email.');
                    }
                  )
                  .finally(() => setIsPaying(false));
              } else {
                setError('Payment verification failed.');
                setIsPaying(false);
              }
            } catch (verifyError) {
              console.error('Payment verification error:', verifyError);
              setError('Payment verification failed. Please contact support.');
              setIsPaying(false);
            }
          },
          prefill: {
            email: 'customer@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#f43f5e',
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };

      script.onerror = () => {
        setError('Failed to load Razorpay script. Please try again.');
        setIsPaying(false);
      };
    } catch (error) {
      console.error('Order creation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to initiate payment.');
      setIsPaying(false);
    }
  };

  const dismissError = () => {
    setError(null);
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="relative gradient-blush py-20 overflow-hidden">

      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <div className="w-32 h-32 rounded-full bg-pink-300 float-animation"></div>
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <div className="w-24 h-24 rounded-full bg-rose-300 float-animation" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Your Dream Wedding
            <span className="block bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with the finest wedding vendors and plan your perfect honeymoon with AI-powered recommendations
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-full p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('vendors')}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === 'vendors' ? 'tab-active' : 'tab-inactive hover:bg-white/90'
                }`}
              >
                <Search className="w-4 h-4 inline mr-2" />
                Find Vendors
              </button>
              <button
                onClick={() => setActiveTab('honeymoon')}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === 'honeymoon' ? 'tab-active' : 'tab-inactive hover:bg-white/90'
                }`}
              >
                <Heart className="w-4 h-4 inline mr-2" />
                Plan Honeymoon
              </button>
            </div>
          </div>

          {/* Vendor Search Card */}
          {activeTab === 'vendors' && (
            <div className="max-w-4xl mx-auto p-6 bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -trane-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    placeholder="Search services..."
                    className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none px-3"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    placeholder="Location"
                    className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none px-3"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    placeholder="Wedding Date"
                    className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none px-3"
                  />
                </div>
                <button className="h-12 gradient-rose text-white font-semibold hover:opacity-90 transition-all transform hover:scale-105 rounded-lg">
                  Find Vendors
                </button>
              </div>
            </div>
          )}

          {/* Honeymoon Planner Card */}
          {activeTab === 'honeymoon' && (
            <div className="max-w-4xl mx-auto">
              <div className="p-6 bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-2xl mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      name="origin"
                      placeholder="Origin City"
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none px-3"
                    />
                  </div>
                  <div className="relative">
                    <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      name="destination"
                      placeholder="Destination"
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none px-3"
                    />
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      name="budget"
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none px-3"
                    >
                      <option value="">Budget Range</option>
                      <option value="budget">Budget ($1000-3000)</option>
                      <option value="mid">Mid-range ($3000-6000)</option>
                      <option value="luxury">Luxury ($6000+)</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      name="duration"
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none px-3"
                    >
                      <option value="">Duration</option>
                      <option value="5">5 Days</option>
                      <option value="7">1 Week</option>
                      <option value="10">10 Days</option>
                      <option value="14">2 Weeks</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      name="checkIn"
                      type="date"
                      placeholder="Check-in Date"
                      min={today}
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none px-3"
                      onChange={(e) => setCheckInDate(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      name="checkOut"
                      type="date"
                      placeholder="Check-out Date"
                      min={checkInDate || today}
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none px-3"
                      onChange={(e) => setCheckOutDate(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleHoneymoonSearch}
                    disabled={loading}
                    className="h-12 gradient-rose text-white font-semibold hover:opacity-90 transition-all transform hover:scale-105 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Planning...' : 'Plan Honeymoon'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-500 my-4 p-4 bg-red-100 rounded-lg max-w-4xl mx-auto error-alert">
                  <span>Error: {error}</span>
                  <div>
                    <button
                      onClick={handleHoneymoonSearch}
                      className="mr-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                    >
                      Retry
                    </button>
                    <button
                      onClick={dismissError}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {honeymoonData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in-up">
                  <div className="bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <Plane className="w-5 h-5 text-pink-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Best Flight Deals</h3>
                    </div>
                    {honeymoonData.flights.length > 0 ? (
                      honeymoonData.flights.map((flight, index) => (
                        <div key={index} className="border-b border-gray-100 py-3 last:border-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedFlight === index}
                                onChange={() => setSelectedFlight(selectedFlight === index ? null : index)}
                                className="mr-2"
                              />
                              <div>
                                <div className="flex items-center font-medium text-gray-800">
                                  <Plane className="w-4 h-4 text-pink-600 mr-2" />
                                  {flight.airline}
                                </div>
                                <div className="text-sm text-gray-600">{flight.duration} • {flight.stops} Stop{flight.stops !== '1' ? 's' : ''}</div>
                                <div className="flex items-center mt-1">
                                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                  <span className="text-sm text-gray-600">{flight.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-pink-600">${flight.price.toFixed(2)}</div>
                              <div className="text-xs text-gray-500">per person</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No flight deals found.</p>
                    )}
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <Hotel className="w-5 h-5 text-pink-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Best Hotels</h3>
                    </div>
                    {honeymoonData.hotels.length > 0 ? (
                      honeymoonData.hotels.map((hotel, index) => (
                        <div key={index} className="border-b border-gray-100 py-3 last:border-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedHotel === index}
                                onChange={() => setSelectedHotel(selectedHotel === index ? null : index)}
                                className="mr-2"
                              />
                              <div>
                                <div className="flex items-center font-medium text-gray-800">
                                  <Hotel className="w-4 h-4 text-pink-600 mr-2" />
                                  {hotel.hotelName}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">{hotel.description}</div>
                                <div className="flex items-center mt-1">
                                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                  <span className="text-sm text-gray-600">{hotel.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-pink-600">${hotel.pricePerNight.toFixed(2)} /night</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No hotels found.</p>
                    )}
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <Heart className="w-5 h-5 text-pink-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Package Deals</h3>
                    </div>
                    {honeymoonData.packages.length > 0 ? (
                      honeymoonData.packages.map((pkg, index) => (
                        <div key={index} className="border-b border-gray-100 py-3 last:border-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedPackage === index}
                                onChange={() => setSelectedPackage(selectedPackage === index ? null : index)}
                                className="mr-2"
                              />
                              <div>
                                <div className="flex items-center font-medium text-gray-800">
                                  <Heart className="w-4 h-4 text-pink-600 mr-2" />
                                  {pkg.name}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">{pkg.includes}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-pink-600">${pkg.price.toFixed(2)}</div>
                              <div className="text-xs text-gray-500">{pkg.duration}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No packages found.</p>
                    )}
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <Calendar className="w-5 h-5 text-pink-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Suggested Itinerary</h3>
                    </div>
                    {honeymoonData.itinerary.honeymoonItinerary.length > 0 ? (
                      honeymoonData.itinerary.honeymoonItinerary.map((item, index) => (
                        <div key={index} className="border-b border-gray-100 py-3 last:border-0">
                          <div className="flex items-center font-medium text-gray-800">
                            <Calendar className="w-4 h-4 text-pink-600 mr-2" />
                            {item.day}: {item.activity}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No itinerary found.</p>
                    )}
                  </div>
                </div>
              )}

              {honeymoonData && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleCheckout}
                    disabled={selectedFlight === null && selectedHotel === null && selectedPackage === null}
                    className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50"
                  >
                    Checkout
                  </button>
                </div>
              )}

              {showCheckoutSummary && honeymoonData && (
                <div className="modal-overlay" onClick={() => setShowCheckoutSummary(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h2 className="text-base font-semibold">Booking Summary</h2>
                      <X className="modal-close w-5 h-5" onClick={() => setShowCheckoutSummary(false)} />
                    </div>
                    <div className="modal-section">
                      <h3 className="flex items-center">
                        <MapPin className="w-3 h-3 text-pink-600 mr-2" />
                        Trip Details
                      </h3>
                      <p>
                        <strong>From:</strong> {(document.querySelector('input[name="origin"]') as HTMLInputElement)?.value || 'Unknown'}<br />
                        <strong>To:</strong> {(document.querySelector('input[name="destination"]') as HTMLInputElement)?.value || 'Unknown'}<br />
                        <strong>Check-in:</strong> {checkInDate}<br />
                        <strong>Check-out:</strong> {checkOutDate}
                      </p>
                    </div>
                    {selectedFlight !== null && (
                      <div className="modal-section">
                        <h3 className="flex items-center">
                          <Plane className="w-3 h-3 text-pink-600 mr-2" />
                          Flight
                        </h3>
                        <p>
                          <strong>{honeymoonData.flights[selectedFlight].airline}</strong><br />
                          ${honeymoonData.flights[selectedFlight].price.toFixed(2)} • {honeymoonData.flights[selectedFlight].duration} • {honeymoonData.flights[selectedFlight].stops} Stop{Number(honeymoonData.flights[selectedFlight].stops) !== 1 ? 's' : ''}<br />
                          <Star className="w-2.5 h-2.5 text-yellow-400 inline mr-1" /> {honeymoonData.flights[selectedFlight].rating}
                        </p>
                      </div>
                    )}
                    {selectedHotel !== null && (
                      <div className="modal-section">
                        <h3 className="flex items-center">
                          <Hotel className="w-3 h-3 text-pink-600 mr-2" />
                          Hotel
                        </h3>
                        <p>
                          <strong>{honeymoonData.hotels[selectedHotel].hotelName}</strong><br />
                          ${honeymoonData.hotels[selectedHotel].pricePerNight.toFixed(2)}/night • <Star className="w-2.5 h-2.5 text-yellow-400 inline mr-1" /> {honeymoonData.hotels[selectedHotel].rating}<br />
                          {honeymoonData.hotels[selectedHotel].description}
                        </p>
                      </div>
                    )}
                    {selectedPackage !== null && (
                      <div className="modal-section">
                        <h3 className="flex items-center">
                          <Heart className="w-3 h-3 text-pink-600 mr-2" />
                          Package
                        </h3>
                        <p>
                          <strong>{honeymoonData.packages[selectedPackage].name}</strong><br />
                          ${honeymoonData.packages[selectedPackage].price.toFixed(2)} • {honeymoonData.packages[selectedPackage].duration}<br />
                          {honeymoonData.packages[selectedPackage].includes}
                        </p>
                      </div>
                    )}
                    <div className="price-box">
                      <p>Total: ${calculateTotalPrice().toFixed(2)} (₹{(calculateTotalPrice() * 83).toFixed(2)})</p>
                    </div>
                    <button onClick={handlePayNow} className="pay-button" disabled={isPaying}>
                      {isPaying && <span className="spinner"></span>}
                      {isPaying ? 'Processing' : 'Pay Now'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">500+</div>
              <div className="text-gray-600 text-sm">Verified Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">1000+</div>
              <div className="text-gray-600 text-sm">Happy Couples</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">50+</div>
              <div className="text-gray-600 text-sm">Cities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;