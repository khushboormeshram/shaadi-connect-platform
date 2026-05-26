import React, { useState, useEffect } from 'react';
import { Star, MapPin, Phone, Heart, X, Mail, Calendar, Clock, IndianRupee, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import emailjs from '@emailjs/browser';

interface Vendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  price: string;
  image: string;
  specialties: string[];
  verified: boolean;
  description: string;
  portfolio: string[];
  contact: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface BookingData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventTime: string;
  deposit: string;
  paymentMethod: 'online' | '';
  upiId?: string;
  paymentId?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

interface BookingErrors {
  name?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  eventTime?: string;
  deposit?: string;
  paymentMethod?: string;
  upiId?: string;
}

const vendors: Vendor[] = [
  {
    id: 1,
    name: 'Royal Feast Catering',
    category: 'Catering',
    rating: 4.9,
    reviews: 156,
    location: 'Mumbai, Maharashtra',
    price: '₹800-1200/plate',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop',
    specialties: ['Indian Cuisine', 'Continental', 'Live Counters'],
    verified: true,
    description: 'Royal Feast Catering specializes in creating memorable dining experiences with a wide range of Indian and continental cuisines. Our live counters add a unique touch to your wedding celebrations.',
    portfolio: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop', 'https://kohinoor-joy.com/wp-content/uploads/2021/04/indian-food-.jpg'],
    contact: 'contact@royalfeast.com | +91 98765 43210'
  },
  {
    id: 2,
    name: 'Bloom & Blossom',
    category: 'Flowers & Decor',
    rating: 4.8,
    reviews: 89,
    location: 'Delhi, NCR',
    price: '₹50,000-2,00,000',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
    specialties: ['Mandap Decor', 'Floral Arrangements', 'Stage Design'],
    verified: true,
    description: 'Bloom & Blossom transforms venues with stunning floral arrangements and bespoke mandap designs, ensuring your wedding is a visual masterpiece.',
    portfolio: ['https://media.glamour.com/photos/5695b70ad9dab9ff41b3f29a/master/pass/weddings-2015-02-best-wedding-flowers-bridal-bouquets-0202-instagram-main.jpg', 'https://th.bing.com/th/id/OIP.ky0vPKDcp3oH8gdsqjOCoQHaLE?w=143&h=190&c=7&r=0&o=5&dpr=1.3&pid=1.7'],
    contact: 'info@bloomblossom.in | +91 87654 32109'
  },
  {
    id: 3,
    name: 'Capture Moments Studio',
    category: 'Photography',
    rating: 4.9,
    reviews: 234,
    location: 'Bangalore, Karnataka',
    price: '₹75,000-1,50,000',
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop',
    specialties: ['Candid Photography', 'Pre-wedding', 'Drone Shots'],
    verified: true,
    description: 'Capture Moments Studio excels in candid photography and cinematic pre-wedding shoots, capturing every moment of your special day with creativity and precision.',
    portfolio: ['https://tse2.mm.bing.net/th/id/OIP.fVayM3b3NI1KD6JTgLDhuAHaER?rs=1&pid=ImgDetMain&o=7&rm=3', 'https://tse2.mm.bing.net/th/id/OIP.0kCnvy1wT8rGiFLJ8BgV8AHaE8?rs=1&pid=ImgDetMain&o=7&rm=3'],
    contact: 'studio@capturemoments.com | +91 76543 21098'
  },
  {
    id: 4,
    name: 'Melody Masters',
    category: 'Music & DJ',
    rating: 4.7,
    reviews: 67,
    location: 'Pune, Maharashtra',
    price: '₹25,000-75,000',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    specialties: ['Live Band', 'DJ Services', 'Sound System'],
    verified: true,
    description: 'Melody Masters brings energy to your wedding with live bands and professional DJ services, ensuring your guests dance the night away.',
    portfolio: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&fit=crop', 'https://img.freepik.com/premium-photo/photo-dj-performing-live-highenergy-concert-captivating-crowd-with-their-music_964444-732.jpg'],
    contact: 'melody@masters.com | +91 65432 10987'
  },
  {
    id: 5,
    name: 'Eternal Venues',
    category: 'Venues',
    rating: 4.6,
    reviews: 120,
    location: 'Jaipur, Rajasthan',
    price: '₹1,00,000-5,00,000',
    image: 'https://www.jaypeehotels.com/images/wedding-page/shubh-vivah-mobile-banner-02.jpg',
    specialties: ['Banquet Halls', 'Outdoor Venues', 'Palace Weddings'],
    verified: true,
    description: 'Eternal Venues offers luxurious banquet halls and picturesque outdoor settings, including heritage palace venues, for a royal wedding experience.',
    portfolio: ['https://th.bing.com/th/id/OIP.RTwJRaA9zM2_5jvGBWqH3gHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', 'https://tse1.mm.bing.net/th/id/OIP.uMI3SN-H139Frs4065vr_QHaE7?rs=1&pid=ImgDetMain&o=7&rm=3'],
    contact: 'bookings@eternalvenues.in | +91 98765 12345'
  },
  {
    id: 6,
    name: 'Saree Elegance',
    category: 'Bridal Wear',
    rating: 4.8,
    reviews: 95,
    location: 'Chennai, Tamil Nadu',
    price: '₹20,000-1,00,000',
    image: 'https://tse1.explicit.bing.net/th/id/OIP.uxZVJQ87SwZgOFEnVjTq2QHaIM?rs=1&pid=ImgDetMain&o=7&rm=3',
    specialties: ['Lehengas', 'Sarees', 'Custom Designs'],
    verified: true,
    description: 'Saree Elegance offers exquisite lehengas and sarees with custom design services to make every bride look stunning on her big day.',
    portfolio: ['https://tse1.explicit.bing.net/th/id/OIP.vG1i3wpS3opS5MeLxwzwAAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3', 'https://i.pinimg.com/736x/78/a2/a1/78a2a1c1dada3e78d8b21eac83569a34.jpg'],
    contact: 'sales@sareeelegance.com | +91 87654 23456'
  },
  {
    id: 7,
    name: 'Glamour Glow',
    category: 'Makeup Artist',
    rating: 4.9,
    reviews: 180,
    location: 'Hyderabad, Telangana',
    price: '₹15,000-50,000',
    image: 'https://www.fabmood.com/inspiration/wp-content/uploads/2025/01/Bridal_Makeup_Looks_4722214-464x580.jpg',
    specialties: ['Bridal Makeup', 'Airbrush Makeup', 'HD Makeup'],
    verified: true,
    description: 'Glamour Glow provides top-tier bridal makeup services, specializing in airbrush and HD techniques to ensure a flawless look.',
    portfolio: ['https://www.itakeyou.co.uk/idea/wp-content/uploads/2024/10/Bridal-Makeup-Looks-for-Every-Hair-Colour-32.jpg', 'https://tse2.mm.bing.net/th/id/OIP.UVEWosG5kDQiaW-2dxjgVgAAAA?w=474&h=582&rs=1&pid=ImgDetMain&o=7&rm=3'],
    contact: 'glamour@glow.com | +91 76543 34567'
  },
  {
    id: 8,
    name: 'Dream Day Planners',
    category: 'Event Planning',
    rating: 4.7,
    reviews: 110,
    location: 'Kolkata, West Bengal',
    price: '₹50,000-2,50,000',
    image: 'https://www.wedding-spot.com/blog/sites/wsblog/files/wedding%20planners%20posing%20with%20wedding%20reception%20setup%20in%20background.jpg',
    specialties: ['Full Planning', 'Theme Weddings', 'Logistics'],
    verified: true,
    description: 'Dream Day Planners takes care of every detail, from theme weddings to logistics, ensuring a stress-free and unforgettable celebration.',
    portfolio: ['https://muchosnegociosrentables.com/wp-content/uploads/2016/05/wedding-planner-y-novia.jpg', 'https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2020/11/Insides-3.jpg'],
    contact: 'events@dreamday.in | +91 65432 45678'
  }
];

const FeaturedVendors: React.FC = () => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventTime: '',
    deposit: '',
    paymentMethod: '',
    upiId: '',
    paymentId: ''
  });
  const [errors, setErrors] = useState<BookingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState<boolean>(false);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

  const displayedVendors = showAll ? vendors : vendors.slice(0, 4);

  // Regex patterns for validation
  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+91[6-9]\d{9}$/;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded');
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      alert('Failed to load payment gateway. Please try again later.');
      setScriptLoaded(false);
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const openContactModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowContactModal(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setFormErrors({});
  };

  const openDetailsModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowDetailsModal(true);
    setBookingData({
      name: '',
      email: '',
      phone: '',
      eventDate: '',
      eventTime: '',
      deposit: '',
      paymentMethod: '',
      upiId: '',
      paymentId: ''
    });
    setErrors({});
    setIsPaymentCompleted(false);
  };

  const openBookingModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowBookingModal(true);
    setBookingData({
      name: '',
      email: '',
      phone: '',
      eventDate: '',
      eventTime: '',
      deposit: '',
      paymentMethod: '',
      upiId: '',
      paymentId: ''
    });
    setErrors({});
    setIsPaymentCompleted(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate input
    const newErrors: FormErrors = { ...formErrors };
    if (name === 'name') {
      if (!value) {
        newErrors.name = 'Name is required';
      } else if (!nameRegex.test(value)) {
        newErrors.name = 'Name should contain only letters and spaces (2-50 characters)';
      } else {
        delete newErrors.name;
      }
    } else if (name === 'email') {
      if (!value) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(value)) {
        newErrors.email = 'Invalid email format';
      } else {
        delete newErrors.email;
      }
    } else if (name === 'phone') {
      if (!value) {
        newErrors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(value)) {
        newErrors.phone = 'Invalid phone number (e.g., +91xxxxxxxxxx)';
      } else {
        delete newErrors.phone;
      }
    } else if (name === 'message') {
      if (!value) {
        newErrors.message = 'Message is required';
      } else {
        delete newErrors.message;
      }
    }
    setFormErrors(newErrors);
  };

  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = 'target' in e ? e.target : e;
    setBookingData({
      ...bookingData,
      [name]: value
    });

    // Validate input
    const newErrors: BookingErrors = { ...errors };
    if (name === 'name') {
      if (!value) {
        newErrors.name = 'Name is required';
      } else if (!nameRegex.test(value)) {
        newErrors.name = 'Name should contain only letters and spaces (2-50 characters)';
      } else {
        delete newErrors.name;
      }
    } else if (name === 'email') {
      if (!value) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(value)) {
        newErrors.email = 'Invalid email format';
      } else {
        delete newErrors.email;
      }
    } else if (name === 'phone') {
      if (!value) {
        newErrors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(value)) {
        newErrors.phone = 'Invalid phone number (e.g., +91xxxxxxxxxx)';
      } else {
        delete newErrors.phone;
      }
    } else if (name === 'eventDate') {
      if (!value) newErrors.eventDate = 'Event date is required';
      else delete newErrors.eventDate;
    } else if (name === 'eventTime') {
      if (!value) newErrors.eventTime = 'Event time is required';
      else delete newErrors.eventTime;
    } else if (name === 'deposit') {
      if (!value) newErrors.deposit = 'Deposit amount is required';
      else if (isNaN(Number(value)) || Number(value) <= 0) {
        newErrors.deposit = 'Deposit amount must be a positive number';
      } else {
        delete newErrors.deposit;
      }
    } else if (name === 'paymentMethod') {
      if (!value) newErrors.paymentMethod = 'Payment method is required';
      else delete newErrors.paymentMethod;
    } else if (name === 'upiId') {
      if (bookingData.paymentMethod === 'online' && !value) {
        newErrors.upiId = 'UPI ID is required';
      } else {
        delete newErrors.upiId;
      }
    }
    setErrors(newErrors);
  };

  const validateBookingForm = (): boolean => {
    const newErrors: BookingErrors = {};
    if (!bookingData.name) newErrors.name = 'Name is required';
    else if (!nameRegex.test(bookingData.name)) newErrors.name = 'Name should contain only letters and spaces (2-50 characters)';
    if (!bookingData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(bookingData.email)) newErrors.email = 'Invalid email format';
    if (!bookingData.phone) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(bookingData.phone)) newErrors.phone = 'Invalid phone number (e.g., +91xxxxxxxxxx)';
    if (!bookingData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!bookingData.eventTime) newErrors.eventTime = 'Event time is required';
    if (!bookingData.deposit) newErrors.deposit = 'Deposit amount is required';
    else if (isNaN(Number(bookingData.deposit)) || Number(bookingData.deposit) <= 0) {
      newErrors.deposit = 'Deposit amount must be a positive number';
    }
    if (!bookingData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    if (bookingData.paymentMethod === 'online' && !bookingData.upiId) {
      newErrors.upiId = 'UPI ID is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    const newErrors: FormErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    else if (!nameRegex.test(formData.name)) newErrors.name = 'Name should contain only letters and spaces (2-50 characters)';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number (e.g., +91xxxxxxxxxx)';
    if (!formData.message) newErrors.message = 'Message is required';

    setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Contact form submitted:', { vendor: selectedVendor?.name, ...formData });
      alert('Your inquiry has been submitted successfully!');
      setShowContactModal(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setFormErrors({});
    } else {
      alert('Please correct the errors in the form.');
    }
  };

  const initiateRazorpayPayment = async () => {
    if (!scriptLoaded) {
      alert('Payment gateway is not loaded. Please try again later.');
      return;
    }

    if (!validateBookingForm()) {
      return;
    }

    if (!selectedVendor || !selectedVendor.name || !bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.eventDate || !bookingData.eventTime || !bookingData.deposit) {
      console.error('Missing required fields:', {
        vendor: selectedVendor,
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        eventDate: bookingData.eventDate,
        eventTime: bookingData.eventTime,
        deposit: bookingData.deposit
      });
      alert('Please fill all required booking details.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Initiating Razorpay payment...');
      const amountInPaise = Math.round(Number(bookingData.deposit) * 100);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const text = await response.text();
      console.log('Raw response:', text);

      let order;
      try {
        order = JSON.parse(text);
      } catch (e) {
        console.error('JSON parse error:', e);
        alert('Invalid response from server. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        console.error('Backend error:', order.error || text);
        alert('Backend error: ' + (order.error || 'Failed to create order'));
        setIsSubmitting(false);
        return;
      }

      if (!order.id) {
        console.error('No order ID:', order);
        alert('Failed to create order: No order ID');
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: selectedVendor.name,
        description: `Deposit for ${selectedVendor.name} - Wedding Booking`,
        handler: async function (response: any) {
          console.log('Payment response:', response);

          try {
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
              signal: new AbortController().signal
            });

            const verificationResult = await verifyResponse.json();
            console.log('Verification result:', verificationResult);

            if (verificationResult.status === 'ok') {
              setBookingData((prev) => ({
                ...prev,
                paymentId: response.razorpay_payment_id
              }));
              setIsPaymentCompleted(true);
              alert('Payment successful! Please click Confirm Booking to finalize.');
            } else {
              alert('Payment verification failed: ' + (verificationResult.error || 'Unknown error'));
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Error verifying payment: ' + (error as Error).message);
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: bookingData.name || 'Customer',
          email: bookingData.email || 'customer@example.com',
          contact: bookingData.phone || '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function () {
            console.log('Payment modal closed');
            alert('Payment modal closed without completing payment.');
            setIsSubmitting(false);
          },
        },
        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false,
        },
      };

      console.log('Opening Razorpay Checkout with options:', options);
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        alert('Payment failed: ' + response.error.description);
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      if (error.name === 'AbortError') {
        alert('Payment request timed out. Please try again.');
      } else {
        alert('Error initiating payment: ' + error.message);
      }
      setIsSubmitting(false);
    }
  };

  const handleBookingSubmit = async () => {
    if (!isPaymentCompleted || !bookingData.paymentId) {
      alert('Please complete the payment before confirming the booking.');
      return;
    }

    setIsSubmitting(true);

    try {
      const emailParams = {
        to_email: 'harshranjan215@gmail.com',
        customer_name: bookingData.name,
        customer_email: bookingData.email,
        customer_phone: bookingData.phone,
        vendor_name: selectedVendor!.name,
        event_date: bookingData.eventDate,
        event_time: bookingData.eventTime,
        deposit: `₹${bookingData.deposit}`,
        payment_method: `UPI (${bookingData.upiId || 'N/A'})`,
        razorpay_payment_id: bookingData.paymentId,
      };

      await emailjs.send('service_84tlz45', 'template_uerk9bn', emailParams, 'IxOEsFVvtMZiXxQrM');
      alert(
        `Booking confirmed for ${selectedVendor!.name}\n` +
        `Customer: ${bookingData.name}\n` +
        `Email: ${bookingData.email}\n` +
        `Phone: ${bookingData.phone}\n` +
        `Date: ${bookingData.eventDate}\n` +
        `Time: ${bookingData.eventTime}\n` +
        `Deposit: ₹${bookingData.deposit}\n` +
        `Payment Method: UPI (${bookingData.upiId || 'N/A'})\n` +
        `Payment ID: ${bookingData.paymentId}\n` +
        `A confirmation email has been sent to harshranjan215@gmail.com`
      );

      setShowDetailsModal(false);
      setShowBookingModal(false);
      setBookingData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        eventTime: '',
        deposit: '',
        paymentMethod: '',
        upiId: '',
        paymentId: ''
      });
      setErrors({});
      setIsPaymentCompleted(false);
    } catch (error) {
      console.error('Email sending failed:', error);
      alert(`Failed to send confirmation email: ${(error as Error).message || 'Unknown error'}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="vendors" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 animate-fade-in-down tracking-tight">
            Featured Vendors
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our curated selection of top-tier vendors, each with exceptional ratings and verified credentials to make your wedding unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayedVendors.map((vendor) => (
            <Card
              key={vendor.id}
              className="group bg-white/90 backdrop-blur-sm border-none shadow-md hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden transform hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-rose-500 text-white font-semibold px-4 py-1.5 rounded-full hover:bg-rose-600 transition-colors duration-300">
                    {vendor.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Button size="sm" variant="ghost" className="bg-white/95 hover:bg-white text-rose-500 p-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                {vendor.verified && (
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-emerald-500 text-white font-semibold px-4 py-1.5 rounded-full shadow-sm">
                      ✓ Verified
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-rose-500 transition-colors duration-300 truncate">
                    {vendor.name}
                  </h3>
                  <div className="flex items-center space-x-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">{vendor.rating}</span>
                    <span className="text-sm text-gray-500">({vendor.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 text-rose-500" />
                  <span className="text-sm font-medium">{vendor.location}</span>
                </div>

                <div>
                  <p className="text-lg font-semibold text-rose-600">{vendor.price}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {vendor.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 font-medium px-3 py-1 rounded-full">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 min-w-[100px] border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold rounded-full py-2.5 transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={() => openContactModal(vendor)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button
                    className="flex-1 min-w-[100px] bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 font-semibold rounded-full py-2.5 shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() => openDetailsModal(vendor)}
                  >
                    Details
                  </Button>
                  <Button
                    className="flex-1 min-w-[100px] bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 font-semibold rounded-full py-2.5 shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() => openBookingModal(vendor)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-10 py-3.5 text-lg font-semibold rounded-full hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={toggleShowAll}
          >
            {showAll ? 'View Less' : 'View More'}
          </Button>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in transition-opacity duration-500">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 max-w-md sm:max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-2xl transform transition-transform duration-500 scale-95 animate-scale-in">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-300 bg-gray-100 rounded-full p-2.5 shadow-sm hover:shadow-md"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
              Contact {selectedVendor?.name}
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className={`w-full px-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                  placeholder="Your Name"
                  required
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1.5">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                  placeholder="Your Email"
                  required
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1.5">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className={`w-full px-4 py-3 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                  placeholder="+91xxxxxxxxxx"
                  required
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1.5">{formErrors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  className={`w-full px-4 py-3 border ${formErrors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                  placeholder="Your Message"
                  rows={5}
                  required
                />
                {formErrors.message && <p className="text-red-500 text-xs mt-1.5">{formErrors.message}</p>}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 font-semibold rounded-full py-3.5 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleFormSubmit}
                disabled={isSubmitting}
              >
                Submit Inquiry
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in transition-opacity duration-500">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 max-w-lg sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl transform transition-transform duration-500 scale-95 animate-scale-in">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-300 bg-gray-100 rounded-full p-2.5 shadow-sm hover:shadow-md"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
              {selectedVendor?.name}
            </h3>
            <img
              src={selectedVendor?.image}
              alt={selectedVendor?.name}
              className="w-full h-72 object-cover rounded-xl mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">About</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedVendor?.description}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Portfolio</h4>
                <div className="grid grid-cols-3 gap-4">
                  {selectedVendor?.portfolio.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-28 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
                    />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Contact</h4>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-rose-500" />
                  {selectedVendor?.contact}
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVendor?.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 font-medium px-3 py-1 rounded-full">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Book Now</h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={bookingData.name}
                      onChange={handleBookingChange}
                      className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                      placeholder="Your Name"
                      required
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleBookingChange}
                      className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                      placeholder="Your Email"
                      required
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleBookingChange}
                      className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                      placeholder="+91xxxxxxxxxx"
                      required
                      disabled={isSubmitting}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-300">
                      Event Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="eventDate"
                        value={bookingData.eventDate}
                        onChange={handleBookingChange}
                        className={`w-full pl-10 pr-4 py-3 border ${errors.eventDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.eventDate && <p className="text-red-500 text-xs mt-1.5">{errors.eventDate}</p>}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-300">
                      Event Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="time"
                        name="eventTime"
                        value={bookingData.eventTime}
                        onChange={handleBookingChange}
                        className={`w-full pl-10 pr-4 py-3 border ${errors.eventTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.eventTime && <p className="text-red-500 text-xs mt-1.5">{errors.eventTime}</p>}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-300">
                      Deposit Amount (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        name="deposit"
                        value={bookingData.deposit}
                        onChange={handleBookingChange}
                        className={`w-full pl-10 pr-4 py-3 border ${errors.deposit ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                        placeholder="Enter deposit amount"
                        min="0"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.deposit && <p className="text-red-500 text-xs mt-1.5">{errors.deposit}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                    <div className="grid grid-cols-1 gap-4">
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${bookingData.paymentMethod === 'online'
                          ? 'border-rose-500 bg-rose-50 shadow-md'
                          : 'border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          if (!isSubmitting) {
                            handleBookingChange({ target: { name: 'paymentMethod', value: 'online' } });
                            initiateRazorpayPayment();
                          }
                        }}
                      >
                        <CreditCard className="h-6 w-6 text-rose-500 mb-2 mx-auto" />
                        <p className="text-sm font-semibold text-gray-800 text-center">
                          {isSubmitting ? 'Processing Payment...' : 'Pay with UPI'}
                        </p>
                      </div>
                    </div>
                    {errors.paymentMethod && <p className="text-red-500 text-xs mt-1.5">{errors.paymentMethod}</p>}
                  </div>
                  {bookingData.paymentMethod === 'online' && (
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="upiId"
                          value={bookingData.upiId}
                          onChange={handleBookingChange}
                          className={`w-full pl-10 pr-4 py-3 border ${errors.upiId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                          placeholder="Enter UPI ID (e.g., name@upi)"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.upiId && <p className="text-red-500 text-xs mt-1.5">{errors.upiId}</p>}
                    </div>
                  )}
                  {(bookingData.name || bookingData.email || bookingData.phone || bookingData.eventDate || bookingData.eventTime || bookingData.deposit || bookingData.paymentMethod || bookingData.paymentId) && (
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Booking Summary</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Vendor:</strong> {selectedVendor?.name}</p>
                        {bookingData.name && <p><strong>Name:</strong> {bookingData.name}</p>}
                        {bookingData.email && <p><strong>Email:</strong> {bookingData.email}</p>}
                        {bookingData.phone && <p><strong>Phone:</strong> {bookingData.phone}</p>}
                        {bookingData.eventDate && <p><strong>Date:</strong> {bookingData.eventDate}</p>}
                        {bookingData.eventTime && <p><strong>Time:</strong> {bookingData.eventTime}</p>}
                        {bookingData.deposit && <p><strong>Deposit:</strong> ₹{bookingData.deposit}</p>}
                        {bookingData.paymentMethod && <p><strong>Payment Method:</strong> UPI</p>}
                        {bookingData.upiId && <p><strong>UPI ID:</strong> {bookingData.upiId}</p>}
                        {bookingData.paymentId && <p><strong>Payment ID:</strong> {bookingData.paymentId}</p>}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold rounded-full py-3.5 shadow-sm hover:shadow-md transition-all duration-300"
                      onClick={() => setShowDetailsModal(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 font-semibold rounded-full py-3.5 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleBookingSubmit}
                      disabled={isSubmitting || !isPaymentCompleted}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Confirm Booking'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 font-semibold rounded-full py-3.5 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    setShowDetailsModal(false);
                    openContactModal(selectedVendor!);
                  }}
                  disabled={isSubmitting}
                >
                  Contact Vendor
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookingModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in transition-opacity duration-500">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 max-w-md sm:max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-2xl transform transition-transform duration-500 scale-95 animate-scale-in">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-300 bg-gray-100 rounded-full p-2.5 shadow-sm hover:shadow-md"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
              Book {selectedVendor?.name}
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={bookingData.name}
                  onChange={handleBookingChange}
                  className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                  placeholder="Your Name"
                  required
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleBookingChange}
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                  placeholder="Your Email"
                  required
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleBookingChange}
                  className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                  placeholder="+91xxxxxxxxxx"
                  required
                  disabled={isSubmitting}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-300">
                  Event Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="eventDate"
                    value={bookingData.eventDate}
                    onChange={handleBookingChange}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.eventDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {errors.eventDate && <p className="text-red-500 text-xs mt-1.5">{errors.eventDate}</p>}
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-300">
                  Event Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="time"
                    name="eventTime"
                    value={bookingData.eventTime}
                    onChange={handleBookingChange}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.eventTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {errors.eventTime && <p className="text-red-500 text-xs mt-1.5">{errors.eventTime}</p>}
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-300">
                  Deposit Amount (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="deposit"
                    value={bookingData.deposit}
                    onChange={handleBookingChange}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.deposit ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                    placeholder="Enter deposit amount"
                    min="0"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {errors.deposit && <p className="text-red-500 text-xs mt-1.5">{errors.deposit}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-1 gap-4">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${bookingData.paymentMethod === 'online'
                      ? 'border-rose-500 bg-rose-50 shadow-md'
                      : 'border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (!isSubmitting) {
                        handleBookingChange({ target: { name: 'paymentMethod', value: 'online' } });
                        initiateRazorpayPayment();
                      }
                    }}
                  >
                    <CreditCard className="h-6 w-6 text-rose-500 mb-2 mx-auto" />
                    <p className="text-sm font-semibold text-gray-800 text-center">
                      {isSubmitting ? 'Processing Payment...' : 'Pay with UPI'}
                    </p>
                  </div>
                </div>
                {errors.paymentMethod && <p className="text-red-500 text-xs mt-1.5">{errors.paymentMethod}</p>}
              </div>
              {bookingData.paymentMethod === 'online' && (
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="upiId"
                      value={bookingData.upiId}
                      onChange={handleBookingChange}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.upiId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md`}
                      placeholder="Enter UPI ID (e.g., name@upi)"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.upiId && <p className="text-red-500 text-xs mt-1.5">{errors.upiId}</p>}
                </div>
              )}
              {(bookingData.name || bookingData.email || bookingData.phone || bookingData.eventDate || bookingData.eventTime || bookingData.deposit || bookingData.paymentMethod || bookingData.paymentId) && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Vendor:</strong> {selectedVendor?.name}</p>
                    {bookingData.name && <p><strong>Name:</strong> {bookingData.name}</p>}
                    {bookingData.email && <p><strong>Email:</strong> {bookingData.email}</p>}
                    {bookingData.phone && <p><strong>Phone:</strong> {bookingData.phone}</p>}
                    {bookingData.eventDate && <p><strong>Date:</strong> {bookingData.eventDate}</p>}
                    {bookingData.eventTime && <p><strong>Time:</strong> {bookingData.eventTime}</p>}
                    {bookingData.deposit && <p><strong>Deposit:</strong> ₹{bookingData.deposit}</p>}
                    {bookingData.paymentMethod && <p><strong>Payment Method:</strong> UPI</p>}
                    {bookingData.upiId && <p><strong>UPI ID:</strong> {bookingData.upiId}</p>}
                    {bookingData.paymentId && <p><strong>Payment ID:</strong> {bookingData.paymentId}</p>}
                  </div>
                </div>
              )}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold rounded-full py-3.5 shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => setShowBookingModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 font-semibold rounded-full py-3.5 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleBookingSubmit}
                  disabled={isSubmitting || !isPaymentCompleted}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedVendors;