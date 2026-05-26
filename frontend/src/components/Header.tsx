import React, { useState, useEffect } from 'react';
import { Heart, Menu, Search, User, X, Eye, EyeOff, Mail, Lock, Phone, Calendar, MapPin, Briefcase, GraduationCap, Trash2, Plus, BarChart2, Users, Package, DollarSign } from 'lucide-react';
import axios from 'axios';

// TypeScript interfaces
interface User {
  id?: string;
  name?: string;
  role?: 'admin' | 'user';
  email?: string;
}

interface Vendor {
  id: string;
  name: string;
  service: string;
  contact: string;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  occupation: string;
  education: string;
  religion: string;
  motherTongue: string;
  newPassword: string;
  confirmNewPassword: string;
  vendorName: string;
  vendorService: string;
  vendorContact: string;
  securityAnswer: string;
}

interface DashboardStats {
  totalVendors: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
}

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const Header: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [securityVerified, setSecurityVerified] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search vendors, services...');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    occupation: '',
    education: '',
    religion: '',
    motherTongue: '',
    newPassword: '',
    confirmNewPassword: '',
    vendorName: '',
    vendorService: '',
    vendorContact: '',
    securityAnswer: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalVendors: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  // Regex patterns for validation
  const validationRules: Partial<Record<keyof FormData, {
    pattern: RegExp;
    message: string;
    customValidation?: (value: string) => boolean;
    customMessage?: string;
  }>> = {
    email: {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Please enter a valid email address'
    },
    password: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: 'Password must be 8+ characters with uppercase, lowercase, number, and special character'
    },
    firstName: {
      pattern: /^[a-zA-Z]{2,30}$/,
      message: 'First name must be 2-30 letters only'
    },
    lastName: {
      pattern: /^[a-zA-Z]{2,30}$/,
      message: 'Last name must be 2-30 letters only'
    },
    phone: {
      pattern: /^[+]?[1-9]\d{1,14}$/,
      message: 'Please enter a valid phone number (10-15 digits)'
    },
    dateOfBirth: {
      pattern: /^\d{4}-\d{2}-\d{2}$/,
      message: 'Please select your date of birth',
      customValidation: (value: string) => {
        if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
        const birthDate = new Date(value);
        if (isNaN(birthDate.getTime())) return false;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age >= 18 && age <= 100;
      },
      customMessage: 'You must be between 18 and 100 years old'
    },
    city: {
      pattern: /^[a-zA-Z\s]{2,50}$/,
      message: 'City name must be 2-50 letters only'
    },
    occupation: {
      pattern: /^[a-zA-Z\s]{2,50}$/,
      message: 'Occupation must be 2-50 letters only'
    },
    education: {
      pattern: /^[a-zA-Z\s.]{2,100}$/,
      message: 'Education must be 2-100 characters (letters, spaces, dots only)'
    },
    motherTongue: {
      pattern: /^[a-zA-Z\s]{2,30}$/,
      message: 'Mother tongue must be 2-30 letters only'
    },
    securityAnswer: {
      pattern: /^[a-zA-Z0-9\s]{2,50}$/,
      message: 'Security answer must be 2-50 characters (letters, numbers, spaces only)'
    },
    vendorName: {
      pattern: /^[a-zA-Z\s&.'-]{2,100}$/,
      message: 'Vendor name must be 2-100 characters (letters, spaces, &, ., \', - only)'
    },
    vendorService: {
      pattern: /^[a-zA-Z\s,&.'-]{2,100}$/,
      message: 'Service must be 2-100 characters (letters, spaces, commas, &, ., \', - only)'
    },
    vendorContact: {
      pattern: /^[+]?[1-9]\d{1,14}$/,
      message: 'Please enter a valid contact number (10-15 digits)'
    }
  };

  const placeholders = [
    'Search vendors, services...',
    'Find your dream venue...',
    'Discover top caterers...',
    'Explore wedding planners...',
    'Book perfect photographers...'
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setSearchPlaceholder(placeholders[index]);
      index = (index + 1) % placeholders.length;
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get<{ user: User }>('/api/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        if (response.data?.user) {
          setIsLoggedIn(true);
          setUserInfo(response.data.user);
          if (response.data.user.role === 'admin') {
            fetchVendors();
            fetchDashboardStats();
          }
        }
      }).catch(err => {
        console.error('Token verification failed:', err);
        localStorage.removeItem('token');
      });
    }
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get<{ vendors: Vendor[] }>('/api/vendors', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setVendors(response.data.vendors || [] || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch vendors');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get<{ totalVendors: number; totalUsers: number; totalBookings: number; totalRevenue: number }>('/api/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDashboardStats(response.data || { totalVendors: 0, totalUsers: 0, totalBookings: 0, totalRevenue: 0 });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard stats');
    }
  };

  const validateField = (name: keyof FormData, value: string): string => {
    const rule = validationRules[name];
    if (!rule) return '';

    if (!value || value.trim() === '') {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (!rule.pattern.test(value)) {
      return rule.message;
    }

    if (rule.customValidation && !rule.customValidation(value)) {
      return rule.customMessage || rule.message;
    }

    if (name === 'confirmPassword' && value !== formData.password) {
      return 'Passwords do not match';
    }

    if (name === 'confirmNewPassword' && value !== formData.newPassword) {
      return 'Passwords do not match';
    }

    return '';
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    let fieldsToValidate: (keyof FormData)[] = [];

    if (isLogin && !forgotPassword) {
      fieldsToValidate = ['email', 'password'];
    } else if (forgotPassword && !securityVerified) {
      fieldsToValidate = ['email', 'securityAnswer'];
    } else if (forgotPassword && securityVerified) {
      fieldsToValidate = ['newPassword', 'confirmNewPassword'];
    } else {
      fieldsToValidate = [
        'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
        'gender', 'city', 'occupation', 'education', 'religion',
        'motherTongue', 'password', 'confirmPassword', 'securityAnswer'
      ];
    }

    fieldsToValidate.forEach(field => {
      if (field === 'gender' || field === 'religion') {
        if (!formData[field]) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
      } else {
        const error = validateField(field, formData[field]);
        if (error) {
          errors[field] = error;
        }
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateVendorForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    const fieldsToValidate: (keyof FormData)[] = ['vendorName', 'vendorService', 'vendorContact'];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Invalid Account');
      return;
    }

    try {
      if (isLogin) {
        const response = await axios.post<{ token: string; user: User }>(`${API_BASE_URL}/login`, {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.data.token);
        setUserInfo(response.data.user);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        resetForm();
        if (response.data.user.role === 'admin') {
          fetchVendors();
          fetchDashboardStats();
        }
      } else if (forgotPassword && securityVerified) {
        const response = await axios.post(`${API_BASE_URL}/reset-password`, {
          email: formData.email,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword
        });
        setShowLoginModal(false);
        resetForm();
        alert('Password reset successful! Please log in.');
      } else if (forgotPassword) {
        const response = await axios.post(`${API_BASE_URL}/verify-security-answer`, {
          email: formData.email,
          securityAnswer: formData.securityAnswer
        });
        setSecurityVerified(true);
      } else {
        const response = await axios.post<{ token: string; user: User }>(`${API_BASE_URL}/signup`, {
          ...formData
        });
        localStorage.setItem('token', response.data.token);
        setUserInfo(response.data.user);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        resetForm();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleAddVendor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateVendorForm()) {
      setError('Please fix the errors below');
      return;
    }

    try {
      await axios.post(
        '/api/vendors',
        {
          name: formData.vendorName,
          service: formData.vendorService,
          contact: formData.vendorContact
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setShowAddVendor(false);
      resetForm();
      fetchVendors();
      fetchDashboardStats();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add vendor');
    }
  };

  const handleRemoveVendor = async (vendorId: string) => {
    try {
      await axios.delete(`/api/vendors/${vendorId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchVendors();
      fetchDashboardStats();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove vendor');
    }
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
    setIsLogin(false);
    resetForm();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserInfo(null);
    setVendors([]);
    setDashboardStats({ totalVendors: 0, totalUsers: 0, totalBookings: 0, totalRevenue: 0 });
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      city: '',
      occupation: '',
      education: '',
      religion: '',
      motherTongue: '',
      newPassword: '',
      confirmNewPassword: '',
      vendorName: '',
      vendorService: '',
      vendorContact: '',
      securityAnswer: ''
    });
    setSecurityVerified(false);
    setError('');
    setFieldErrors({});
    setShowAddVendor(false);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setIsLogin(true);
    resetForm();
  };

  const openSignupModal = () => {
    setShowLoginModal(true);
    setIsLogin(false);
    resetForm();
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border-b border-rose-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          {userInfo?.role === 'admin' ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl shadow-md">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    Shaadi Mubaraak Admin
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">
                    Vendor Management Portal
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddVendor(true)}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold px-6 py-2.5 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                  aria-label="Add new vendor"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Vendor</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 font-semibold hover:text-pink-600 transition-colors duration-300 px-4 py-2.5 rounded-lg hover:bg-pink-50"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl shadow-md">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    Shaadi Mubaraak
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">
                    Begin Your Beautiful Journey
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    placeholder={searchPlaceholder}
                    className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white shadow-sm text-base font-medium transition-all duration-300 hover:shadow-md"
                    aria-label="Search vendors and services"
                  />
                </div>
              </div>

              <nav className="hidden lg:flex items-center space-x-8">
                <a
                  href="#featured-vendors"
                  className="text-gray-700 font-semibold hover:text-pink-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-pink-50"
                >
                  Find Vendors
                </a>
                {['Services', 'About'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-700 font-semibold hover:text-pink-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-pink-50"
                  >
                    {item}
                  </a>
                ))}

                {isLoggedIn ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-2 rounded-lg border border-rose-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-semibold text-sm">
                        Hi, {userInfo?.name || 'User'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 font-semibold hover:text-pink-600 transition-colors duration-300 px-4 py-2.5 rounded-lg hover:bg-pink-50"
                      aria-label="Logout"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={openLoginModal}
                      className="border-2 border-pink-400 text-pink-600 font-semibold px-5 py-2.5 rounded-lg hover:bg-pink-50 hover:border-pink-500 transition-all duration-300 flex items-center space-x-2"
                      aria-label="Login"
                    >
                      <User className="h-4 w-4" />
                      <span>Login</span>
                    </button>
                    <button
                      onClick={openSignupModal}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                      aria-label="Sign Up"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </nav>

              <button className="lg:hidden p-2 hover:bg-pink-50 rounded-lg transition-colors duration-300" aria-label="Open menu">
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          )}

          {userInfo?.role !== 'admin' && (
            <div className="md:hidden mt-4">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  placeholder={searchPlaceholder}
                  className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white shadow-sm text-base font-medium transition-all duration-300 hover:shadow-md"
                  aria-label="Search vendors and services"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {userInfo?.role === 'admin' && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 animate-fade-in">Admin Dashboard</h2>
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium animate-in fade-in">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-slide-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Vendors</p>
                  <h3 className="text-2xl font-bold text-gray-800">{dashboardStats.totalVendors}</h3>
                </div>
                <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Users</p>
                  <h3 className="text-2xl font-bold text-gray-800">{dashboardStats.totalUsers}</h3>
                </div>
                <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
                  <h3 className="text-2xl font-bold text-gray-800">{dashboardStats.totalBookings}</h3>
                </div>
                <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-slide-in-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-gray-800">${dashboardStats.totalRevenue}</h3>
                </div>
                <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Vendor Management</h3>
            {vendors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Vendor Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Service</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Contact</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map(vendor => (
                      <tr key={vendor.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800 font-medium">{vendor.name}</td>
                        <td className="px-4 py-3 text-gray-600">{vendor.service}</td>
                        <td className="px-4 py-3 text-gray-600">{vendor.contact}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleRemoveVendor(vendor.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No vendors found.</p>
            )}
          </div>
        </div>
      )}

      {showAddVendor && userInfo?.role === 'admin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-center relative">
              <button
                onClick={() => setShowAddVendor(false)}
                className="absolute top-4 right-4 text-white hover:text-pink-100 transition-colors duration-200 p-1 hover:bg-white/20 rounded-lg"
                aria-label="Close add vendor modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center mb-3">
                <Heart className="w-7 h-7 text-white mr-3" />
                <h1 className="text-xl font-bold text-white">Add New Vendor</h1>
              </div>
              <p className="text-pink-100 text-sm">Expand your vendor network</p>
            </div>

            <form onSubmit={handleAddVendor} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="vendorName"
                  placeholder="Vendor Name"
                  value={formData.vendorName}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.vendorName ? 'border-red-500' : 'border-gray-200'
                    }`}
                  aria-label="Vendor name"
                />
                {fieldErrors.vendorName && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.vendorName}</p>
                )}
              </div>

              <div className="relative">
                <Briefcase className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="vendorService"
                  placeholder="Service (e.g., Catering, Photography)"
                  value={formData.vendorService}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.vendorService ? 'border-red-500' : 'border-gray-200'
                    }`}
                  aria-label="Vendor service"
                />
                {fieldErrors.vendorService && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.vendorService}</p>
                )}
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="vendorContact"
                  placeholder="Contact Details"
                  value={formData.vendorContact}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.vendorContact ? 'border-red-500' : 'border-gray-200'
                    }`}
                  aria-label="Vendor contact"
                />
                {fieldErrors.vendorContact && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.vendorContact}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label="Add vendor"
              >
                Add Vendor
              </button>
            </form>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 p-8">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Shaadi Mubaraak
                  </h1>
                  <p className="text-gray-600 font-medium">Your Path to Forever</p>
                </div>

                <div className="flex bg-gray-50 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => { setIsLogin(true); setForgotPassword(false); resetForm(); }}
                    className={`flex-1 py-3 text-center font-semibold rounded-md transition-all duration-300 ${isLogin && !forgotPassword
                      ? 'text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-md'
                      : 'text-gray-700 hover:text-pink-600'
                      }`}
                    aria-label="Switch to login"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setIsLogin(false); setForgotPassword(false); resetForm(); }}
                    className={`flex-1 py-3 text-center font-semibold rounded-md transition-all duration-300 ${!isLogin && !forgotPassword
                      ? 'text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-md'
                      : 'text-gray-700 hover:text-pink-600'
                      }`}
                    aria-label="Switch to sign up"
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                      {error}
                    </div>
                  )}

                  {(isLogin || forgotPassword) && (
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.email ? 'border-red-500' : 'border-gray-200'
                          }`}
                        aria-label="Email address"
                      />
                      {fieldErrors.email && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                      )}
                    </div>
                  )}

                  {forgotPassword ? (
                    securityVerified ? (
                      <>
                        <div className="text-center text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          Enter your new password below.
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            placeholder="New Password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.newPassword ? 'border-red-500' : 'border-gray-200'
                              }`}
                            aria-label="New password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                          {fieldErrors.newPassword && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.newPassword}</p>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmNewPassword"
                            placeholder="Confirm New Password"
                            value={formData.confirmNewPassword}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.confirmNewPassword ? 'border-red-500' : 'border-gray-200'
                              }`}
                            aria-label="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                          >
                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                          </button>
                          {fieldErrors.confirmNewPassword && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmNewPassword}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          Answer the security question to reset your password.
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="securityAnswer"
                            placeholder="What was your childhood nickname?"
                            value={formData.securityAnswer}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.securityAnswer ? 'border-red-500' : 'border-gray-200'
                              }`}
                            aria-label="Security answer"
                          />
                          {fieldErrors.securityAnswer && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.securityAnswer}</p>
                          )}
                        </div>
                      </>
                    )
                  ) : isLogin ? (
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.password ? 'border-red-500' : 'border-gray-200'
                          }`}
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                      {fieldErrors.password && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.firstName ? 'border-red-500' : 'border-gray-200'
                              }`}
                            aria-label="First name"
                          />
                          {fieldErrors.firstName && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>
                          )}
                        </div>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.lastName ? 'border-red-500' : 'border-gray-200'
                              }`}
                            aria-label="Last name"
                          />
                          {fieldErrors.lastName && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.email ? 'border-red-500' : 'border-gray-200'
                            }`}
                          aria-label="Email address"
                        />
                        {fieldErrors.email && (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                        )}
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.phone ? 'border-red-500' : 'border-gray-200'
                            }`}
                          aria-label="Phone number"
                        />
                        {fieldErrors.phone && (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.dateOfBirth ? 'border-red-500' : 'border-gray-200'
                              }`}
                            aria-label="Date of birth"
                          />
                          {fieldErrors.dateOfBirth && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.dateOfBirth}</p>
                          )}
                        </div>
                        <div className="relative">
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.gender ? 'border-red-500' : 'border-gray-200'
                              }`}
                            aria-label="Gender"
                          >
                            <option value="">Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          {fieldErrors.gender && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.gender}</p>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.city ? 'border-red-500' : 'border-gray-200'
                            }`}
                          aria-label="City"
                        />
                        {fieldErrors.city && (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.city}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="occupation"
                            placeholder="Occupation"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.occupation ? 'border-red-500' : 'border-gray-200'
                              }`}
                            aria-label="Occupation"
                          />
                          {fieldErrors.occupation && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.occupation}</p>
                          )}
                        </div>
                        <div className="relative">
                          <GraduationCap className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="education"
                            placeholder="Education"
                            value={formData.education}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.education ? 'border-red-500' : 'border-gray-200'
                              }`}
                            aria-label="Education"
                          />
                          {fieldErrors.education && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.education}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <select
                            name="religion"
                            value={formData.religion}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.religion ? 'border-red-500' : 'border-gray-200'
                              }`}
                            aria-label="Religion"
                          >
                            <option value="">Religion</option>
                            <option value="hindu">Hindu</option>
                            <option value="muslim">Muslim</option>
                            <option value="christian">Christian</option>
                            <option value="sikh">Sikh</option>
                            <option value="buddhist">Buddhist</option>
                            <option value="jain">Jain</option>
                            <option value="other">Other</option>
                          </select>
                          {fieldErrors.religion && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.religion}</p>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            name="motherTongue"
                            placeholder="Mother Tongue"
                            value={formData.motherTongue}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.motherTongue ? 'border-red-500' : 'border-gray-200'
                              }`}
                            aria-label="Mother tongue"
                          />
                          {fieldErrors.motherTongue && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.motherTongue}</p>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.password ? 'border-red-500' : 'border-gray-200'
                            }`}
                          aria-label="Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                        {fieldErrors.password && (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                            }`}
                          aria-label="Confirm password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                        {fieldErrors.confirmPassword && (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="securityAnswer"
                          placeholder="What was your childhood nickname?"
                          value={formData.securityAnswer}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-gray-50 transition-all duration-300 ${fieldErrors.securityAnswer ? 'border-red-500' : 'border-gray-200'
                            }`}
                          aria-label="Security answer"
                        />
                        {fieldErrors.securityAnswer && (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.securityAnswer}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                    aria-label={forgotPassword ? (securityVerified ? 'Reset Password' : 'Verify Answer') : isLogin ? 'Login' : 'Create Account'}
                  >
                    {forgotPassword ? (securityVerified ? 'Reset Password' : 'Verify Answer') : isLogin ? 'Login' : 'Create Account'}
                  </button>
                </form>

                <div className="mt-6 text-center space-y-3">
                  <p className="text-gray-600 text-sm font-medium">
                    {forgotPassword ? (
                      <button
                        onClick={() => { setForgotPassword(false); resetForm(); }}
                        className="text-pink-600 hover:text-pink-700 font-medium transition-colors duration-300"
                        aria-label="Back to login"
                      >
                        Back to Login
                      </button>
                    ) : isLogin ? (
                      <>
                        Don't have an account?{' '}
                        <button
                          onClick={toggleMode}
                          className="text-pink-600 hover:text-pink-700 font-medium transition-colors duration-300"
                          aria-label="Switch to sign up"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          onClick={toggleMode}
                          className="text-pink-600 hover:text-pink-700 font-medium transition-colors duration-300"
                          aria-label="Switch to login"
                        >
                          Login
                        </button>
                      </>
                    )}
                  </p>
                  {isLogin && !forgotPassword && (
                    <p className="text-gray-600 text-sm">
                      <button
                        onClick={handleForgotPassword}
                        className="text-pink-600 hover:text-pink-700 font-medium transition-colors duration-300"
                        aria-label="Forgot password"
                      >
                        Forgot your password?
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-white text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Welcome to Shaadi Mubaraak</h2>
                  <p className="text-lg opacity-90 mb-8 max-w-md">
                    Where beautiful love stories begin. Connect with your perfect match and plan your dream wedding with our trusted vendors.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                    <Users className="w-8 h-8 mb-2 mx-auto" />
                    <p className="text-sm font-medium">Verified Profiles</p>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                    <Heart className="w-8 h-8 mb-2 mx-auto" />
                    <p className="text-sm font-medium">Perfect Matches</p>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                    <Package className="w-8 h-8 mb-2 mx-auto" />
                    <p className="text-sm font-medium">Trusted Vendors</p>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                    <Calendar className="w-8 h-8 mb-2 mx-auto" />
                    <p className="text-sm font-medium">Easy Planning</p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white bg-opacity-5 rounded-full blur-3xl"></div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg z-10"
              aria-label="Close login modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulseSlow {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(244, 114, 182, 0.7);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 0 10px rgba(244, 114, 182, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(244, 114, 182, 0);
          }
        }
        @keyframes placeholderGlow {
          0% {
            opacity: 0.6;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0.6;
            transform: scale(0.98);
          }
        }
        @keyframes heartSparkle {
          0% {
            transform: scale(0) translate(0, 0);
            opacity: 0;
          }
          50% {
            transform: scale(1.5) translate(15px, -15px);
            opacity: 1;
          }
          100% {
            transform: scale(0) translate(30px, -30px);
            opacity: 0;
          }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out;
        }
        .animate-slide-in-up {
          animation: slideInUp 0.5s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-pulse-slow {
          animation: pulseSlow 2s infinite;
        }
        .animate-placeholder-glow {
          animation: placeholderGlow 2.5s ease-in-out infinite;
        }
        .heart-sparkle {
          position: absolute;
          top: 50%;
          right: 15px;
          width: 16px;
          height: 16px;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(244, 114, 182, 1)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>') no-repeat center;
          background-size: contain;
          animation: heartSparkle 2s infinite;
        }
        .heart-sparkle-1 {
          animation-delay: 0s;
        }
        .heart-sparkle-2 {
          animation-delay: 0.5s;
          right: 25px;
        }
        .heart-sparkle-3 {
          animation-delay: 1s;
          right: 20px;
          transform: translateY(-5px);
        }
      `}</style>
    </>
  );
};

export default Header;