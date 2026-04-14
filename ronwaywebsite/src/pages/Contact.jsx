import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import contactUsBG from '../assets/background/ContactUsBG.svg';
import wheelSvg from '../assets/logos/Wheel.svg';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { COUNTRIES } from '../data/countries';
import ReactCountryFlag from 'react-country-flag';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const FAQ_ITEMS = [
  {
    question: 'How do I book a ride with Ronway?',
    answer: 'You can book a ride by calling our 24/7 hotline, sending us an email, or filling out the contact form on this page.'
  },
  {
    question: 'Are your drivers professionally trained?',
    answer: 'Yes, all our drivers are professionally trained, licensed, and experienced to ensure your safety and comfort.'
  },
  {
    question: 'Are your rates fixed or metered?',
    answer: 'Our rates are fixed and transparent. We provide quotes upfront based on your trip details, so you know exactly what to expect.'
  }
];

function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [showFAQ, setShowFAQ] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+63');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [submitMessage, setSubmitMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  const sectionRef = useRef(null);
  const modalRef = useRef(null);
  const [faqRef, faqVisible] = useScrollAnimation();
  
  const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001'; // Default test key
  
  const selectedCountry = COUNTRIES.find(c => c.phoneCode === selectedCountryCode) || COUNTRIES[0];

  // Count words in message
  const wordCount = formData.message.trim() ? formData.message.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
  const maxWords = 200;
  const isWordLimitExceeded = wordCount > maxWords;

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (field === 'message') {
      // Limit to 200 words
      const words = value.trim() ? value.trim().split(/\s+/).filter(word => word.length > 0) : [];
      if (words.length <= maxWords || value.length < formData.message.length) {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    } else if (field === 'phoneNumber') {
      // Only allow numeric characters
      const numericValue = value.replace(/\D/g, '');
      
      // For Philippines (+63), ensure number starts with 0
      let processedValue = numericValue;
      if (selectedCountryCode === '+63' && numericValue.length > 0) {
        // If it doesn't start with 0, add it
        if (!numericValue.startsWith('0')) {
          processedValue = '0' + numericValue;
        }
      }
      
      setFormData(prev => ({ ...prev, [field]: processedValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (isWordLimitExceeded) {
      newErrors.message = `Message exceeds ${maxWords} words limit`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission - show confirmation modal first
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill up all required fields correctly.');
      setTimeout(() => setSubmitStatus(null), 5000);
      return;
    }

    // Check if captcha is completed
    if (!captchaToken) {
      setSubmitStatus('error');
      setSubmitMessage('Please complete the captcha verification.');
      setTimeout(() => setSubmitStatus(null), 5000);
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  // Handle captcha verification
  const handleCaptchaVerify = (token) => {
    setCaptchaToken(token);
    // Clear any captcha errors
    if (errors.captcha) {
      setErrors(prev => ({ ...prev, captcha: '' }));
    }
  };

  // Handle captcha expiration
  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
  };

  // Handle captcha error
  const handleCaptchaError = () => {
    setCaptchaToken(null);
    setErrors(prev => ({ ...prev, captcha: 'Captcha verification failed. Please try again.' }));
  };

  // Actually submit the form after confirmation
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      // API endpoint - update this to match your backend URL
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          message: formData.message,
          countryCode: selectedCountryCode,
          captchaToken: captchaToken
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your message has been sent successfully. We will get back to you soon.');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          message: ''
        });
        setErrors({});
        setCaptchaToken(null);
        // Reset captcha
        if (captchaRef.current) {
          captchaRef.current.resetCaptcha();
        }
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
          setSubmitMessage('');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Failed to send message. Please try again later.');
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showConfirmModal && modalRef.current && !modalRef.current.contains(event.target)) {
        setShowConfirmModal(false);
      }
    };

    if (showConfirmModal) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showConfirmModal]);

  // Handle country code change - ensure Philippines numbers start with 0
  useEffect(() => {
    if (selectedCountryCode === '+63' && formData.phoneNumber.length > 0) {
      const numericValue = formData.phoneNumber.replace(/\D/g, '');
      if (numericValue.length > 0 && !numericValue.startsWith('0')) {
        setFormData(prev => ({ ...prev, phoneNumber: '0' + numericValue }));
      } else if (numericValue.length > 0 && numericValue.startsWith('0')) {
        // Ensure it's still numeric only
        setFormData(prev => ({ ...prev, phoneNumber: numericValue }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountryCode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCountryDropdownOpen && !event.target.closest('.country-dropdown-container')) {
        setIsCountryDropdownOpen(false);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  // Wheel rotation on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate scroll progress through the section (0 to 1)
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
        
        // Rotate based on scroll progress (360 degrees for full scroll)
        setRotation(scrollProgress * 360);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Prevent scrollbar flicker during FAQ animation (both opening and closing)
  useEffect(() => {
    if (showFAQ) {
      // Store current scroll position
      const scrollY = window.scrollY;
      const body = document.body;
      
      // Calculate scrollbar width to preserve layout
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Store original values
      const originalBodyPaddingRight = body.style.paddingRight;
      const originalBodyPosition = body.style.position;
      const originalBodyTop = body.style.top;
      const originalBodyWidth = body.style.width;
      
      // Lock scroll position while preserving scrollbar space
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      
      // Re-enable scrolling after animation completes
      const timer = setTimeout(() => {
        body.style.paddingRight = originalBodyPaddingRight;
        body.style.position = originalBodyPosition;
        body.style.top = originalBodyTop;
        body.style.width = originalBodyWidth;
        window.scrollTo(0, scrollY);
      }, 500); // Match animation duration
      
      return () => {
        clearTimeout(timer);
        const storedScrollY = parseInt(body.style.top || '0') * -1;
        body.style.paddingRight = originalBodyPaddingRight;
        body.style.position = originalBodyPosition;
        body.style.top = originalBodyTop;
        body.style.width = originalBodyWidth;
        if (storedScrollY > 0) {
          window.scrollTo(0, storedScrollY);
        } else if (scrollY > 0) {
          window.scrollTo(0, scrollY);
        }
      };
    }
  }, [showFAQ]);

  return (
    <div id="contact" className="w-full relative" ref={sectionRef}>
      {/* Top Section: Contact Us & Form */}
      <section 
        id="contact-form"
        className="w-full relative py-16 px-4 md:py-20 md:px-8 flex justify-center min-h-[600px]"
        style={{
          backgroundImage: `url(${contactUsBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Wheel background element - behind overlay, above background image */}
        <div 
          className="fixed bottom-0 left-0 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-50 pointer-events-none"
          style={{
            transform: `translate(-30%, 30%) rotate(${rotation}deg)`,
            transition: 'transform 0.1s ease-out',
            zIndex: 1
          }}
        >
          <img 
            src={wheelSvg} 
            alt="Wheel" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute inset-0 bg-[#021637] opacity-40" style={{ zIndex: 2 }}></div>
        <div className="max-w-[1200px] w-full relative grid gap-8 md:grid-cols-2" style={{ zIndex: 10 }}>
          {/* Left Side: Contact Info */}
          <motion.div 
            className="text-white space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-7xl font-bold mb-4">Contact Us</h1>
              <p className="text-lg md:text-3xl text-white/90 mb-4">
                Email, Call, or complete the form to contact our team!
              </p>
              <p className="text-base md:text-xl text-white/80 italic">
                We would be honored to support your transport requirements.
              </p>
            </motion.div>

            <motion.div 
              className="space-y-6 pt-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              {/* Email */}
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm uppercase tracking-wider mb-1">EMAIL:</p>
                  <p className="text-lg">ronwaycars.travel@gmail.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-sm uppercase tracking-wider mb-1">PHONE:</p>
                  <p className="text-lg">0977-302-2435</p>
                  <p className="text-lg">0915-802-1884</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div 
            className="bg-[#021945] rounded-2xl p-5 md:p-7 shadow-xl cursor-pointer"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            whileHover={{
              scale: 1.02,
              y: -8,
              boxShadow: "0_25px_60px_rgba(2,25,69,0.4)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1.5">Get In Touch!</h2>
            <p className="text-white/80 mb-5">You can reach us anytime</p>

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full bg-white border rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none ${
                      errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full bg-white border rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none ${
                      errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="relative">
                <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full bg-white border rounded-lg pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 ml-1">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-4">
                <div className="relative country-dropdown-container">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-10 py-3 text-gray-900 focus:outline-none focus:border-blue-500 cursor-pointer flex items-center justify-between"
                    style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
                  >
                    <span className="flex-1 text-left">{selectedCountry.phoneCode}</span>
                    <svg
                      className={`w-4 h-4 text-gray-600 transition-transform flex-shrink-0 ml-2 ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ReactCountryFlag
                      countryCode={selectedCountry.code}
                      svg
                      style={{
                        width: '1.5em',
                        height: '1.5em',
                      }}
                      title={selectedCountry.name}
                    />
                  </div>
                  
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#021945] border border-white/20 rounded-lg shadow-xl z-50 max-h-[250px] overflow-y-auto">
                      {COUNTRIES.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountryCode(country.phoneCode);
                            setIsCountryDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-2 ${
                            selectedCountryCode === country.phoneCode ? 'bg-white/5' : ''
                          }`}
                          style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
                        >
                          <ReactCountryFlag
                            countryCode={country.code}
                            svg
                            style={{
                              width: '1.5em',
                              height: '1.5em',
                            }}
                            title={country.name}
                          />
                          <span className="text-white">{country.phoneCode}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className={`w-full bg-white border rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none ${
                      errors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="relative">
                <textarea
                  placeholder="How can we help?"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={`w-full bg-white border rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none resize-none ${
                    errors.message || isWordLimitExceeded ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <p className={`text-sm ${isWordLimitExceeded ? 'text-red-500 font-semibold' : wordCount > maxWords * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {wordCount}/{maxWords} words
                  </p>
                </div>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {submitStatus && (
                <div className={`p-4 rounded-lg ${
                  submitStatus === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  <p className="text-sm font-medium">{submitMessage}</p>
                </div>
              )}

              <div>
                <HCaptcha
                  sitekey={HCAPTCHA_SITE_KEY}
                  onVerify={handleCaptchaVerify}
                  onExpire={handleCaptchaExpire}
                  onError={handleCaptchaError}
                  ref={captchaRef}
                />
                {errors.captcha && (
                  <p className="mt-1 text-sm text-red-500">{errors.captcha}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors ${
                  isSubmitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'SENDING...' : 'SEND'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#021945] rounded-2xl p-6 md:p-8 max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Confirm Submission</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-white/90 mb-6 text-lg">Are you sure you want to send this message?</p>

            <div className="space-y-4 mb-6">
              <div className="bg-[#021637]/50 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 uppercase tracking-wider mb-2">Name</p>
                <p className="text-white font-medium">{formData.firstName} {formData.lastName}</p>
              </div>

              <div className="bg-[#021637]/50 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 uppercase tracking-wider mb-2">Email</p>
                <p className="text-white font-medium">{formData.email}</p>
              </div>

              <div className="bg-[#021637]/50 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 uppercase tracking-wider mb-2">Phone Number</p>
                <p className="text-white font-medium">{selectedCountryCode} {formData.phoneNumber}</p>
              </div>

              <div className="bg-[#021637]/50 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 uppercase tracking-wider mb-2">Message</p>
                <p className="text-white/90 whitespace-pre-wrap">{formData.message}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-colors border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Confirm & Send
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Middle Section: Our Location */}
      <section id="location" className="w-full bg-[#021945] py-4 px-4 md:py-6 md:px-8 pb-18 md:pb-20 relative" style={{ zIndex: 2 }}>
        <div className="max-w-[1200px] w-full mx-auto grid gap-8 md:grid-cols-2">
          {/* Left: Map */}
          <motion.div 
            className="flex items-center cursor-pointer"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.02,
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-full h-[400px] bg-gray-800 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=Spark+Place,+317+P.+Tuazon+Blvd,+Cubao,+Quezon+City,+Metro+Manila+1109&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>
          </motion.div>

          {/* Right: Address */}
          <motion.div 
            className="flex flex-col justify-center text-white space-y-4 cursor-pointer"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.02,
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <p className="text-sm uppercase tracking-wider text-white/80">Our Location</p>
            <h2 className="text-3xl md:text-4xl font-bold">Where Every Journey Begins</h2>
            <div className="mt-4">
              <p className="text-lg font-semibold mb-2">Main Office</p>
              <p className="text-white/90">
                Spark Place, 317 P. Tuazon Blvd, Cubao, Quezon City, Metro Manila 1109
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Section: FAQ */}
      <section id="faq" className="w-full bg-[#021945] relative pb-0" style={{ zIndex: 2 }}>
        <div className="max-w-[1200px] w-full mx-auto px-4 md:px-8">
          <div className="relative">
            {/* FAQ Container - Expands upward from button */}
            <div
              ref={faqRef}
              className={`bg-white rounded-t-2xl overflow-hidden transition-all duration-500 ease-out absolute left-0 right-0 ${
                showFAQ ? 'max-h-[750px] opacity-100' : 'max-h-0 opacity-0'
              }`}
              style={{
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                bottom: '100%',
                transform: showFAQ ? 'translateY(40px)' : 'translateY(100%)',
                willChange: 'transform, max-height, opacity',
                pointerEvents: showFAQ ? 'auto' : 'none',
                zIndex: 5,
              }}
            >
              <div className="p-6 md:p-10 pb-28 md:pb-32">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Left: FAQ Intro */}
                  <div>
                    <h2 className="text-4xl md:text-4xl font-semibold text-blue-900 mb-4">FAQ</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-blue-900 mb-4">Do you have any question for us?</h3>
                    <p className="text-lg text-slate-600">Here are some frequently asked questions. If you have any other questions, please contact us.</p>
                  </div>

                  {/* Right: FAQ Items */}
                  <div className="space-y-0">
                    {FAQ_ITEMS.map((item, index) => (
                      <motion.div
                        key={index}
                        className={`border-b border-slate-200 ${index === FAQ_ITEMS.length - 1 ? 'border-b-0' : ''}`}
                        whileHover={{
                          scale: 1.01,
                          x: 5,
                          transition: { duration: 0.2, ease: "easeOut" }
                        }}
                      >
                        <button
                          onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-semibold text-slate-900">{item.question}</span>
                          <svg
                            className={`w-5 h-5 text-slate-600 transition-transform flex-shrink-0 ${openFAQ === index ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openFAQ === index && (
                          <div className="px-4 pb-4 text-slate-600">
                            {item.answer}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Button - Fixed at the bottom */}
            <button
              type="button"
              onClick={() => setShowFAQ(!showFAQ)}
              className="w-full bg-white rounded-t-2xl py-4 px-6 cursor-pointer hover:bg-gray-50 transition-colors relative z-10"
              style={{
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-900 font-semibold text-lg">FAQ</span>
                <svg
                  className={`w-6 h-6 text-slate-600 transition-transform ${showFAQ ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;

