import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import bg1 from '../../assets/background/BG 1.svg';
import wheelSvg from '../../assets/logos/Wheel.svg';
import services1 from '../../assets/placeholder/Services1.svg';
import services2 from '../../assets/placeholder/Services2.svg';
import services3 from '../../assets/placeholder/Services3.svg';
import airporttrans1 from '../../assets/placeholder/airporttrans1.svg';
import logo from '../../assets/logos/RonWayR-Black.png';

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

function ServicesLight() {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const sectionRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openModalIndex, setOpenModalIndex] = useState(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const hasSwiped = useRef(false);
  const mouseStartX = useRef(null);

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

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + SERVICE_CARDS.length) % SERVICE_CARDS.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % SERVICE_CARDS.length);

  const handleTouchStart = (event) => {
    if (event.touches && event.touches.length > 0) {
      touchStartX.current = event.touches[0].clientX;
      touchStartY.current = event.touches[0].clientY;
      hasSwiped.current = false;
    }
  };

  const handleTouchMove = (event) => {
    if (
      !event.touches ||
      event.touches.length === 0 ||
      touchStartX.current === null ||
      touchStartY.current === null ||
      hasSwiped.current
    ) {
      return;
    }

    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      hasSwiped.current = true;
      if (deltaX < 0) {
        goNext();
      } else {
        goPrev();
      }
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
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setOpenModalIndex(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && openModalIndex !== null) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [openModalIndex]);

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
    
    matches.sort((a, b) => a.start - b.start);
    
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
            <strong key={idx} className="font-bold text-[#093389]">{part.text}</strong>
          ) : (
            <span key={idx}>{part.text}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className="w-full bg-white" id="services">
      {/* Hero Section */}
      <section 
        ref={sectionRef}
        className="relative w-full min-h-[50vh] flex items-center justify-center"
        style={{ 
          backgroundImage: `url(${bg1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
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
          <button
            onClick={() => navigate('/services')}
            className="absolute top-6 left-6 bg-white text-[#093389] px-6 py-3 rounded-full font-semibold hover:bg-[#2cbafc] hover:text-white transition-all shadow-lg border-2 border-[#2cbafc]"
          >
            ← Back to Original Site
          </button>
          <span className="text-sm font-medium tracking-widest uppercase text-[#2cbafc] mb-6 block">Services</span>
          <h1 className="text-6xl md:text-8xl font-light text-[#0b0c0e] mb-6 leading-tight">
            Mobility Solutions
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#2cbafc] to-[#093389] mx-auto mb-8"></div>
          <p className="text-xl text-[#0b0c0e]/70 leading-relaxed max-w-2xl mx-auto">
            Choose from flexible rental packages or let us design a managed program that keeps your guests and teams moving safely.
          </p>
        </div>
      </section>

      {/* Main Services - Tabbed Interface */}
      <section className="w-full py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Service Cards - Horizontal Layout */}
          <div className="space-y-8 mb-16">
            {ORIGINAL_SERVICE_CARDS.map((service, index) => (
              <motion.div
                key={service.title}
                className={`group flex flex-col md:flex-row items-center gap-8 p-8 bg-gradient-to-r ${
                  index % 2 === 0 
                    ? 'from-white to-[#2cbafc]' 
                    : 'from-[#093389] to-white'
                } rounded-3xl border border-[#2cbafc]/20 cursor-pointer`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  boxShadow: "0_20px_40px_rgba(44,186,252,0.25)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-1">
                  <div className="text-5xl mb-4">{index === 0 ? '🏢' : index === 1 ? '✈️' : '🌴'}</div>
                  <h3 className="text-3xl font-semibold text-[#093389] mb-4">{service.title}</h3>
                  <p className="text-lg text-[#0b0c0e]/70 leading-relaxed">{service.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom Services CTA */}
          <div className="bg-gradient-to-br from-[#093389] to-[#2cbafc] rounded-3xl p-10 md:p-16 text-white mb-16">
            <div className="max-w-4xl">
              <h2 className="text-4xl md:text-5xl font-light mb-6">Need Something Custom?</h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Our coordinators can combine multiple services—airport runs, full-day deployments, convoy support—into one streamlined brief.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {ADDONS.map((addon) => (
                  <div key={addon} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-white/90">{addon}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                <p className="text-sm uppercase tracking-widest text-white/80 mb-2">Response Time</p>
                <p className="text-5xl font-light mb-2">30 mins</p>
                <p className="text-sm text-white/80">Average dispatch confirmation from inquiry</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Carousel Section */}
      <section className="w-full py-20 px-6 md:px-12 bg-gradient-to-b from-white to-[#f8fafc]">
        <div className="max-w-[1400px] w-full mx-auto relative" style={{ zIndex: 10 }}>
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0b0c0e] mb-4">
              What We Offer
            </h2>
          </div>

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
                  <div
                    key={index}
                    className="flex-1 max-w-sm"
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
                        <h3 className="text-2xl lg:text-3xl font-bold text-[#0b0c0e] mb-4">
                          {service.title}
                        </h3>
                        <p className="text-base lg:text-lg text-[#0b0c0e]/70 mb-6 leading-relaxed flex-1">
                          {service.description}
                        </p>
                        
                        {/* Learn More Button */}
                        <button
                          onClick={() => handleLearnMore(index)}
                          className="w-full py-3 px-6 border-2 rounded-lg font-semibold transition-all hover:bg-[#2cbafc] hover:!text-white active:scale-95 text-[#2cbafc]"
                          style={{
                            borderColor: '#2cbafc',
                          }}
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
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
                    <div
                      key={index}
                      className="w-full flex-shrink-0 px-4"
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
                          <h3 className="text-2xl font-bold text-[#0b0c0e] mb-4">
                            {service.title}
                          </h3>
                          <p className="text-base text-[#0b0c0e]/70 mb-6 leading-relaxed">
                            {service.description}
                          </p>
                          
                          {/* Learn More Button */}
                          <button
                            onClick={() => handleLearnMore(index)}
                            className="w-full py-3 px-6 border-2 rounded-lg font-semibold transition-all hover:bg-[#2cbafc] hover:!text-white active:scale-95 text-[#2cbafc]"
                            style={{
                              borderColor: '#2cbafc',
                            }}
                          >
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Arrows - Only show on mobile */}
            <button
              onClick={goPrev}
              className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-3 transition-all z-20 shadow-lg"
              aria-label="Previous service"
            >
              <svg
                className="w-6 h-6 text-[#0b0c0e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goNext}
              className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-3 transition-all z-20 shadow-lg"
              aria-label="Next service"
            >
              <svg
                className="w-6 h-6 text-[#0b0c0e]"
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
                      ? 'bg-[#2cbafc] w-8'
                      : 'bg-[#0b0c0e]/30 hover:bg-[#0b0c0e]/50'
                  }`}
                  aria-label={`Go to service ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {openModalIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0c0e]/60 backdrop-blur-sm"
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
                className="md:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#0b0c0e]/60 hover:bg-[#0b0c0e]/80 rounded-full transition-colors text-white z-10"
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#0b0c0e] mb-6">
                {SERVICE_CARDS[openModalIndex].modalContent.title}
              </h2>

              {/* Description */}
              <p className="text-base md:text-lg text-[#0b0c0e]/70 leading-relaxed flex-1">
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
                className="hidden md:flex absolute top-4 right-4 w-10 h-10 items-center justify-center bg-[#0b0c0e]/60 hover:bg-[#0b0c0e]/80 rounded-full transition-colors text-white z-10"
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
    </div>
  );
}

export default ServicesLight;
