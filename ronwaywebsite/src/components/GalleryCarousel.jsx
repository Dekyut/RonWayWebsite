import { useState, useEffect, useRef } from 'react';

// Reusable Carousel component, same mechanics as Cars Carousel but smaller and full width for gallery
export default function GalleryCarousel({ images, autoPlayInterval = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Swipe & drag state refs
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const hasSwiped = useRef(false);
  const mouseStartX = useRef(null);
  const autoPlayTimer = useRef(null);
  const isPaused = useRef(false);

  const length = images.length;

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + length) % length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % length);

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

  // Pause on user interaction
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

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      hasSwiped.current = false;
      pauseAutoPlay();
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
    const threshold = 30;

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
    // Resume auto-play after a delay
    setTimeout(() => resumeAutoPlay(), 2000);
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
    const threshold = 30;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0) goNext();
      else goPrev();
    }

    mouseStartX.current = null;
    // Resume auto-play after a delay
    setTimeout(() => resumeAutoPlay(), 2000);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };

  // Image aspect ratio classes
  const getAspectClass = (type) => (type === 'long' ? 'aspect-[16/9]' : 'aspect-square');

  // Show side images partially if more than 1 image
  return (
    <div className="relative w-full max-w-full overflow-hidden touch-none select-none">
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
        style={{ height: '240px' }}
      >
        {length > 0 ? (() => {
          // Calculate indices for left, current, right with wrapping
          const center = currentIndex;
          const left = (center - 1 + length) % length;
          const right = (center + 1) % length;

          // Show left, center, right images with scaling and translateX
          return [left, center, right].map((idx, pos) => {
            const image = images[idx];
            const isCenter = pos === 1;

            const scale = isCenter ? 1 : 0.75;
            const opacity = isCenter ? 1 : 0.6;
            const translateX = (pos - 1) * 40; // left: -40%, center: 0%, right: +40%

            const aspectClass = getAspectClass(image.type);

            return (
              <div
                key={idx}
                className="absolute top-1/2 left-1/2 rounded-lg shadow-lg overflow-hidden"
                style={{
                  width: isCenter ? '60%' : '40%',
                  transform: `translate(calc(-50% + ${translateX}% ), -50%) scale(${scale})`,
                  opacity,
                  transition: 'transform 0.5s ease, opacity 0.5s ease',
                  zIndex: isCenter ? 10 : 5,
                  height: '90%',
                }}
              >
                <div className={`${aspectClass} w-full`}>
                  <img
                    src={image.src}
                    alt={`Gallery image ${idx + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                    onDragStart={handleDragStart}
                  />
                </div>
              </div>
            );
          });
        })() : (
          <p className="text-center text-white w-full">No images to show</p>
        )}
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-4 gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              pauseAutoPlay();
              setCurrentIndex(idx);
              setTimeout(() => resumeAutoPlay(), 2000);
            }}
            className={`w-2.5 h-2.5 rounded-full ${
              idx === currentIndex ? 'bg-blue-500' : 'bg-gray-500'
            } transition-colors`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

