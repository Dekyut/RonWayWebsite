import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import homeBg from '../assets/background/RONWAYFINALBG.svg';
import { CARS } from '../data/cars';
import { GOOGLE_REVIEWS } from '../data/reviews';
import { ALL_GALLERY_IMAGES } from '../data/gallery';
import ContinuousScrollingGallery from '../components/ContinuousScrollingGallery';
import GoogleReviewsCarousel from '../components/GoogleReviewsCarousel';
import { useScrollAnimation } from '../hooks/useScrollAnimation';


function Home() {
  const [currentCarIndex, setCurrentCarIndex] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [filteredCars, setFilteredCars] = useState(CARS);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const hasSwiped = useRef(false);
  const mouseStartX = useRef(null);
  const hasDragged = useRef(false);
  
  const [searchRef, searchVisible] = useScrollAnimation();
  const [carouselRef, carouselVisible] = useScrollAnimation();
  const [galleryRef, galleryVisible] = useScrollAnimation();
  const filterButtonsRef = useRef([]);

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
    // Reset after a short delay to allow click handler to check
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

  // Handle ESC key to close car modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isFullScreen) {
          setIsFullScreen(false);
          setZoomLevel(1);
          setPanPosition({ x: 0, y: 0 });
        } else if (selectedCar) {
          setSelectedCar(null);
        }
      }
    };

    if (selectedCar || isFullScreen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedCar, isFullScreen]);

  // Reset image index when car changes
  useEffect(() => {
    if (selectedCar) {
      setSelectedImageIndex(0);
    }
  }, [selectedCar]);

  // Handle wheel zoom in fullscreen
  const handleFullScreenWheel = (e) => {
    if (!isFullScreen) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel((prev) => Math.max(0.5, Math.min(5, prev + delta)));
  };

  // Handle mouse drag for panning in fullscreen
  const handleFullScreenMouseDown = (e) => {
    if (!isFullScreen || zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleFullScreenMouseMove = (e) => {
    if (!isDragging || !isFullScreen || zoomLevel <= 1) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleFullScreenMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch for mobile zoom in fullscreen
  const touchDistanceRef = useRef(null);
  const handleFullScreenTouchStart = (e) => {
    if (!isFullScreen) return;
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      touchDistanceRef.current = distance;
    }
  };

  const handleFullScreenTouchMove = (e) => {
    if (!isFullScreen || e.touches.length !== 2) return;
    e.preventDefault();
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    if (touchDistanceRef.current) {
      const scale = distance / touchDistanceRef.current;
      setZoomLevel((prev) => Math.max(0.5, Math.min(5, prev * scale)));
      touchDistanceRef.current = distance;
    }
  };

  return (
    <div className="w-full flex flex-col overflow-x-hidden relative" id="home">
      <style>{`
        .hero-text-container {
          pointer-events: none;
        }
        .hero-text-container * {
          pointer-events: auto;
        }
      `}</style>
      {/* Top Section with Background Image and Text */}
      <section className="relative w-full bg-transparent">
        <div className="relative w-full">
          <img 
            src={homeBg} 
            alt="RonWay Background" 
            className="w-full h-auto block relative"
          />
          
          {/* Text Section - Bottom part of top half of background image */}
          <div 
            className="absolute left-0 w-full z-30 px-[clamp(0.75rem,2vw,1rem)] sm:px-[clamp(1rem,2vw,1.5rem)] md:px-[clamp(1.5rem,4vw,2rem)] top-[clamp(30%,35vh,40%)] sm:top-[40%] md:top-[45%] pb-[clamp(3rem,6vh,4rem)] sm:pb-0"
          >
            <div className="max-w-[1200px] mx-auto text-center text-white px-2 sm:px-4 pb-[clamp(3rem,6vh,4rem)] sm:pb-0">
              <p
                className="font-bold mb-[clamp(0.5rem,1.5vh,1rem)] sm:mb-[clamp(0.75rem,2vh,1.5rem)] font-['Montserrat',sans-serif] text-center opacity-60 text-[clamp(1.5rem,4vh,2.5rem)] sm:text-[clamp(1.75rem,4.5vh,3rem)] md:text-[clamp(2rem,5vh,3.5rem)]"
              >
                We Take You Places.
              </p>
              <p className="text-[clamp(0.7rem,1.6vh,0.95rem)] sm:text-[clamp(0.85rem,2vh,1.15rem)] md:text-[clamp(0.9rem,2.2vh,1.2rem)] font-normal mb-[clamp(3rem,6vh,4rem)] sm:mb-[clamp(4rem,8vh,6rem)] mt-[clamp(0.5rem,1.5vh,1rem)] sm:mt-[clamp(1rem,2.5vh,1.5rem)] pb-[clamp(2rem,4vh,3rem)] sm:pb-0 font-['Montserrat',sans-serif] text-center leading-[1.3] sm:leading-relaxed">
                <span className="block sm:inline">Your trusted partner for premium car rentals and seamless travel solutions.</span>
                <span className="hidden sm:inline"> </span>
                <br className="hidden sm:block" />
                <span className="block sm:inline">At RonWay, we pride ourselves on delivering exceptional service, reliable vehicles, and unforgettable travel experiences tailored</span>
                <span className="hidden sm:inline"> </span>
                <br className="hidden sm:block" />
                <span className="block sm:inline">to your needs. Whether you're planning a road trip, a business journey, or a luxury ride, we're here to make your travels smooth, safe, and enjoyable.</span>
                <span className="hidden sm:inline"> </span>
                <br className="hidden sm:block" />
                <span className="block sm:inline">Explore our fleet, book with confidence, and let us take you where you need to go.</span>
                <span className="hidden sm:inline"> </span>
                <br className="hidden sm:block" />
                <span className="block sm:inline">Experience the RonWay difference today!</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Empty Black Section - Spacer between text and search */}
      <section className="w-full bg-black pt-[clamp(0.5rem,1vh,1rem)] pb-[clamp(1rem,2vh,1.5rem)] sm:py-[clamp(0.5rem,1vh,1rem)]"></section>

      {/* Search Form Section - Separate, no overlap */}
      <section className="relative w-full bg-black px-4 md:px-8 py-[clamp(2rem,4vh,3rem)] flex flex-col items-center">
          <div 
            ref={searchRef}
            className={`max-w-[1200px] w-full transition-all duration-1000 ease-out ${
              searchVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
          {/* Filter Tabs - Outside the white container */}
          <div className="flex gap-0 mb-0 flex-wrap relative mb-0">
            {[
              { label: 'All Cars', value: null },
              { label: 'SUV', value: 'SUV' },
              { label: 'MPV', value: 'MPV' },
              { label: 'Van', value: 'Van' }
            ].map((filter, index) => {
              const isActive = selectedCategory === filter.value;
              const bgColors = ['bg-[#1e3a8a]', 'bg-[#3b82f6]', 'bg-[#60a5fa]', 'bg-[#93c5fd]'];
              
              return (
                <button
                  key={filter.value || 'all'}
                  ref={(el) => (filterButtonsRef.current[index] = el)}
                  onClick={() => handleCategoryFilter(filter.value)}
                  className={`px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.5rem,1.5vh,0.75rem)] font-semibold uppercase tracking-[0.05em] transition-all font-['Montserrat',sans-serif] relative overflow-visible z-10 ${
                    isActive
                      ? 'bg-black text-white rounded-t-lg'
                      : `${bgColors[index]} text-white`
                  }`}
                  style={{ 
                    fontSize: 'clamp(0.7rem, min(1.2vw, 1.5vh), 0.875rem)'
                  }}
                >
                  {filter.label}
                  {isActive && (
                    <div 
                      className="absolute bottom-0 left-1/2 w-0 h-0 z-20"
                      style={{ 
                        transform: 'translate(-50%, 100%)',
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderTop: '10px solid black'
                      }}
                    />
                  )}
                </button>
              );
            })}
            {/* Sliding indicator */}
            <motion.div
              className="absolute bottom-0 h-1 bg-white rounded-full z-0"
              initial={false}
              animate={{
                x: filterButtonsRef.current[selectedCategory === null ? 0 : 
                   selectedCategory === 'SUV' ? 1 : 
                   selectedCategory === 'MPV' ? 2 : 3]?.offsetLeft || 0,
                width: filterButtonsRef.current[selectedCategory === null ? 0 : 
                       selectedCategory === 'SUV' ? 1 : 
                       selectedCategory === 'MPV' ? 2 : 3]?.offsetWidth || 0
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            />
          </div>
          <div 
            className="bg-white rounded-lg p-[clamp(1rem,3vw,2rem)] md:p-[clamp(1.5rem,4vw,2rem)] max-w-[1200px] w-full shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
            style={{ marginTop: '-1px' }}
          >
          <div className="flex flex-col md:flex-row gap-[clamp(0.75rem,2vw,1rem)] items-end">
            <div className="flex-1 min-w-[clamp(150px,25vw,200px)] w-full md:w-auto relative">
              <select
                value={selectedSeats || ''}
                onChange={(e) => setSelectedSeats(e.target.value || null)}
                className="w-full border border-gray-300 rounded-md bg-gray-50 text-gray-800 cursor-pointer appearance-none pr-10 font-['Montserrat',sans-serif] transition-colors hover:border-gray-400 focus:outline-none focus:border-blue-900 focus:bg-white"
                style={{
                  padding: 'clamp(0.75rem, 2vh, 0.875rem) clamp(0.75rem, 2vw, 1rem)',
                  fontSize: 'clamp(0.875rem, min(1.5vw, 1.8vh), 1rem)',
                }}
              >
                <option value="">All Number of Seats</option>
                <option value="7">7 Seater</option>
                <option value="15">15 Seater</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ width: 'clamp(0.75rem, 1.5vw, 1rem)', height: 'clamp(0.75rem, 1.5vw, 1rem)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-900 text-white border-none rounded-md font-semibold cursor-pointer transition-all uppercase tracking-[0.05em] whitespace-nowrap font-['Montserrat',sans-serif] hover:bg-blue-800 hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto"
              style={{
                padding: 'clamp(0.75rem, 2vh, 0.875rem) clamp(1.5rem, 4vw, 2.5rem)',
                fontSize: 'clamp(0.875rem, min(1.5vw, 1.8vh), 1rem)',
              }}
            >
              Search
            </button>
          </div>
          </div>
          </div>
      </section>

      {/* Cars Carousel Section */}
      <section id="cars" className="w-full bg-black py-10 px-4 md:py-14 md:px-8 flex justify-center items-center pb-25 md:pb-28 overflow-hidden">
        <div 
          ref={carouselRef}
          className={`max-w-[1200px] w-full text-center text-white transition-all duration-1000 ease-out ${
            carouselVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative w-full pt-2 pb-10">
            {/* Left Navigation Arrow */}
            {filteredCars.length > 1 && (
              <button
                onClick={goPrev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 border-2 border-[#3533c7] rounded-full p-2.5 md:p-3.5 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group shadow-[0_4px_12px_rgba(53,51,199,0.3)] hover:shadow-[0_4px_16px_rgba(29,155,240,0.4)]"
                aria-label="Previous car"
              >
                <svg
                  className="w-5 h-5 md:w-7 md:h-7 text-[#3533c7] group-hover:text-[#1d9bf0] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Right Navigation Arrow */}
            {filteredCars.length > 1 && (
              <button
                onClick={goNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 border-2 border-[#3533c7] rounded-full p-2.5 md:p-3.5 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group shadow-[0_4px_12px_rgba(53,51,199,0.3)] hover:shadow-[0_4px_16px_rgba(29,155,240,0.4)]"
                aria-label="Next car"
              >
                <svg
                  className="w-5 h-5 md:w-7 md:h-7 text-[#3533c7] group-hover:text-[#1d9bf0] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            <div
              className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDragStart={handleDragStart}
            >
              <div className="relative w-full h-[320px] md:h-[440px]">
                {filteredCars.length > 0 ? (() => {
                  const validIndex = Math.min(currentCarIndex, filteredCars.length - 1);

                  if (filteredCars.length >= 3) {
                    const leftIndex = (validIndex - 1 + filteredCars.length) % filteredCars.length;
                    const rightIndex = (validIndex + 1) % filteredCars.length;

                    const visibleIndices = [leftIndex, validIndex, rightIndex];

                    return visibleIndices.map((index, position) => {
                      const car = filteredCars[index];
                      const offset = position - 1;
                      const isActive = offset === 0;

                      const scale = isActive ? 1.0 : 0.75;
                      const opacity = isActive ? 1.0 : 0.7;
                      const translateX = offset * 50;

                      return (
                        <div
                          key={car.name}
                          className="absolute top-0 left-1/2 w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out cursor-pointer"
                          style={{
                            transform: `translateX(calc(-50% + ${translateX}%)) scale(${scale})`,
                            opacity: opacity,
                            zIndex: isActive ? 10 : 5,
                          }}
                          onClick={() => {
                            if (!hasDragged.current) {
                              if (isActive) {
                                setSelectedCar(car);
                              } else {
                                setCurrentCarIndex(index);
                              }
                            }
                          }}
                        >
                          <img
                            src={car.image}
                            alt={car.name}
                            draggable="false"
                            className="select-none max-h-[320px] md:max-h-[440px] w-auto object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.85)]"
                            onDragStart={handleDragStart}
                          />
                        </div>
                      );
                    });
                  } else if (filteredCars.length === 2) {
                    const otherIndex = validIndex === 0 ? 1 : 0;
                    const visibleIndices = [otherIndex, validIndex];

                    return visibleIndices.map((index) => {
                      const car = filteredCars[index];
                      const isActive = index === validIndex;
                      const offset = isActive ? 0 : index < validIndex ? -1 : 1;

                      const scale = isActive ? 1.0 : 0.75;
                      const opacity = isActive ? 1.0 : 0.7;
                      const translateX = offset * 50;

                      return (
                        <div
                          key={car.name}
                          className="absolute top-0 left-1/2 w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out cursor-pointer"
                          style={{
                            transform: `translateX(calc(-50% + ${translateX}%)) scale(${scale})`,
                            opacity: opacity,
                            zIndex: isActive ? 10 : 5,
                          }}
                          onClick={() => {
                            if (!hasDragged.current) {
                              if (isActive) {
                                setSelectedCar(car);
                              } else {
                                setCurrentCarIndex(index);
                              }
                            }
                          }}
                        >
                          <img
                            src={car.image}
                            alt={car.name}
                            draggable="false"
                            className="select-none max-h-[320px] md:max-h-[440px] w-auto object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.85)]"
                            onDragStart={handleDragStart}
                          />
                        </div>
                      );
                    });
                  } else {
                    const car = filteredCars[validIndex];
                    return (
                      <div
                        key={car.name}
                        className="absolute top-0 left-1/2 w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out cursor-pointer"
                        style={{
                          transform: `translateX(-50%) scale(1.0)`,
                          opacity: 1.0,
                          zIndex: 10,
                        }}
                        onClick={() => setSelectedCar(car)}
                      >
                        <img
                          src={car.image}
                          alt={car.name}
                          draggable="false"
                          className="select-none max-h-[320px] md:max-h-[440px] w-auto object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.85)]"
                          onDragStart={handleDragStart}
                        />
                      </div>
                    );
                  }
                })() : (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full flex items-center justify-center">
                    <p className="text-white text-xl font-['Montserrat',sans-serif]">No cars found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>


            {filteredCars.length > 0 && (
              <div className="mt-6 flex flex-col items-center">
                <p className="text-2xl md:text-3xl font-semibold tracking-wide font-['Montserrat',sans-serif]">
                  {filteredCars[Math.min(currentCarIndex, filteredCars.length - 1)].name}
                </p>
              </div>
            )}


            {filteredCars.length > 0 && (
              <div className="mt-4 flex justify-center gap-3">
                {filteredCars.map((car, index) => (
                  <button
                    key={car.name}
                    type="button"
                    onClick={() => setCurrentCarIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      index === currentCarIndex ? 'bg-[#1d9bf0]' : 'bg-slate-500'
                    }`}
                    aria-label={`Show ${car.name}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Car Details Modal */}
      {selectedCar && !isFullScreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setSelectedCar(null)}
        >
          <div
            className="relative bg-black border-2 border-[#3533c7] rounded-lg max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCar(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-[#3533c7] hover:bg-[#1d9bf0] text-white rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row p-4 sm:p-6 md:p-8 gap-4 sm:gap-6 md:gap-8">
              {/* Left side - Images - Fixed Size */}
              <div className="w-full md:w-[500px] flex-shrink-0 flex flex-col gap-3 sm:gap-4">
                {/* Main image - Clickable to open fullscreen - Fixed Height */}
                <div 
                  className="w-full h-[400px] sm:h-[450px] md:h-[500px] rounded-lg overflow-hidden bg-gray-900 cursor-zoom-in relative"
                  onClick={() => setIsFullScreen(true)}
                >
                  <img
                    src={(selectedCar.images && selectedCar.images[selectedImageIndex]) || selectedCar.image}
                    alt={selectedCar.name}
                    className="w-full h-full object-contain transition-transform duration-200 hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                    <div className="bg-black/50 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      Click to zoom
                    </div>
                  </div>
                </div>
                
                {/* Thumbnail carousel with scrollbar - Fixed Height */}
                {selectedCar.images && selectedCar.images.length > 0 && (
                  <div className="w-full h-[100px] sm:h-[110px]">
                    <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 h-full scrollbar-thin scrollbar-thumb-[#3533c7] scrollbar-track-gray-800 hover:scrollbar-thumb-[#1d9bf0]"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#3533c7 #1a1a1a',
                      }}
                    >
                      {selectedCar.images.map((img, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-900 cursor-pointer border-2 transition-all duration-200 ${
                            index === selectedImageIndex
                              ? 'border-[#1d9bf0] scale-105'
                              : 'border-transparent hover:border-[#3533c7]'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${selectedCar.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right side - Details */}
              <div className="flex-1 flex flex-col text-white min-w-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 font-['Montserrat',sans-serif]">
                  {selectedCar.name}
                </h2>

                {/* Specifications */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#3533c7] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                    <span className="text-sm sm:text-base md:text-lg"><strong>Type:</strong> {selectedCar.category}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#3533c7] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm sm:text-base md:text-lg"><strong>Transmission:</strong> {selectedCar.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base md:text-lg"><strong>Fuel Type:</strong> {selectedCar.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base md:text-lg"><strong>Fuel Capacity:</strong> {selectedCar.fuelCapacity}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#3533c7] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-sm sm:text-base md:text-lg"><strong>Seats:</strong> {selectedCar.seats} seater</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {selectedCar.description}
                  </p>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {selectedCar.description2}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Zoom Modal */}
      {isFullScreen && selectedCar && (
        <div
          className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
          onWheel={handleFullScreenWheel}
          onMouseMove={handleFullScreenMouseMove}
          onMouseUp={handleFullScreenMouseUp}
          onMouseLeave={handleFullScreenMouseUp}
          onTouchStart={handleFullScreenTouchStart}
          onTouchMove={handleFullScreenTouchMove}
          onClick={() => {
            setIsFullScreen(false);
            setZoomLevel(1);
            setPanPosition({ x: 0, y: 0 });
          }}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreen(false);
              setZoomLevel(1);
              setPanPosition({ x: 0, y: 0 });
            }}
            className="absolute top-4 right-4 z-10 bg-[#3533c7] hover:bg-[#1d9bf0] text-white rounded-full p-3 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
            aria-label="Close fullscreen"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((prev) => Math.min(5, prev + 0.25));
              }}
              className="bg-[#3533c7] hover:bg-[#1d9bf0] text-white rounded-lg p-2 transition-all duration-200 hover:scale-110"
              aria-label="Zoom in"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((prev) => Math.max(0.5, prev - 0.25));
              }}
              className="bg-[#3533c7] hover:bg-[#1d9bf0] text-white rounded-lg p-2 transition-all duration-200 hover:scale-110"
              aria-label="Zoom out"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel(1);
                setPanPosition({ x: 0, y: 0 });
              }}
              className="bg-[#3533c7] hover:bg-[#1d9bf0] text-white rounded-lg p-2 transition-all duration-200 hover:scale-110"
              aria-label="Reset zoom"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Image with zoom and pan */}
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden cursor-move"
            onMouseDown={handleFullScreenMouseDown}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={(selectedCar.images && selectedCar.images[selectedImageIndex]) || selectedCar.image}
              alt={selectedCar.name}
              className="max-w-full max-h-full object-contain select-none"
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              }}
              draggable="false"
            />
          </div>

          {/* Image counter */}
          {selectedCar.images && selectedCar.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/70 text-white px-4 py-2 rounded-lg">
              {selectedImageIndex + 1} / {selectedCar.images.length}
            </div>
          )}

          {/* Navigation arrows for fullscreen */}
          {selectedCar.images && selectedCar.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev - 1 + selectedCar.images.length) % selectedCar.images.length);
                  setZoomLevel(1);
                  setPanPosition({ x: 0, y: 0 });
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-[#3533c7] hover:bg-[#1d9bf0] text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                aria-label="Previous image"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev + 1) % selectedCar.images.length);
                  setZoomLevel(1);
                  setPanPosition({ x: 0, y: 0 });
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-[#3533c7] hover:bg-[#1d9bf0] text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                aria-label="Next image"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {/* Gallery Section - continuous scrolling like LED signboard */}
      <section id="gallery" className="w-full bg-black pt-9 pb-2 px-2 md:pt-13 md:pb-4 md:px-4 flex justify-center items-center overflow-hidden">
        <div 
          ref={galleryRef}
          className={`w-full text-center text-white transition-all duration-1000 ease-out max-h-[480px] md:max-h-[580px] overflow-hidden ${
            galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <ContinuousScrollingGallery images={ALL_GALLERY_IMAGES} />
        </div>
      </section>

      {/* Decorative Gradient Section - Google Reviews (hidden for now) */}
      {/* <section className="w-full flex flex-col">
        <div className="w-full flex flex-col">
          <div 
            className="w-full"
            style={{ 
              height: 'clamp(100px, 12vh, 180px)',
              background: 'linear-gradient(to bottom, #000000, #051941)'
            }}
          />
          <div 
            id="reviews"
            className="w-full flex items-center justify-center py-8 md:py-10"
            style={{ backgroundColor: '#051941' }}
          >
            <GoogleReviewsCarousel reviews={GOOGLE_REVIEWS} autoPlayInterval={4000} />
          </div>
          <div 
            className="w-full"
            style={{ 
              height: 'clamp(100px, 12vh, 180px)',
              background: 'linear-gradient(to bottom, #051941, #000000)'
            }}
          />
        </div>
      </section> */}

    </div>
  );
}

export default Home;
