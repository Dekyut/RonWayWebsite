import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import homeBg from '../../assets/background/Home-BG.png';
import wheelSvg from '../../assets/logos/Wheel.svg';
import { CARS } from '../../data/cars';
import { GOOGLE_REVIEWS } from '../../data/reviews';
import { ALL_GALLERY_IMAGES } from '../../data/gallery';
import ContinuousScrollingGallery from '../../components/ContinuousScrollingGallery';
import GoogleReviewsCarousel from '../../components/GoogleReviewsCarousel';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';


function HomeLight() {
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [filteredCars, setFilteredCars] = useState(CARS);
  const [selectedCar, setSelectedCar] = useState(null);
  const [rotation, setRotation] = useState(0);
  const sectionRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const hasSwiped = useRef(false);
  const mouseStartX = useRef(null);
  const hasDragged = useRef(false);
  
  const [searchRef, searchVisible] = useScrollAnimation();
  const [carouselRef, carouselVisible] = useScrollAnimation();
  const [galleryRef, galleryVisible] = useScrollAnimation();

  const handleSearch = () => {
    let filtered = CARS;
    if (selectedCategory) {
      filtered = filtered.filter((car) => car.category === selectedCategory);
    }
    if (selectedSeats) {
      filtered = filtered.filter((car) => car.seats === parseInt(selectedSeats));
    }
    setFilteredCars(filtered);
    setCurrentCarIndex(0);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    let filtered = CARS;
    if (category) {
      filtered = filtered.filter((car) => car.category === category);
    }
    if (selectedSeats) {
      filtered = filtered.filter((car) => car.seats === parseInt(selectedSeats));
    }
    setFilteredCars(filtered);
    setCurrentCarIndex(0);
  };

  const goPrev = () => setCurrentCarIndex((prev) => (prev - 1 + filteredCars.length) % filteredCars.length);
  const goNext = () => setCurrentCarIndex((prev) => (prev + 1) % filteredCars.length);

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

  const handleMouseDown = (event) => {
    mouseStartX.current = event.clientX;
    hasDragged.current = false;
    event.preventDefault();
  };

  const handleMouseMove = (event) => {
    if (mouseStartX.current === null) return;
    const deltaX = Math.abs(event.clientX - mouseStartX.current);
    if (deltaX > 5) {
      hasDragged.current = true;
    }
    event.preventDefault();
  };

  const handleMouseUp = (event) => {
    if (mouseStartX.current === null) return;
    const deltaX = event.clientX - mouseStartX.current;
    const swipeThreshold = 50;
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    mouseStartX.current = null;
    setTimeout(() => {
      hasDragged.current = false;
    }, 100);
  };

  const handleDragStart = (event) => event.preventDefault();

  useEffect(() => {
    if (filteredCars.length > 0 && currentCarIndex >= filteredCars.length) {
      setCurrentCarIndex(0);
    }
  }, [filteredCars, currentCarIndex]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedCar) {
        setSelectedCar(null);
      }
    };
    if (selectedCar) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedCar]);

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

  return (
    <div className="w-full flex flex-col overflow-x-hidden bg-white" id="home">
      {/* Minimalist Hero Section - Split Screen Design */}
      <section 
        ref={sectionRef}
        className="relative w-full min-h-screen flex items-center"
        style={{ 
          backgroundImage: `url(${homeBg})`,
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
        
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="text-sm font-medium tracking-widest uppercase text-[#2cbafc] mb-4 block">Premium Transportation</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-light tracking-tight text-[#0b0c0e] leading-none">
                RONWAY
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-[#2cbafc] to-[#093389]"></div>
              <p className="text-xl md:text-2xl font-light text-[#0b0c0e]/70 leading-relaxed max-w-lg">
                We Take You Places.
              </p>
              <p className="text-base text-[#0b0c0e]/60 leading-relaxed max-w-lg">
                Your trusted partner for premium car rentals and seamless travel solutions. Experience exceptional service, reliable vehicles, and unforgettable journeys.
              </p>
            </div>
            
            {/* Right: Search Panel - Floating Design */}
            <motion.div 
              ref={searchRef}
              className={`bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-[#2cbafc]/20 cursor-pointer transition-all duration-1000 ease-out ${
                searchVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              whileHover={{
                scale: 1.03,
                y: -8,
                boxShadow: "0_30px_70px_rgba(44,186,252,0.25)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <h2 className="text-2xl font-semibold text-[#093389] mb-6">Find Your Perfect Ride</h2>
              
              {/* Category Pills */}
              <div className="flex flex-wrap gap-3 mb-6">
                {['All Cars', 'SUV', 'MPV', 'Van'].map((cat) => {
                  const category = cat === 'All Cars' ? null : cat;
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryFilter(category)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#093389] text-white shadow-lg'
                          : 'bg-[#2cbafc]/10 text-[#093389] hover:bg-[#2cbafc]/20'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Seats Dropdown */}
              <div className="relative mb-6">
                <select
                  value={selectedSeats || ''}
                  onChange={(e) => setSelectedSeats(e.target.value || null)}
                  className="w-full px-4 py-3 bg-white border-2 border-[#2cbafc]/30 rounded-xl text-[#0b0c0e] focus:outline-none focus:border-[#093389] transition-colors appearance-none cursor-pointer"
                >
                  <option value="">All Seating Options</option>
                  <option value="7">7 Seater</option>
                  <option value="15">15 Seater</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-[#093389]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-[#093389] to-[#2cbafc] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Search Fleet
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fleet Showcase - Grid Layout Instead of Carousel */}
      <section className="w-full bg-gradient-to-b from-white to-[#f8fafc] py-20 px-6 md:px-12">
        <div 
          ref={carouselRef}
          className={`max-w-7xl mx-auto transition-all duration-1000 ease-out ${
            carouselVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <span className="text-sm font-medium tracking-widest uppercase text-[#2cbafc] mb-4 block">Our Fleet</span>
            <h2 className="text-5xl md:text-6xl font-light text-[#0b0c0e] mb-4">Explore Our Collection</h2>
            <div className="w-20 h-0.5 bg-[#2cbafc] mx-auto"></div>
          </div>

          {filteredCars.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car.name}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer border border-[#2cbafc]/10"
                  onClick={() => setSelectedCar(car)}
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                    boxShadow: "0_25px_60px_rgba(44,186,252,0.25)",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#2cbafc]/10 to-[#093389]/10 overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      draggable={false}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-[#093389] mb-2">{car.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#0b0c0e]/60 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        {car.seats} Seats
                      </span>
                      <span>{car.category}</span>
                    </div>
                    <div className="pt-4 border-t border-[#2cbafc]/20">
                      <span className="text-[#2cbafc] font-medium text-sm">View Details →</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-[#0b0c0e]/60">No cars found matching your criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Car Details Modal - Side Panel Design */}
      {selectedCar && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-end"
          style={{ backgroundColor: 'rgba(11, 12, 14, 0.6)' }}
          onClick={() => setSelectedCar(null)}
        >
          <div
            className="bg-white w-full md:w-[600px] h-[90vh] md:h-auto max-h-[90vh] overflow-y-auto shadow-2xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-[#2cbafc]/20 p-6 flex justify-between items-center z-10">
              <h2 className="text-3xl font-semibold text-[#093389]">{selectedCar.name}</h2>
              <button
                onClick={() => setSelectedCar(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#2cbafc]/10 transition-colors"
              >
                <svg className="w-6 h-6 text-[#0b0c0e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="aspect-video bg-gradient-to-br from-[#2cbafc]/10 to-[#093389]/10 rounded-xl overflow-hidden">
                <img
                  src={selectedCar.image}
                  alt={selectedCar.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#2cbafc]/5 rounded-xl">
                  <p className="text-sm text-[#0b0c0e]/60 mb-1">Type</p>
                  <p className="font-semibold text-[#093389]">{selectedCar.category}</p>
                </div>
                <div className="p-4 bg-[#2cbafc]/5 rounded-xl">
                  <p className="text-sm text-[#0b0c0e]/60 mb-1">Seats</p>
                  <p className="font-semibold text-[#093389]">{selectedCar.seats} seater</p>
                </div>
                <div className="p-4 bg-[#2cbafc]/5 rounded-xl">
                  <p className="text-sm text-[#0b0c0e]/60 mb-1">Transmission</p>
                  <p className="font-semibold text-[#093389]">{selectedCar.transmission}</p>
                </div>
                <div className="p-4 bg-[#2cbafc]/5 rounded-xl">
                  <p className="text-sm text-[#0b0c0e]/60 mb-1">Fuel</p>
                  <p className="font-semibold text-[#093389]">{selectedCar.fuelType}</p>
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <p className="text-[#0b0c0e] leading-relaxed">{selectedCar.description}</p>
                <p className="text-[#0b0c0e] leading-relaxed">{selectedCar.description2}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Section - Minimalist */}
      <section className="w-full bg-white py-20 px-6 md:px-12">
        <div 
          ref={galleryRef}
          className={`max-w-7xl mx-auto transition-all duration-1000 ease-out ${
            galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <span className="text-sm font-medium tracking-widest uppercase text-[#2cbafc] mb-4 block">Gallery</span>
            <h2 className="text-5xl md:text-6xl font-light text-[#0b0c0e] mb-4">Our Journey</h2>
            <div className="w-20 h-0.5 bg-[#2cbafc] mx-auto"></div>
          </div>
          <ContinuousScrollingGallery images={ALL_GALLERY_IMAGES} />
        </div>
      </section>

      {/* Reviews Section - Clean Design */}
      <section className="w-full bg-gradient-to-b from-[#f8fafc] to-white py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium tracking-widest uppercase text-[#2cbafc] mb-4 block">Testimonials</span>
            <h2 className="text-5xl md:text-6xl font-light text-[#0b0c0e] mb-4">What Our Clients Say</h2>
            <div className="w-20 h-0.5 bg-[#2cbafc] mx-auto"></div>
          </div>
          <GoogleReviewsCarousel reviews={GOOGLE_REVIEWS} autoPlayInterval={4000} />
        </div>
      </section>
    </div>
  );
}

export default HomeLight;
