import React, { useState, useEffect } from 'react';
import { Heart, Gift, Users, Shield, HandHeart, Crown, ArrowRight, IndianRupee, FileText, Clock, BookOpen, Sparkles, Handshake, Medal, HelpingHand } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import emailjs from '@emailjs/browser';

interface Scheme {
    id: string;
    title: string;
    description: string;
    amount: string;
    eligibility: string;
    icon: React.ComponentType<{ className?: string }>;
    category: string;
    color: string;
    iconColor: string;
    badgeColor: string;
    borderColor: string;
    details: {
        overview: string;
        benefits: string[];
        applicationProcess: string[];
        requiredDocuments: string[];
        contact: string;
    };
}

// Sample schemes data (unchanged)
const schemes: Scheme[] = [
    {
        id: 'widow-remarriage',
        title: 'Widow Remarriage Scheme',
        description: 'Financial assistance for widow remarriage to promote social acceptance and support',
        amount: '₹51,000 - ₹2,00,000',
        eligibility: 'Widows below 45 years, annual income below ₹2 lakh',
        icon: Heart,
        category: 'Central Scheme',
        color: 'bg-gradient-to-br from-pink-100 to-rose-100',
        iconColor: 'text-pink-600',
        badgeColor: 'bg-pink-500',
        borderColor: 'border-pink-200',
        details: {
            overview: 'The Widow Remarriage Scheme provides financial support to widows seeking to remarry, encouraging social reintegration and financial stability.',
            benefits: [
                'Financial aid ranging from ₹51,000 to ₹2,00,000.',
                'Promotes social acceptance of widow remarriage.',
                'Support for a new beginning with financial security.'
            ],
            applicationProcess: [
                'Visit the District Social Welfare Office or online portal.',
                'Submit application form with required documents.',
                'Verification by authorities within 30 days.',
                'Funds disbursed via direct bank transfer.'
            ],
            requiredDocuments: [
                'Aadhaar Card',
                'Income Certificate',
                'Widow Certificate',
                'Marriage Registration Certificate (post-marriage)'
            ],
            contact: 'Contact your local District Social Welfare OFFICE or visit the official government portal.'
        }
    },
    {
        id: 'mass-marriage',
        title: 'Mass Marriage Scheme',
        description: 'Support for collective weddings to reduce marriage expenses',
        amount: '₹25,000 per couple',
        eligibility: 'BPL families, organized by NGOs/Government',
        icon: Users,
        category: 'State/Central',
        color: 'bg-gradient-to-br from-purple-100 to-violet-100',
        iconColor: 'text-purple-600',
        badgeColor: 'bg-purple-500',
        borderColor: 'border-purple-200',
        details: {
            overview: 'The Mass Marriage Scheme facilitates collective weddings to minimize expenses for Below Poverty Line (BPL) families, organized by government bodies or NGOs.',
            benefits: [
                '₹25,000 financial aid per couple.',
                'Free wedding ceremony arrangements.',
                'Essential household items provided in some states.'
            ],
            applicationProcess: [
                'Register with organizing NGO or government body.',
                'Submit BPL card and other documents.',
                'Attend the scheduled mass marriage event.',
                'Receive aid post-verification.'
            ],
            requiredDocuments: [
                'BPL Card',
                'Aadhaar Card',
                'Age Proof (Bride and Groom)',
                'Marriage Invitation (if applicable)'
            ],
            contact: 'Reach out to local NGOs or District Administration for event schedules.'
        }
    },
    {
        id: 'inter-caste-marriage',
        title: 'Inter-Caste Marriage Scheme',
        description: 'Dr. APJ Abdul Kalam Scheme for inter-caste marriages',
        amount: '₹2.5 lakh',
        eligibility: 'One partner from SC/ST, other from non-SC/ST',
        icon: HandHeart,
        category: 'Central Scheme',
        color: 'bg-gradient-to-br from-blue-100 to-cyan-100',
        iconColor: 'text-blue-600',
        badgeColor: 'bg-blue-500',
        borderColor: 'border-blue-200',
        details: {
            overview: 'The Dr. APJ Abdul Kalam Scheme promotes social harmony by providing financial incentives for inter-caste marriages.',
            benefits: [
                'One-time payment of ₹2.5 lakh.',
                'Encourages social integration and reduces caste barriers.',
                'Support for a new beginning with financial security.'
            ],
            applicationProcess: [
                'Apply through the Social Welfare Department portal.',
                'Submit marriage and caste certificates.',
                'Verification within 60 days.',
                'Funds transferred to joint account.'
            ],
            requiredDocuments: [
                'Caste Certificate (SC/ST)',
                'Marriage Certificate',
                'Aadhaar Card',
                'Bank Account Details'
            ],
            contact: 'Contact the Social Welfare Department or visit the central government portal.'
        }
    },
    {
        id: 'chief-minister-marriage',
        title: 'Chief Minister Marriage Assistance',
        description: 'State-specific marriage assistance for economically weaker sections',
        amount: '₹25,000 - ₹1,00,000',
        eligibility: 'Varies by state, typically BPL families',
        icon: Gift,
        category: 'State Scheme',
        color: 'bg-gradient-to-br from-green-100 to-emerald-100',
        iconColor: 'text-green-600',
        badgeColor: 'bg-green-500',
        borderColor: 'border-green-200',
        details: {
            overview: 'This state-specific scheme provides financial aid to economically weaker sections to support marriage expenses.',
            benefits: [
                'Financial aid between ₹25,000 and ₹1,00,000.',
                'Varies by state policies and budget.',
                'May include in-kind support like household items.'
            ],
            applicationProcess: [
                'Apply at the local District Collectorate.',
                'Submit income and BPL certificates.',
                'Verification by state authorities.',
                'Direct benefit transfer post-approval.'
            ],
            requiredDocuments: [
                'BPL Certificate',
                'Aadhaar Card',
                'Income Certificate',
                'Marriage Certificate'
            ],
            contact: 'Visit your state’s Social Welfare Department or District Collectorate.'
        }
    },
    {
        id: 'mukhyamantri-kanyadan',
        title: 'Mukhyamantri Kanyadan Yojana',
        description: 'Marriage assistance for daughters of poor families',
        amount: '₹20,000 - ₹55,000',
        eligibility: 'Annual income below ₹46,080, bride age 18+',
        icon: Crown,
        category: 'State Scheme',
        color: 'bg-gradient-to-br from-orange-100 to-amber-100',
        iconColor: 'text-orange-600',
        badgeColor: 'bg-orange-500',
        borderColor: 'border-orange-200',
        details: {
            overview: 'Mukhyamantri Kanyadan Yojana supports daughters from low-income families with financial aid for marriage.',
            benefits: [
                'Financial aid from ₹20,000 to ₹55,000.',
                'Organized marriage events in some states.',
                'Support for essential marriage expenses.'
            ],
            applicationProcess: [
                'Register at the District Social Welfare Office.',
                'Submit income and age proof documents.',
                'Verification and approval within 30-60 days.',
                'Aid disbursed post-marriage.'
            ],
            requiredDocuments: [
                'Income Certificate',
                'Aadhaar Card',
                'Age Proof (Bride)',
                'Marriage Registration Certificate'
            ],
            contact: 'Contact your state’s Social Welfare Department or local authorities.'
        }
    },
    {
        id: 'divorced-women-marriage',
        title: 'Divorced Women Marriage Scheme',
        description: 'Financial support for divorced women seeking remarriage',
        amount: '₹51,000',
        eligibility: 'Divorced women below 45 years',
        icon: Shield,
        category: 'State Scheme',
        color: 'bg-gradient-to-br from-indigo-100 to-purple-100',
        iconColor: 'text-indigo-600',
        badgeColor: 'bg-indigo-500',
        borderColor: 'border-indigo-200',
        details: {
            overview: 'This scheme supports divorced women seeking remarriage by providing financial assistance.',
            benefits: [
                '₹51,000 financial aid.',
                'Encourages social reintegration.',
                'Support for remarriage expenses.'
            ],
            applicationProcess: [
                'Apply through the District Social Welfare Office.',
                'Submit divorce and age proof documents.',
                'Verification by authorities.',
                'Funds disbursed post-marriage.'
            ],
            requiredDocuments: [
                'Divorce Certificate',
                'Aadhaar Card',
                'Age Proof',
                'Marriage Registration Certificate'
            ],
            contact: 'Reach out to the District Social Welfare Office or state portal.'
        }
    },
    {
        id: 'moovalur-ramamirtham',
        title: 'Moovalur Ramamirtham Ammaiyar Scheme',
        description: 'Supports girls from government schools for marriage and higher education',
        amount: '₹25,000 - ₹50,000 + 8g gold coin',
        eligibility: 'Girls studied in govt schools (6th-12th), annual income ≤ ₹72,000',
        icon: BookOpen,
        category: 'State Scheme',
        color: 'bg-gradient-to-br from-teal-100 to-cyan-100',
        iconColor: 'text-teal-600',
        badgeColor: 'bg-teal-500',
        borderColor: 'border-teal-200',
        details: {
            overview: 'This Tamil Nadu scheme supports girls from government schools for marriage and education.',
            benefits: [
                '₹25,000 to ₹50,000 plus an 8g gold coin.',
                'Support for marriage or higher education.',
                'Promotes education and financial stability.'
            ],
            applicationProcess: [
                'Apply via Tamil Nadu government portal or local office.',
                'Submit school and income certificates.',
                'Verification within 45 days.',
                'Aid disbursed post-verification.'
            ],
            requiredDocuments: [
                'School Certificate (6th-12th)',
                'Income Certificate',
                'Aadhaar Card',
                'Marriage Certificate (if applicable)'
            ],
            contact: 'Visit Tamil Nadu’s Social Welfare Department portal or local office.'
        }
    },
    {
        id: 'mukhyamantri-vivah-shagun',
        title: 'Mukhya Mantri Vivah Shagun Yojana',
        description: 'Financial aid for girls from poor families, widows, and orphans in Haryana',
        amount: '₹11,000 - ₹51,000',
        eligibility: 'BPL families, widows, or orphans; apply within 30 days of marriage',
        icon: Sparkles,
        category: 'State Scheme',
        color: 'bg-gradient-to-br from-yellow-100 to-amber-100',
        iconColor: 'text-yellow-600',
        badgeColor: 'bg-yellow-500',
        borderColor: 'border-yellow-200',
        details: {
            overview: 'This Haryana scheme provides financial aid for girls from BPL families, widows, and orphans.',
            benefits: [
                'Financial aid from ₹11,000 to ₹51,000.',
                'Support for marriage expenses.',
                'Promotes social welfare for vulnerable groups.'
            ],
            applicationProcess: [
                'Apply within 30 days of marriage at District Collectorate.',
                'Submit BPL or widow/orphan documents.',
                'Verification and approval within 60 days.',
                'Direct benefit transfer.'
            ],
            requiredDocuments: [
                'BPL Certificate',
                'Aadhaar Card',
                'Marriage Certificate',
                'Widow/Orphan Certificate (if applicable)'
            ],
            contact: 'Contact Haryana Social Welfare Department or District Collectorate.'
        }
    },
    {
        id: 'karnataka-sc-inter-caste',
        title: 'Karnataka SC Inter-Caste Marriage Scheme',
        description: 'Promotes inter-caste marriages to reduce caste discrimination',
        amount: '₹2.5 lakh - ₹3 lakh',
        eligibility: 'One partner SC, annual income ≤ ₹5,00,000, apply within 1 year',
        icon: Handshake,
        category: 'State Scheme',
        color: 'bg-gradient-to-br from-red-100 to-pink-100',
        iconColor: 'text-red-600',
        badgeColor: 'bg-red-500',
        borderColor: 'border-red-200',
        details: {
            overview: 'This Karnataka scheme promotes inter-caste marriages to reduce caste discrimination.',
            benefits: [
                'Financial aid from ₹2.5 lakh to ₹3 lakh.',
                'Promotes social harmony.',
                'Support for newlyweds.'
            ],
            applicationProcess: [
                'Apply via Karnataka Social Welfare Department portal.',
                'Submit caste and marriage certificates.',
                'Verification within 90 days.',
                'Funds transferred to joint account.'
            ],
            requiredDocuments: [
                'Caste Certificate (SC)',
                'Marriage Certificate',
                'Aadhaar Card',
                'Income Certificate'
            ],
            contact: 'Visit Karnataka Social Welfare Department or local office.'
        }
    },
    {
        id: 'ex-servicemen-marriage',
        title: 'Ex-Servicemen Marriage Assistance',
        description: 'Financial support for daughters of ex-servicemen or their widows',
        amount: '₹50,000 per daughter (max 2)',
        eligibility: 'Ex-servicemen up to Havildar rank or their widows',
        icon: Medal,
        category: 'Central Scheme',
        color: 'bg-gradient-to-br from-gray-100 to-blue-100',
        iconColor: 'text-gray-600',
        badgeColor: 'bg-gray-500',
        borderColor: 'border-gray-200',
        details: {
            overview: 'This scheme supports daughters of ex-servicemen or their widows with marriage expenses.',
            benefits: [
                '₹50,000 per daughter (up to 2 daughters).',
                'Financial support for ex-servicemen families.',
                'Promotes welfare of armed forces families.'
            ],
            applicationProcess: [
                'Apply through Ex-Servicemen Welfare Department.',
                'Submit service and family documents.',
                'Verification by authorities.',
                'Funds disbursed post-approval.'
            ],
            requiredDocuments: [
                'Ex-Servicemen Service Certificate',
                'Aadhaar Card',
                'Marriage Certificate',
                'Widow Certificate (if applicable)'
            ],
            contact: 'Contact Ex-Servicemen Welfare Department or central government portal.'
        }
    },
    {
        id: 'puducherry-sc-bride',
        title: 'Puducherry SC Bride Assistance',
        description: 'Financial aid for Scheduled Caste brides to support marriage expenses',
        amount: '₹25,000',
        eligibility: 'SC brides, apply 40 days before or 1 day prior to marriage',
        icon: HelpingHand,
        category: 'State Scheme',
        color: 'bg-gradient-to-br from-violet-100 to-indigo-100',
        iconColor: 'text-violet-600',
        badgeColor: 'bg-violet-500',
        borderColor: 'border-violet-200',
        details: {
            overview: 'This Puducherry scheme supports Scheduled Caste brides with financial aid for marriage.',
            benefits: [
                '₹25,000 financial aid.',
                'Support for marriage expenses.',
                'Promotes social welfare for SC communities.'
            ],
            applicationProcess: [
                'Apply 40 days before or 1 day prior to marriage.',
                'Submit application at Puducherry Social Welfare Office.',
                'Verification within 30 days.',
                'Funds disbursed post-marriage.'
            ],
            requiredDocuments: [
                'Caste Certificate (SC)',
                'Aadhaar Card',
                'Marriage Invitation',
                'Marriage Certificate'
            ],
            contact: 'Contact Puducherry Social Welfare Department or local office.'
        }
    }
];

const GovernmentSchemes: React.FC = () => {
    const [showAll, setShowAll] = useState(false);
    const [filter, setFilter] = useState<string>('All');
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        state: '',
        message: ''
    });
    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        phone: '',
        state: '',
        message: ''
    });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [submissionError, setSubmissionError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [floatingElements, setFloatingElements] = useState<Array<{ id: number, x: number, y: number, delay: number }>>([]);

    // Initialize EmailJS and log configuration
    useEffect(() => {
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Jj6lOwXBVdcx4ScgS';
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_gj23mcl';
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_63sh339'; // Corrected template_id fallback

        if (publicKey) {
            emailjs.init(publicKey);
            console.log('EmailJS initialized with public key:', publicKey);
        } else {
            console.error('EmailJS Public Key not found. Please set VITE_EMAILJS_PUBLIC_KEY in your .env file.');
        }

        console.log('EmailJS Config:', {
            publicKey,
            serviceId,
            templateId
        });
    }, []);

    // Generate floating elements for animation
    useEffect(() => {
        const elements = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5
        }));
        setFloatingElements(elements);
    }, []);

    const regexPatterns = {
        name: /^[A-Za-z\s]{2,}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^[6-9]\d{9}$/,
        state: /.+/,
        message: /^[\w\s.,!?]{0,500}$/
    };

    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'name':
                return regexPatterns.name.test(value) ? '' : 'Please enter a valid name (letters and spaces only, min 2 characters)';
            case 'email':
                return regexPatterns.email.test(value) ? '' : 'Please enter a valid email address';
            case 'phone':
                return regexPatterns.phone.test(value) ? '' : 'Please enter a valid 10-digit Indian mobile number starting with 6-9';
            case 'state':
                return regexPatterns.state.test(value) ? '' : 'Please select a valid state';
            case 'message':
                return regexPatterns.message.test(value) ? '' : 'Message must be less than 500 characters and contain valid characters';
            default:
                return '';
        }
    };

    const filteredSchemes = filter === 'All'
        ? schemes
        : schemes.filter(scheme =>
            filter === 'State/Central'
                ? scheme.category === 'State/Central'
                : scheme.category.includes(filter)
        );

    const displayedSchemes = showAll ? filteredSchemes : filteredSchemes.slice(0, 6);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const handleFindLocalOffice = () => {
        const searchQuery = encodeURIComponent('marriage bureaus near me, marriage courts near me, marriage services');
        window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
    };

    const handleSchemeClick = (scheme: Scheme) => {
        setSelectedScheme(scheme);
        setIsFormSubmitted(false);
        setSubmissionError('');
    };

    const closeModal = () => {
        setSelectedScheme(null);
        setFormData({ name: '', email: '', phone: '', state: '', message: '' });
        setFormErrors({ name: '', email: '', phone: '', state: '', message: '' });
        setIsFormSubmitted(false);
        setSubmissionError('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        setSubmissionError('');
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSubmissionError('');
        setIsSubmitting(true);

        const errors = {
            name: validateField('name', formData.name),
            email: validateField('email', formData.email),
            phone: validateField('phone', formData.phone),
            state: validateField('state', formData.state),
            message: validateField('message', formData.message)
        };
        setFormErrors(errors);

        if (Object.values(errors).every(error => error === '')) {
            const templateParams = {
                scheme_title: selectedScheme?.title || 'Unknown Scheme',
                user_name: formData.name,
                user_email: formData.email,
                user_phone: formData.phone,
                user_state: formData.state,
                user_message: formData.message || 'No additional message provided.'
            };

            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_gj23mcl';
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_63sh339';

            console.log('Attempting to send email with parameters:', { serviceId, templateId, templateParams });

            try {
                let attempts = 0;
                const maxAttempts = 3;
                let emailResponse;

                while (attempts < maxAttempts) {
                    try {
                        emailResponse = await emailjs.send(serviceId, templateId, templateParams);
                        console.log('Email sent successfully:', emailResponse);
                        setIsFormSubmitted(true);
                        setIsSubmitting(false);
                        return;
                    } catch (error: any) {
                        attempts++;
                        console.warn(`Attempt ${attempts} failed for EmailJS submission. Error:`, error);
                        if (attempts === maxAttempts) {
                            throw error;
                        }
                        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
                    }
                }
            } catch (error: any) {
                console.error('Final Email submission error:', error);
                let errorMessage = 'Failed to send application due to a technical error. Please try again later.';
                if (error.text) {
                    try {
                        const errorDetails = JSON.parse(error.text);
                        if (errorDetails.message && errorDetails.message.includes('reCAPTCHA')) {
                            errorMessage = 'reCAPTCHA verification failed. Please try again.';
                        } else if (errorDetails.message) {
                            errorMessage = errorDetails.message;
                        } else if (error.text.includes('Quota Exceeded')) {
                            errorMessage = 'Email sending limit reached. Please try again later or contact support.';
                        } else if (error.text.includes('Bad Request')) {
                            errorMessage = 'Invalid form data. Please check your inputs and try again.';
                        } else if (error.text.includes('Unauthorized')) {
                            errorMessage = 'Invalid EmailJS configuration. Please contact the administrator.';
                        }
                    } catch {
                        // Fallback if error.text is not JSON
                        errorMessage = `Failed to send application. Error: ${error.text}`;
                    }
                }
                setSubmissionError(errorMessage);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setIsSubmitting(false);
            setSubmissionError('Please correct the highlighted errors in the form.');
        }
    };

    return (
        <section className="py-24 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative overflow-hidden min-h-screen">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-rose-300/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 -right-20 w-80 h-80 bg-gradient-to-r from-pink-300/30 to-rose-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-rose-200/20 to-pink-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>

                {/* Floating Elements */}
                {floatingElements.map((element) => (
                    <div
                        key={element.id}
                        className="absolute w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full opacity-20"
                        style={{
                            left: `${element.x}%`,
                            top: `${element.y}%`,
                            animation: `float 6s ease-in-out infinite`,
                            animationDelay: `${element.delay}s`
                        }}
                    />
                ))}

                {/* Geometric Shapes */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-rose-300/20 rounded-xl transform rotate-45 animate-spin-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-pink-300/20 rounded-full animate-bounce-slow"></div>

                {/* Mesh Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-100/10 to-transparent animate-pulse"></div>

                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `radial-gradient(circle at 25px 25px, rose 2px, transparent 0), radial-gradient(circle at 75px 75px, pink 2px, transparent 0)`,
                    backgroundSize: '100px 100px'
                }}></div>
            </div>

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                    animation-duration: 20s;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                    animation-duration: 4s;
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
            `}</style>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Enhanced Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full mb-6 shadow-xl border border-rose-200/50 hover:shadow-2xl transition-all duration-300">
                        <div className="relative">
                            <IndianRupee className="h-5 w-5 text-rose-600" />
                            <div className="absolute inset-0 bg-rose-600 rounded-full animate-ping opacity-20"></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Financial Support</span>
                        <Sparkles className="h-4 w-4 text-rose-500 animate-pulse" />
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-transparent mb-4 animate-fade-in-up">
                        Marriage Assistance Schemes
                    </h2>

                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Explore Government of India marriage assistance schemes designed to empower couples and promote social welfare across communities.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        {['All', 'Central Scheme', 'State Scheme', 'State/Central'].map((category, index) => (
                            <button
                                key={category}
                                onClick={() => setFilter(category)}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${filter === category
                                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xl border-2 border-rose-300'
                                        : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border-2 border-rose-200/50 shadow-md'
                                    }`}
                                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                                aria-pressed={filter === category}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Enhanced Scheme Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {displayedSchemes.map((scheme, index) => (
                        <Card
                            key={scheme.id}
                            className={`group relative bg-white/90 backdrop-blur-sm ${scheme.borderColor} border-2 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer hover:-translate-y-3 hover:rotate-1 focus-within:ring-4 focus-within:ring-rose-500/50 animate-fade-in-up`}
                            style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                            onClick={() => handleSchemeClick(scheme)}
                            tabIndex={0}
                            role="button"
                            aria-label={`Learn more about ${scheme.title}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleSchemeClick(scheme);
                                }
                            }}
                        >
                            {/* Enhanced Card Glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 via-pink-400/20 to-rose-500/20 blur-xl animate-pulse"></div>
                            </div>

                            {/* Floating particles effect */}
                            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-1 h-1 bg-rose-400 rounded-full animate-ping"
                                        style={{
                                            left: `${20 + i * 20}%`,
                                            top: `${30 + i * 10}%`,
                                            animationDelay: `${i * 0.2}s`
                                        }}
                                    />
                                ))}
                            </div>

                            <CardHeader className="relative z-10 pb-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-4 rounded-2xl ${scheme.color} shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 border-2 border-white/50`}>
                                        <scheme.icon className={`h-10 w-10 ${scheme.iconColor}`} />
                                        <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-pink-400/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                    <Badge className={`${scheme.badgeColor} text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 border-2 border-white/30`}>
                                        {scheme.category}
                                    </Badge>
                                </div>

                                <CardTitle className="text-2xl font-extrabold text-gray-900 group-hover:text-rose-800 transition-colors duration-300 line-clamp-2">
                                    {scheme.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6 relative z-10">
                                <p className="text-gray-700 text-base leading-relaxed line-clamp-3 group-hover:text-gray-800 transition-colors duration-300">
                                    {scheme.description}
                                </p>

                                {/* Enhanced Amount Highlight */}
                                <div className="bg-gradient-to-r from-white/95 to-rose-50/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-rose-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-rose-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-rose-100/20 to-pink-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="flex items-center gap-3 mb-3 relative z-10">
                                        <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                                            <IndianRupee className="h-5 w-5 text-green-600" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-800">Financial Assistance</span>
                                    </div>
                                    <p className="text-2xl font-extrabold text-green-700 relative z-10">{scheme.amount}</p>
                                </div>

                                {/* Enhanced Eligibility */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-800">Eligibility</span>
                                    </div>
                                    <p className="text-base text-gray-700 leading-relaxed bg-gradient-to-r from-white/80 to-rose-50/80 rounded-xl p-4 border border-rose-200/50 backdrop-blur-sm">
                                        {scheme.eligibility}
                                    </p>
                                </div>

                                {/* Enhanced Action Button */}
                                <Button
                                    className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-105 border-2 border-rose-300/50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSchemeClick(scheme);
                                    }}
                                >
                                    <span>Learn More</span>
                                    <ArrowRight className="h-5 w-5 ml-3 transition-transform group-hover:translate-x-2" />
                                    <Sparkles className="h-4 w-4 ml-2 animate-pulse" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Enhanced View More Button */}
                {filteredSchemes.length > 6 && (
                    <div className="text-center mb-16">
                        <button
                            onClick={toggleShowAll}
                            className="inline-flex items-center bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold px-12 py-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 group transform hover:scale-105 border-2 border-rose-300/50"
                        >
                            <span>{showAll ? 'View Less' : 'View More'}</span>
                            <ArrowRight className="h-6 w-6 ml-3 transition-transform group-hover:translate-x-2" />
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-pink-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>
                )}

                {/* Enhanced Information Section */}
                <div className="mt-16">
                    <div className="bg-gradient-to-br from-white/90 via-rose-50/90 to-pink-50/90 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border-2 border-rose-200/50 shadow-3xl relative overflow-hidden">
                        {/* Enhanced Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-200 to-pink-200 transform rotate-12 scale-150 blur-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-pink-300 to-rose-300 transform -rotate-12 scale-110 blur-2xl"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl mb-6 shadow-xl border-2 border-rose-200/50">
                                    <div className="relative">
                                        <Clock className="h-6 w-6 text-rose-600" />
                                        <div className="absolute inset-0 bg-rose-600 rounded-full animate-ping opacity-20"></div>
                                    </div>
                                    <span className="text-base font-bold text-gray-800">Application Process</span>
                                    <BookOpen className="h-5 w-5 text-pink-600" />
                                </div>

                                <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-rose-700 to-pink-700 bg-clip-text text-transparent">
                                    How to Apply for Marriage Schemes
                                </h3>
                                <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                                    Follow these streamlined steps to access government marriage assistance schemes with ease.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                {/* Enhanced Application Process */}
                                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-rose-200/50 hover:shadow-3xl transition-all duration-300 group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-white text-base font-bold">1</span>
                                        </div>
                                        Application Steps
                                    </h4>
                                    <ul className="space-y-4 text-base text-gray-700 relative z-10">
                                        {[
                                            'Visit nearest District Collectorate or online portal',
                                            'Submit required documents with application form',
                                            'Verification by concerned authorities',
                                            'Approval and direct benefit transfer'
                                        ].map((step, index) => (
                                            <li key={index} className="flex items-start gap-4 group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: `${index * 0.1}s` }}>
                                                <div className="w-4 h-4 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
                                                <span className="leading-relaxed">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Enhanced Required Documents */}
                                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-pink-200/50 hover:shadow-3xl transition-all duration-300 group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                        Required Documents
                                    </h4>
                                    <ul className="space-y-4 text-base text-gray-700 relative z-10">
                                        {[
                                            'Aadhaar Card & PAN Card (mandatory)',
                                            'Income Certificate from competent authority',
                                            'Caste Certificate (if applicable for scheme)',
                                            'Marriage Registration Certificate'
                                        ].map((doc, index) => (
                                            <li key={index} className="flex items-start gap-4 group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: `${index * 0.1}s` }}>
                                                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
                                                <span className="leading-relaxed">{doc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Enhanced Call to Action */}
                            <div className="text-center">
                                <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-pink-400/20 animate-pulse"></div>
                                    <h4 className="text-xl sm:text-2xl font-bold mb-3 relative z-10">Need Help with Applications?</h4>
                                    <p className="text-rose-100 mb-6 text-base relative z-10">Contact your local district administration for personalized guidance</p>
                                    <button
                                        onClick={handleFindLocalOffice}
                                        className="bg-white text-rose-600 hover:bg-rose-50 font-semibold px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative z-10 border-2 border-rose-200"
                                    >
                                        Find Local Office
                                    </button>
                                </div>
                            </div>

                            <p className="text-center text-sm text-gray-500 mt-8 italic bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-rose-200/50">
                                * Scheme amounts and eligibility criteria may vary by state. Please verify current details with local authorities before applying.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Form Modal */}
                {selectedScheme && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 min-h-screen animate-fade-in">
                        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 w-full max-w-md max-h-[85vh] overflow-y-auto relative shadow-3xl border-2 border-rose-200/50 bg-gradient-to-br from-white to-rose-50/30 animate-scale-in">
                            {/* Enhanced Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-all duration-300 bg-rose-100/80 backdrop-blur-sm rounded-full p-3 hover:bg-rose-200/80 transform hover:scale-110 hover:rotate-90 shadow-lg"
                                aria-label="Close modal"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {isFormSubmitted ? (
                                <div className="text-center space-y-6 animate-fade-in-up">
                                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-gray-900">Application Submitted!</h3>
                                    <p className="text-gray-600 text-base leading-relaxed">
                                        Thank you for applying for the <span className="font-semibold text-rose-600">{selectedScheme.title}</span>. Our agent will reach out to you within 24 hours for complete guidance.
                                    </p>
                                    <Button
                                        onClick={closeModal}
                                        className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                                    >
                                        Close
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                                            <selectedScheme.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Apply for {selectedScheme.title}</h3>
                                        <p className="text-gray-600 text-sm">{selectedScheme.description}</p>
                                    </div>
                                    {submissionError && (
                                        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                            {submissionError}
                                        </div>
                                    )}
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border-2 ${formErrors.name ? 'border-red-500' : 'border-rose-200'} bg-rose-50/30 backdrop-blur-sm focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 text-gray-900 placeholder-gray-400`}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border-2 ${formErrors.email ? 'border-red-500' : 'border-rose-200'} bg-rose-50/30 backdrop-blur-sm focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 text-gray-900 placeholder-gray-400`}
                                                placeholder="Enter your email address"
                                                required
                                            />
                                            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border-2 ${formErrors.phone ? 'border-red-500' : 'border-rose-200'} bg-rose-50/30 backdrop-blur-sm focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 text-gray-900 placeholder-gray-400`}
                                                placeholder="Enter your phone number"
                                                required
                                            />
                                            {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                                                State <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border-2 ${formErrors.state ? 'border-red-500' : 'border-rose-200'} bg-rose-50/30 backdrop-blur-sm focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 text-gray-900`}
                                                required
                                            >
                                                <option value="" disabled>Select your state</option>
                                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                                <option value="Haryana">Haryana</option>
                                                <option value="Karnataka">Karnataka</option>
                                                <option value="Puducherry">Puducherry</option>
                                                <option value="Tamil Nadu">Tamil Nadu</option>
                                                <option value="Maharashtra">Maharashtra</option>
                                                <option value="Gujarat">Gujarat</option>
                                                <option value="Rajasthan">Rajasthan</option>
                                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                <option value="West Bengal">West Bengal</option>
                                            </select>
                                            {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Additional Information
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className={`w-full px-4 py-3 rounded-xl border-2 ${formErrors.message ? 'border-red-500' : 'border-rose-200'} bg-rose-50/30 backdrop-blur-sm focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none`}
                                                placeholder="Any additional details or queries"
                                            ></textarea>
                                            {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
                                        </div>
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting || Object.values(formErrors).some(error => error !== '') || !formData.name || !formData.email || !formData.phone || !formData.state}
                                            className={`w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${isSubmitting || Object.values(formErrors).some(error => error !== '') || !formData.name || !formData.email || !formData.phone || !formData.state ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
                                        >
                                            <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                                            <ArrowRight className="h-5 w-5 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Additional CSS for enhanced animations */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fade-in-up {
                    from { 
                        opacity: 0; 
                        transform: translateY(30px);
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0);
                    }
                }
                @keyframes scale-in {
                    from { 
                        opacity: 0; 
                        transform: scale(0.9);
                    }
                    to { 
                        opacity: 1; 
                        transform: scale(1);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out both;
                }
                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }
                .shadow-3xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
                }
            `}</style>
        </section>
    );
};

export default GovernmentSchemes;