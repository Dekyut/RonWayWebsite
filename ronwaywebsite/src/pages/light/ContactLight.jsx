import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import contactUsBG from '../../assets/background/ContactUsBG.svg';
import wheelSvg from '../../assets/logos/Wheel.svg';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COUNTRIES } from '../../data/countries';
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

function ContactLight() {
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
  const [formRef, formVisible] = useScrollAnimation();
  const [contactRef, contactVisible] = useScrollAnimation();
  const [faqRef, faqVisible] = useScrollAnimation();
  
  const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001'; // Default test key
  
  const selectedCountry = COUNTRIES.find(c => c.phoneCode === selectedCountryCode) || COUNTRIES[0];

  const wordCount = formData.message.trim() ? formData.message.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
  const maxWords = 200;
  const isWordLimitExceeded = wordCount > maxWords;

  const handleInputChange = (field, value) => {
    if (field === 'message') {
      const words = value.trim() ? value.trim().split(/\s+/).filter(word => word.length > 0) : [];
      if (words.length <= maxWords || value.length < formData.message.length) {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    } else if (field === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '');
      let processedValue = numericValue;
      if (selectedCountryCode === '+63' && numericValue.length > 0) {
        if (!numericValue.startsWith('0')) {
          processedValue = '0' + numericValue;
        }
      }
      setFormData(prev => ({ ...prev, [field]: processedValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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

  useEffect(() => {
    if (selectedCountryCode === '+63' && formData.phoneNumber.length > 0) {
      const numericValue = formData.phoneNumber.replace(/\D/g, '');
      if (numericValue.length > 0 && !numericValue.startsWith('0')) {
        setFormData(prev => ({ ...prev, phoneNumber: '0' + numericValue }));
      } else if (numericValue.length > 0 && numericValue.startsWith('0')) {
        setFormData(prev => ({ ...prev, phoneNumber: numericValue }));
      }
    }
  }, [selectedCountryCode]);

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

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
        
        setRotation(scrollProgress * 360);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (showFAQ) {
      const scrollY = window.scrollY;
      const body = document.body;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const originalBodyPaddingRight = body.style.paddingRight;
      const originalBodyPosition = body.style.position;
      const originalBodyTop = body.style.top;
      const originalBodyWidth = body.style.width;
      
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      
      const timer = setTimeout(() => {
        body.style.paddingRight = originalBodyPaddingRight;
        body.style.position = originalBodyPosition;
        body.style.top = originalBodyTop;
        body.style.width = originalBodyWidth;
        window.scrollTo(0, scrollY);
      }, 500);
      
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
    <div id="contact" className="w-full bg-white" ref={sectionRef}>
      {/* Hero Section */}
      <section 
        className="relative w-full min-h-[50vh] flex items-center justify-center"
        style={{ 
          backgroundImage: `url(${contactUsBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#2cbafc]/10 via-white to-[#093389]/5"></div>
        
        {/* Wheel background element */}
        <div 
          className="fixed bottom-0 left-0 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-15 pointer-events-none"
          style={{
            transform: `translate(-30%, 30%) rotate(${rotation}deg)`,
            transition: 'transform 0.1s ease-out',
            zIndex: 0
          }}
        >
          <img 
            src={wheelSvg} 
            alt="Wheel" 
            className="w-full h-full object-contain"
            style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(2000%) hue-rotate(200deg) brightness(0.9) contrast(1.2)' }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 text-center relative z-10">
          <span className="text-sm font-medium tracking-widest uppercase text-[#2cbafc] mb-6 block">Contact Us</span>
          <h1 className="text-6xl md:text-8xl font-light text-[#0b0c0e] mb-6 leading-tight">
            Get In Touch
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#2cbafc] to-[#093389] mx-auto mb-8"></div>
          <p className="text-xl text-[#0b0c0e]/70 leading-relaxed max-w-2xl mx-auto mb-4">
            Email, Call, or complete the form to contact our team!
          </p>
          <p className="text-lg text-[#0b0c0e]/60 italic leading-relaxed max-w-2xl mx-auto">
            We would be honored to support your transport requirements.
          </p>
        </div>
      </section>

      {/* Contact Info & Form - Side by Side */}
      <section className="w-full py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={contactRef}
            className={`grid md:grid-cols-2 gap-12 transition-all duration-1000 ease-out ${
              contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Left: Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-light text-[#093389] mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-start gap-4 p-6 bg-[#2cbafc]/5 rounded-2xl border-l-4 border-[#093389] cursor-pointer"
                    whileHover={{
                      scale: 1.03,
                      y: -5,
                      boxShadow: "0_15px_35px_rgba(9,51,137,0.15)",
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-12 h-12 bg-[#093389] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wider mb-2 text-[#093389] font-semibold">EMAIL</p>
                      <p className="text-lg text-[#0b0c0e]">ronwaycars.travel@gmail.com</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start gap-4 p-6 bg-[#2cbafc]/5 rounded-2xl border-l-4 border-[#2cbafc] cursor-pointer"
                    whileHover={{
                      scale: 1.03,
                      y: -5,
                      boxShadow: "0_15px_35px_rgba(44,186,252,0.15)",
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-12 h-12 bg-[#2cbafc] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wider mb-2 text-[#093389] font-semibold">PHONE</p>
                      <p className="text-lg text-[#0b0c0e]">0977-302-2435</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-12">
                <h3 className="text-2xl font-semibold text-[#093389] mb-4">Our Location</h3>
                <div className="w-full h-[300px] bg-gray-200 rounded-2xl overflow-hidden border-2 border-[#2cbafc]/20">
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
                <p className="text-[#0b0c0e]/70 mt-4">
                  Spark Place, 317 P. Tuazon Blvd, Cubao, Quezon City, Metro Manila 1109
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <motion.div 
              ref={formRef}
              className={`bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-[#2cbafc]/20 cursor-pointer transition-all duration-1000 ease-out ${
                formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              whileHover={{
                scale: 1.02,
                y: -8,
                boxShadow: "0_30px_70px_rgba(44,186,252,0.25)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <h2 className="text-3xl font-semibold text-[#093389] mb-2">Send Us a Message</h2>
              <p className="text-[#0b0c0e]/60 mb-8">Fill out the form below and we'll get back to you soon.</p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-[#0b0c0e] placeholder:text-gray-400 focus:outline-none transition-colors ${
                        errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-[#2cbafc]/30 focus:border-[#093389]'
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
                      className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-[#0b0c0e] placeholder:text-gray-400 focus:outline-none transition-colors ${
                        errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-[#2cbafc]/30 focus:border-[#093389]'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-[#0b0c0e] placeholder:text-gray-400 focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#2cbafc]/30 focus:border-[#093389]'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <div className="relative country-dropdown-container">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full bg-white border-2 border-[#2cbafc]/30 rounded-xl px-3 py-3 text-[#0b0c0e] focus:outline-none focus:border-[#093389] cursor-pointer flex items-center justify-between"
                    >
                      <span className="text-sm">{selectedCountry.phoneCode}</span>
                      <svg
                        className={`w-4 h-4 text-[#093389] transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ReactCountryFlag
                        countryCode={selectedCountry.code}
                        svg
                        style={{ width: '1.2em', height: '1.2em' }}
                        title={selectedCountry.name}
                      />
                    </div>
                    
                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#2cbafc] rounded-xl shadow-xl z-50 max-h-[250px] overflow-y-auto">
                        {COUNTRIES.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountryCode(country.phoneCode);
                              setIsCountryDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                              selectedCountryCode === country.phoneCode ? 'bg-blue-100' : ''
                            }`}
                          >
                            <ReactCountryFlag
                              countryCode={country.code}
                              svg
                              style={{ width: '1.2em', height: '1.2em' }}
                              title={country.name}
                            />
                            <span className="text-[#0b0c0e]">{country.phoneCode}</span>
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
                      className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-[#0b0c0e] placeholder:text-gray-400 focus:outline-none transition-colors ${
                        errors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-[#2cbafc]/30 focus:border-[#093389]'
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
                    rows="5"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-[#0b0c0e] placeholder:text-gray-400 focus:outline-none resize-none transition-colors ${
                      errors.message || isWordLimitExceeded ? 'border-red-500 focus:border-red-500' : 'border-[#2cbafc]/30 focus:border-[#093389]'
                    }`}
                  />
                  <div className="absolute bottom-3 right-3">
                    <p className={`text-xs ${isWordLimitExceeded ? 'text-red-500 font-semibold' : wordCount > maxWords * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {wordCount}/{maxWords}
                    </p>
                  </div>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                {submitStatus && (
                  <div className={`p-4 rounded-xl ${
                    submitStatus === 'success' 
                      ? 'bg-green-50 text-green-800 border-2 border-green-300' 
                      : 'bg-red-50 text-red-800 border-2 border-red-300'
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
                  className={`w-full bg-gradient-to-r from-[#093389] to-[#2cbafc] text-white font-semibold py-4 rounded-xl transition-all ${
                    isSubmitting 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>
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
            className="bg-white rounded-3xl p-6 md:p-8 max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#2cbafc]/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl md:text-4xl font-semibold text-[#093389]">Confirm Submission</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-[#0b0c0e]/60 hover:text-[#0b0c0e] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-[#0b0c0e]/80 mb-6 text-lg">Are you sure you want to send this message?</p>

            <div className="space-y-4 mb-6">
              <div className="bg-[#2cbafc]/5 rounded-xl p-4 border-2 border-[#2cbafc]/20">
                <p className="text-sm text-[#093389] uppercase tracking-wider mb-2 font-semibold">Name</p>
                <p className="text-[#0b0c0e] font-medium">{formData.firstName} {formData.lastName}</p>
              </div>

              <div className="bg-[#2cbafc]/5 rounded-xl p-4 border-2 border-[#2cbafc]/20">
                <p className="text-sm text-[#093389] uppercase tracking-wider mb-2 font-semibold">Email</p>
                <p className="text-[#0b0c0e] font-medium">{formData.email}</p>
              </div>

              <div className="bg-[#2cbafc]/5 rounded-xl p-4 border-2 border-[#2cbafc]/20">
                <p className="text-sm text-[#093389] uppercase tracking-wider mb-2 font-semibold">Phone Number</p>
                <p className="text-[#0b0c0e] font-medium">{selectedCountryCode} {formData.phoneNumber}</p>
              </div>

              <div className="bg-[#2cbafc]/5 rounded-xl p-4 border-2 border-[#2cbafc]/20">
                <p className="text-sm text-[#093389] uppercase tracking-wider mb-2 font-semibold">Message</p>
                <p className="text-[#0b0c0e]/80 whitespace-pre-wrap">{formData.message}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#0b0c0e] font-semibold py-3 rounded-xl transition-colors border-2 border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 bg-gradient-to-r from-[#093389] to-[#2cbafc] hover:shadow-xl text-white font-semibold py-3 rounded-xl transition-all"
              >
                Confirm & Send
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* FAQ Section - Accordion Style */}
      <section className="w-full bg-gradient-to-b from-white to-[#f8fafc] py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div 
            ref={faqRef}
            className={`transition-all duration-1000 ease-out ${
              faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-16">
              <span className="text-sm font-medium tracking-widest uppercase text-[#2cbafc] mb-4 block">FAQ</span>
              <h2 className="text-5xl md:text-6xl font-light text-[#0b0c0e] mb-4">Frequently Asked Questions</h2>
              <div className="w-20 h-0.5 bg-[#2cbafc] mx-auto"></div>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl border border-[#2cbafc]/20 overflow-hidden shadow-lg cursor-pointer"
                  whileHover={{
                    scale: 1.02,
                    y: -5,
                    boxShadow: "0_20px_50px_rgba(44,186,252,0.25)",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[#2cbafc]/5 transition-colors"
                  >
                    <span className="text-lg font-semibold text-[#093389] pr-8">{item.question}</span>
                    <svg
                      className={`w-6 h-6 text-[#093389] transition-transform flex-shrink-0 ${openFAQ === index ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-6 text-[#0b0c0e]/70 leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactLight;
