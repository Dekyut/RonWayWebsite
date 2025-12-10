import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import bg1 from '../assets/background/BG 1.svg';
import wheelSvg from '../assets/logos/Wheel.svg';
import services1 from '../assets/placeholder/Services1.svg';
import services2 from '../assets/placeholder/Services2.svg';
import services3 from '../assets/placeholder/Services3.svg';
import airporttrans1 from '../assets/placeholder/airporttrans1.svg';
import logo from '../assets/logos/RonWayR-Black.png';

const SERVICE_CARDS = [
  {
    title: 'Rentals',
    description: 'Long-term car rental, including options for fleet management.',
    image: services1,
    modalContent: {
      title: 'What are Rentals?',
      description: 'Long-term car rental services provide you with flexible vehicle access for extended periods, including options for fleet management. Ronway Cars and Travels ensures reliable, well-maintained vehicles—perfect for businesses and individuals who need consistent transportation without the commitment of ownership.',
      image: services1
    }
  },
  {
    title: 'Airport Transfers',
    description: 'Pickup and drop-off services to and from airports, often pre-booked for convenience.',
    image: services2,
    modalContent: {
      title: 'What are Airport Transfers?',
      description: 'Airport transfers are pre-arranged transportation services that bring you from the airport to your destination or from your location to the airport. Ronway Cars and Travels ensures a smooth, stress-free ride—perfect for travelers who want convenience and reliability.',
      image: airporttrans1
    }
  },
  {
    title: 'One Way',
    description: 'The ability to pick up a car in one city and drop it off in another, suitable for road trips and relocation purposes.',
    image: services3,
    modalContent: {
      title: 'What is One Way Rentals?',
      description: 'One-way rentals allow you to pick up a vehicle in one location and drop it off in another, ideal for relocations and long-distance travel. Ronway Cars and Travels provides flexible drop-off options—perfect for travelers who need to end their journey at a different destination.',
      image: services3
    }
  }
];

const ORIGINAL_SERVICE_CARDS = [
  {
    title: 'PICK-UP/DROP-OFF',
    body: 'The ability to pick up a car in one city and drop it off in another, suitable for road trips and relocation purposes.'
  },
  {
    title: 'ROUNDTRIP SERVICE',
    body: 'The vehicle picks up passengers or cargo from a specified location and returns them to the same location.'
  },
  {
    title: 'STANDBY SERVICE',
    body: 'Driver waits for passengers or clients during a specified time.'
  }
];

const ADDONS = [
  'Dedicated chauffeur support line',
  'On-board Wi-Fi and refreshments',
  'Travel insurance coordination',
  'Event transport marshals'
];

function Services() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [openModalIndex, setOpenModalIndex] = useState(null);
  const sectionRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const hasSwiped = useRef(false);
  const mouseStartX = useRef(null);

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

  // Handle hash navigation for smooth scrolling to Process Flow
  useEffect(() => {
    const handleHashScroll = () => {
      if (location.hash === '#process-flow') {
        setTimeout(() => {
          const element = document.getElementById('process-flow');
          if (element) {
            const offset = 100; // Account for fixed headers
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 300);
      }
    };

    handleHashScroll();
  }, [location.hash]);


  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + SERVICE_CARDS.length) % SERVICE_CARDS.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % SERVICE_CARDS.length);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      hasSwiped.current = false;
    }
  };

  const handleTouchMove = (e) => {
    if (
      !e.touches ||
      e.touches.length === 0 ||
      touchStartX.current === null ||
      touchStartY.current === null ||
      hasSwiped.current
    ) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      hasSwiped.current = true;
      if (deltaX < 0) goNext();
      else goPrev();
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    touchStartY.current = null;
    hasSwiped.current = false;
  };

  const handleMouseDown = (e) => {
    mouseStartX.current = e.clientX;
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (mouseStartX.current === null) return;
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    if (mouseStartX.current === null) return;

    const deltaX = e.clientX - mouseStartX.current;
    const threshold = 50;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0) goNext();
      else goPrev();
    }

    mouseStartX.current = null;
  };

  const handleLearnMore = (index) => {
    setOpenModalIndex(index);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setOpenModalIndex(null);
    document.body.style.overflow = 'unset';
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && openModalIndex !== null) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [openModalIndex]);

  // Helper function to format description with bold phrases
  const formatDescription = (text) => {
    const phrasesToBold = [
      'Airport transfers',
      'from the airport to your destination',
      'from your location to the airport',
      'Ronway Cars and Travels'
    ];
    
    let formattedText = text;
    const parts = [];
    let lastIndex = 0;
    
    // Find all phrases to bold
    const matches = [];
    phrasesToBold.forEach(phrase => {
      const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0]
        });
      }
    });
    
    // Sort matches by start index
    matches.sort((a, b) => a.start - b.start);
    
    // Build parts array
    matches.forEach(match => {
      if (match.start > lastIndex) {
        parts.push({ text: text.substring(lastIndex, match.start), bold: false });
      }
      parts.push({ text: match.text, bold: true });
      lastIndex = match.end;
    });
    
    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), bold: false });
    }
    
    if (parts.length === 0) {
      return <span>{text}</span>;
    }
    
    return (
      <>
        {parts.map((part, idx) => 
          part.bold ? (
            <strong key={idx} className="font-bold text-black">{part.text}</strong>
          ) : (
            <span key={idx}>{part.text}</span>
          )
        )}
      </>
    );
  };

  return (
    <section 
      id="services" 
      ref={sectionRef}
      className="w-full py-16 px-4 md:py-20 md:px-8 flex flex-col justify-center relative"
    >
      {/* Background with BG 1.svg */}
      <div 
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${bg1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="fixed inset-0 bg-[#010915]/80 z-0" />

      {/* Wheel background element - fixed to viewport, behind content */}
      <div 
        className="fixed bottom-0 left-0 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-30 pointer-events-none"
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
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* Button to navigate to light theme */}
      <motion.div 
        className="max-w-[1100px] w-full mx-auto mb-8 relative" 
        style={{ zIndex: 10 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >

      </motion.div>

      {/* Original Service Cards Section */}
      <div className="max-w-[1200px] w-full mx-auto text-white space-y-12 relative" style={{ zIndex: 10 }}>
          <motion.div 
            className="space-y-4 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-sm uppercase tracking-[0.35em] text-[#85c1ff] font-semibold">Services</p>
            <h2 className="text-3xl md:text-4xl font-semibold">Mobility solutions for every itinerary</h2>
            <p className="text-base md:text-lg text-slate-300">
              Choose from flexible rental packages or let us design a managed program that keeps your guests and teams moving safely.
            </p>
          </motion.div>

          <motion.div 
            className="grid gap-6 md:grid-cols-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {ORIGINAL_SERVICE_CARDS.map((service, index) => (
              <motion.article
                key={service.title}
                className="rounded-2xl border border-slate-800 bg-gradient-to-b from-[#04132f] to-[#010915] p-6 shadow-[0_30px_45px_rgba(2,9,21,0.65)] cursor-pointer"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0_40px_60px_rgba(133,193,255,0.3)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-xl font-semibold mb-3 text-[#85c1ff]">{service.title}</h3>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed">{service.body}</p>
              </motion.article>
            ))}
          </motion.div>

          <motion.div 
            className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] items-center bg-[#021737] rounded-3xl border border-[#0b2f66] p-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <div>
              <h3 className="text-2xl font-semibold mb-3">Need something custom?</h3>
              <p className="text-slate-100 mb-6">
                Our coordinators can combine multiple services—airport runs, full-day deployments, convoy support—into one streamlined brief.
              </p>
              <ul className="grid gap-3 text-sm md:text-base">
                {ADDONS.map((addon) => (
                  <li key={addon} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#85c1ff]" aria-hidden />
                    <span>{addon}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#010915] border border-[#0b2f66] rounded-2xl p-6 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-3">Response time</p>
              <p className="text-4xl font-semibold text-[#85c1ff]">30 mins</p>
              <p className="text-sm text-slate-400 mt-2">Average dispatch confirmation from inquiry</p>
            </div>
          </motion.div>
        </div>

      {/* What We Offer Carousel Section */}
      <div id="what-we-offer" className="max-w-[1400px] w-full mx-auto relative mt-16" style={{ zIndex: 10 }}>
        {/* Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4">
            What We Offer
          </h2>
        </motion.div>

        {/* Carousel Container */}
        <div 
          className="relative w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Carousel Track - Show all cards on desktop, single on mobile */}
          <div className="relative overflow-hidden">
            {/* Desktop: Show all 3 cards side by side */}
            <div className="hidden md:flex gap-6 lg:gap-8 justify-center items-stretch">
              {SERVICE_CARDS.map((service, index) => (
                <motion.div
                  key={index}
                  className="flex-1 max-w-sm"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.15, ease: "easeOut" }}
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
                    {/* Service Image */}
                    <div className="w-full h-48 lg:h-56 bg-gray-100 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                    
                    {/* Service Content */}
                    <div className="p-5 lg:p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl lg:text-3xl font-bold text-black mb-4">
                        {service.title}
                      </h3>
                      <p className="text-base lg:text-lg text-gray-700 mb-6 leading-relaxed flex-1">
                        {service.description}
                      </p>
                      
                      {/* Learn More Button */}
                      <button
                        onClick={() => handleLearnMore(index)}
                        className="w-full py-3 px-6 border-2 rounded-lg font-semibold transition-all hover:bg-[#85c1ff] hover:!text-white active:scale-95 text-[#85c1ff]"
                        style={{
                          borderColor: '#85c1ff',
                        }}
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile: Single card carousel */}
            <div className="md:hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`
                }}
              >
                {SERVICE_CARDS.map((service, index) => (
                  <motion.div
                    key={index}
                    className="w-full flex-shrink-0 px-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto">
                      {/* Service Image */}
                      <div className="w-full h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      </div>
                      
                      {/* Service Content */}
                      <div className="p-5">
                        <h3 className="text-2xl font-bold text-black mb-4">
                          {service.title}
                        </h3>
                        <p className="text-base text-gray-700 mb-6 leading-relaxed">
                          {service.description}
                        </p>
                        
                        {/* Learn More Button */}
                        <button
                          onClick={() => handleLearnMore(index)}
                          className="w-full py-3 px-6 border-2 rounded-lg font-semibold transition-all hover:bg-[#85c1ff] hover:!text-white active:scale-95 text-[#85c1ff]"
                          style={{
                            borderColor: '#85c1ff',
                          }}
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Arrows - Only show on mobile */}
          <button
            onClick={goPrev}
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all z-20"
            aria-label="Previous service"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goNext}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all z-20"
            aria-label="Next service"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Pagination Dots - Only show on mobile */}
          <div className="md:hidden flex justify-center gap-2 mt-8">
            {SERVICE_CARDS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-[#85c1ff] w-8'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div 
        className="max-w-[1200px] w-full mx-auto relative mt-20 mb-16"
        style={{ zIndex: 10 }}
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-sm uppercase tracking-[0.35em] text-[#85c1ff] font-semibold mb-4">Why Choose Us?</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Why Choose Ronway?
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We take pride in delivering transport solutions marked by professionalism, efficiency, and premium hospitality.
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {[
            'Modern, Well-Maintained Vehicles',
            'Professional and Trained Drivers',
            'Safe, Comfortable, and Stress-Free Travel',
            'Fast Response and Reliable Coordination',
            'Competitive and Negotiable Corporate Rates',
            'Customizable Transport Packages'
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-2xl border border-slate-800 bg-gradient-to-b from-[#04132f] to-[#010915] p-6 shadow-[0_30px_45px_rgba(2,9,21,0.65)] cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: "0_40px_60px_rgba(133,193,255,0.3)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <svg 
                    className="w-6 h-6 text-[#85c1ff]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2.5} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <p className="text-base md:text-lg text-slate-200 leading-relaxed font-medium">
                  {feature}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <p className="text-xl md:text-2xl font-semibold text-white">
            Your comfort and safety are our priority.
          </p>
        </motion.div>
      </div>

      {/* Ronway Process Flow Section */}
      <div 
        id="process-flow"
        className="max-w-[1200px] w-full mx-auto relative mt-20 mb-16 scroll-mt-20"
        style={{ zIndex: 10 }}
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-sm uppercase tracking-[0.35em] text-[#85c1ff] font-semibold mb-4">Our Process</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            RONWAY PROCESS FLOW
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A streamlined process designed for your convenience and peace of mind.
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {/* A. Booking & Availability */}
          <motion.div
            className="bg-gradient-to-b from-[#04132f] to-[#010915] rounded-2xl border-2 border-[#0b2f66] p-6 shadow-[0_30px_45px_rgba(2,9,21,0.65)] transition-all duration-300 hover:border-[#85c1ff]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            <div className="mb-4">
              <div className="w-16 h-16 bg-[#85c1ff]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg 
                  className="w-8 h-8 text-[#85c1ff]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#85c1ff] text-center">Booking & Availability</h3>
            </div>
            <ul className="space-y-2 text-sm md:text-base text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-[#85c1ff] mt-1">•</span>
                <span>Transport Officer receives booking requests from clients.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#85c1ff] mt-1">•</span>
                <span>Checks the availability of drivers and vehicles.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#85c1ff] mt-1">•</span>
                <span>Provides competitive rates based on the service requirements.</span>
              </li>
            </ul>
          </motion.div>

          {/* B. Confirmation */}
          <motion.div
            className="bg-gradient-to-b from-[#04132f] to-[#010915] rounded-2xl border-2 border-[#0b2f66] p-6 shadow-[0_30px_45px_rgba(2,9,21,0.65)] transition-all duration-300 hover:border-[#85c1ff]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <div className="mb-4">
              <div className="w-16 h-16 bg-[#85c1ff]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg 
                  className="w-8 h-8 text-[#85c1ff]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#85c1ff] text-center">Confirmation</h3>
            </div>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed">
              Once a vehicle unit and driver are confirmed, Ronway sends the official confirmation to the client via email only, ensuring proper documentation and easy tracking of all service details.
            </p>
          </motion.div>

          {/* C. Dispatching */}
          <motion.div
            className="bg-gradient-to-b from-[#04132f] to-[#010915] rounded-2xl border-2 border-[#0b2f66] p-6 shadow-[0_30px_45px_rgba(2,9,21,0.65)] transition-all duration-300 hover:border-[#85c1ff]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            <div className="mb-4">
              <div className="w-16 h-16 bg-[#85c1ff]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg 
                  className="w-8 h-8 text-[#85c1ff]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#85c1ff] text-center">Dispatching</h3>
            </div>
            <ul className="space-y-2 text-sm md:text-base text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-[#85c1ff] mt-1">•</span>
                <span>Ronway dispatches the assigned driver and vehicle.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#85c1ff] mt-1">•</span>
                <span>All service details are relayed to the driver for proper execution.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#85c1ff] mt-1">•</span>
                <span>Using the Trip Ticket, the driver checks the indicated checklist to ensure the unit is in good condition—clean, complete, and without any issues, before proceeding with the service.</span>
              </li>
            </ul>
          </motion.div>

          {/* D. Real-Time Monitoring */}
          <motion.div
            className="bg-gradient-to-b from-[#04132f] to-[#010915] rounded-2xl border-2 border-[#0b2f66] p-6 shadow-[0_30px_45px_rgba(2,9,21,0.65)] transition-all duration-300 hover:border-[#85c1ff]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          >
            <div className="mb-4">
              <div className="w-16 h-16 bg-[#85c1ff]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg 
                  className="w-8 h-8 text-[#85c1ff]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#85c1ff] text-center">Real-Time Monitoring</h3>
            </div>
            <ul className="space-y-2 text-sm md:text-base text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-[#85c1ff] mt-1">•</span>
                <span>Driver reports updates through the official group chat (GC).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#85c1ff] mt-1">•</span>
                <span>Timestamp camera is used to capture proof of Pick-Up and Drop-Off (PUDO).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#85c1ff] mt-1">•</span>
                <span>Vehicle movement is monitored using car tracking to ensure service visibility and safety.</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Complimentary Amenities Section */}
      <div 
        className="max-w-[1200px] w-full mx-auto relative mt-20 mb-16"
        style={{ zIndex: 10 }}
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-sm uppercase tracking-[0.35em] text-[#85c1ff] font-semibold mb-4">Complimentary</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Complimentary Amenities
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We provide complimentary amenities to ensure your comfort throughout your journey.
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {[
            { 
              title: 'Complimentary Water', 
              description: 'Stay hydrated with our complimentary bottled water available in all vehicles.',
              icon: '💧'
            },
            { 
              title: 'Alcohol & Sanitizers', 
              description: 'We provide hand sanitizers and alcohol for your hygiene and safety.',
              icon: '🧴'
            },
            { 
              title: 'Wet Wipes', 
              description: 'Fresh wet wipes are available for your convenience and comfort.',
              icon: '🧻'
            }
          ].map((amenity, index) => (
            <motion.div
              key={index}
              className="rounded-2xl border border-slate-800 bg-gradient-to-b from-[#04132f] to-[#010915] p-6 shadow-[0_30px_45px_rgba(2,9,21,0.65)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: "0_40px_60px_rgba(133,193,255,0.3)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-5xl mb-4 text-center">{amenity.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-[#85c1ff] text-center">{amenity.title}</h3>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed text-center">{amenity.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>


      {/* Modal */}
      {openModalIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-[1000px] max-h-[85vh] md:w-[1000px] md:h-[600px] shadow-2xl flex flex-col md:flex-row relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Panel - Text Content */}
            <div className="w-full md:w-1/2 p-6 md:p-12 bg-[#f8f9fa] flex flex-col overflow-y-auto flex-1 min-h-0 relative">
              {/* Close Button - Mobile Only */}
              <button
                onClick={handleCloseModal}
                className="md:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black/80 rounded-full transition-colors text-white z-10"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Logo */}
              <div className="mb-6 -mt-2 -ml-2 md:-mt-4 md:-ml-4">
                <img 
                  src={logo} 
                  alt="Ronway Logo" 
                  className="w-19 h-19 md:w-27 md:h-27 object-contain"
                />
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                {SERVICE_CARDS[openModalIndex].modalContent.title}
              </h2>

              {/* Description */}
              <p className="text-base md:text-lg text-gray-700 leading-relaxed flex-1">
                {formatDescription(SERVICE_CARDS[openModalIndex].modalContent.description)}
              </p>
            </div>

            {/* Right Panel - Image */}
            <div className="w-full md:w-1/2 relative bg-gray-100 h-[200px] md:h-full flex-shrink-0">
              <img
                src={SERVICE_CARDS[openModalIndex].modalContent.image}
                alt={SERVICE_CARDS[openModalIndex].title}
                className="w-full h-full object-cover"
              />
              
              {/* Close Button - Desktop Only */}
              <button
                onClick={handleCloseModal}
                className="hidden md:flex absolute top-4 right-4 w-10 h-10 items-center justify-center bg-black/60 hover:bg-black/80 rounded-full transition-colors text-white z-10"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Services;

