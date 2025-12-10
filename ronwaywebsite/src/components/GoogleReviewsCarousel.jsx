import { useState, useEffect, useRef } from 'react';
import googleCircleIcon from '../assets/logos/GoogleCircleIcon.svg';

// Google Reviews Carousel Component
export default function GoogleReviewsCarousel({ reviews, autoPlayInterval = 4000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const autoPlayTimer = useRef(null);
  const isPaused = useRef(false);
  const mouseStartX = useRef(null);

  const length = reviews.length;

  // Track window width for responsive spacing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + length) % length);

  // Auto-play functionality
  useEffect(() => {
    if (length <= 1) return;

    const startAutoPlay = () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
      autoPlayTimer.current = setInterval(() => {
        if (!isPaused.current) {
          setCurrentIndex((prev) => (prev + 1) % length);
        }
      }, autoPlayInterval);
    };

    startAutoPlay();

    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, [length, autoPlayInterval]);

  const pauseAutoPlay = () => {
    isPaused.current = true;
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
    }
  };

  const resumeAutoPlay = () => {
    isPaused.current = false;
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
    }
    if (length > 1) {
      autoPlayTimer.current = setInterval(() => {
        if (!isPaused.current) {
          setCurrentIndex((prev) => (prev + 1) % length);
        }
      }, autoPlayInterval);
    }
  };

  const handleMouseDown = (e) => {
    mouseStartX.current = e.clientX;
    e.preventDefault();
    pauseAutoPlay();
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
    setTimeout(() => resumeAutoPlay(), 2000);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };

  if (reviews.length === 0) {
    return <p className="text-center text-white w-full">No reviews to show</p>;
  }

  const currentReview = reviews[currentIndex];
  const leftIndex = (currentIndex - 1 + length) % length;
  const rightIndex = (currentIndex + 1) % length;

  return (
    <div className="relative w-full max-w-[1200px] mx-auto px-4">
      <div
        className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseEnter={pauseAutoPlay}
        onMouseLeave={(e) => {
          handleMouseUp(e);
          resumeAutoPlay();
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragStart={handleDragStart}
      >
        <div className="relative w-full flex items-center justify-center" style={{ height: 'clamp(350px, 60vh, 450px)' }}>
          {[leftIndex, currentIndex, rightIndex].map((idx, pos) => {
            const review = reviews[idx];
            const isCenter = pos === 1;

            const scale = isCenter ? 1 : 0.8;
            const opacity = isCenter ? 1 : 0.6;
            // Responsive spacing - less on mobile, more on desktop
            const translateX = (pos - 1) * (windowWidth < 768 ? 100 : 160);

            return (
              <div
                key={idx}
                className="absolute top-1/2 left-1/2 bg-white rounded-[4%] shadow-xl overflow-hidden flex flex-col pointer-events-none"
                style={{
                  width: isCenter 
                    ? 'clamp(280px, 90vw, 650px)' 
                    : 'clamp(224px, 72vw, 516px)',
                  height: isCenter 
                    ? 'clamp(300px, 80vh, 420px)' 
                    : 'clamp(240px, 64vh, 336px)',
                  transform: `translate(calc(-50% + ${translateX}%), -50%) scale(${scale})`,
                  opacity,
                  transition: 'transform 0.5s ease, opacity 0.5s ease',
                  zIndex: isCenter ? 10 : 5,
                }}
                onDragStart={handleDragStart}
              >
                {/* Google Circle Icon at top middle */}
                <div className="flex justify-center pt-8 pb-3">
                  <img
                    src={googleCircleIcon}
                    alt="Google"
                    className="w-20 h-20"
                  />
                </div>
                {/* Review content */}
                <div className="px-8 pb-8 flex flex-col flex-1 items-center text-center justify-start">
                  <h3 className="font-bold text-gray-900 text-xl mb-1.5">{review.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{review.date}</p>
                  <div className="flex justify-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed flex-1 overflow-y-auto text-center px-2">{review.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write A Google Review Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => {
            // Add your Google Review link here
            window.open('https://g.page/r/YOUR_GOOGLE_REVIEW_LINK', '_blank');
          }}
          className="bg-[#051941] text-white border-2 border-white rounded-md px-6 py-3 font-semibold uppercase tracking-wide transition-all hover:bg-[#040d2e] hover:scale-105 active:scale-100"
          style={{
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
          }}
        >
          Write A Google Review
        </button>
      </div>
    </div>
  );
}

