import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Continuous scrolling grid gallery - like an LED signboard
export default function ContinuousScrollingGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [manualOffset, setManualOffset] = useState(0);
  const mouseStartX = useRef(null);
  const dragStartOffset = useRef(0);
  const hasDragged = useRef(false);
  const containerRef = useRef(null);
  const imagesPerGrid = 6;

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  // Handle mouse drag for manual scrolling
  const handleMouseDown = (e) => {
    mouseStartX.current = e.clientX;
    dragStartOffset.current = manualOffset;
    hasDragged.current = false;
    setIsPaused(true);
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (mouseStartX.current === null || !isDragging) return;
    
    const deltaX = e.clientX - mouseStartX.current;
    if (Math.abs(deltaX) > 5) {
      hasDragged.current = true;
    }
    
    // Calculate the scroll offset based on drag distance with sensitivity multiplier
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const sensitivity = 0.3; // Reduce sensitivity to make dragging slower
      const dragPercent = (deltaX / containerWidth) * 100 * sensitivity;
      const newOffset = dragStartOffset.current + dragPercent;
      // Allow scrolling in both directions, but limit to reasonable bounds
      setManualOffset(newOffset);
    }
    
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    if (mouseStartX.current === null) return;
    
    mouseStartX.current = null;
    setIsDragging(false);
    
    // Reset after a short delay to allow click handler to check
    setTimeout(() => {
      hasDragged.current = false;
      // Keep the manual offset and resume animation from current position
      setIsPaused(false);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      mouseStartX.current = null;
      setIsDragging(false);
      hasDragged.current = false;
      // Keep the manual offset and resume animation when mouse leaves
      setIsPaused(false);
    }
  };

  // Prevent image click when dragging
  const handleImageClick = (src, e) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setSelectedImage(src);
  };
  
  // Create grid units from images
  const createGridUnit = (imageSet) => {
    if (imageSet.length < imagesPerGrid) {
      // Repeat images if needed
      const extended = [];
      while (extended.length < imagesPerGrid) {
        extended.push(...imageSet);
      }
      imageSet = extended.slice(0, imagesPerGrid);
    }
    
    return {
      leftCol: {
        top: imageSet[0],
        bottomLeft: imageSet[1],
        bottomRight: imageSet[2],
      },
      rightCol: {
        topLeft: imageSet[3],
        topRight: imageSet[4],
        bottom: imageSet[5],
      },
    };
  };
  
  // Create multiple grid units for seamless scrolling
  // Use more copies for smoother transition
  const numUniqueUnits = 5; // Create 5 unique variations
  const gridUnits = [];
  
  // Create multiple unique grid units with progressive shifts
  for (let i = 0; i < numUniqueUnits; i++) {
    const startIdx = (i * imagesPerGrid) % images.length;
    const unitImages = [];
    for (let j = 0; j < imagesPerGrid; j++) {
      unitImages.push(images[(startIdx + j) % images.length]);
    }
    gridUnits.push(createGridUnit(unitImages));
  }
  
  // Duplicate the first few units at the end for seamless looping
  // This ensures when we loop back, it's identical to the start
  for (let i = 0; i < 2; i++) {
    const startIdx = (i * imagesPerGrid) % images.length;
    const unitImages = [];
    for (let j = 0; j < imagesPerGrid; j++) {
      unitImages.push(images[(startIdx + j) % images.length]);
    }
    gridUnits.push(createGridUnit(unitImages));
  }
  
  const totalUnits = gridUnits.length;
  const uniqueUnits = numUniqueUnits;
  
  // Render a single grid unit
  const renderGridUnit = (unit, key) => (
    <div key={key} className="flex-shrink-0" style={{ width: `${100 / totalUnits}%`, paddingRight: '1rem' }}>
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Top - large landscape image */}
          <div 
            className="w-full aspect-[16/9] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={(e) => handleImageClick(unit.leftCol.top.src, e)}
          >
            <img
              src={unit.leftCol.top.src}
              alt="Gallery image"
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>
          {/* Bottom - two squares */}
          <div className="flex gap-4">
            <div 
              className="w-1/2 aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => handleImageClick(unit.leftCol.bottomLeft.src, e)}
            >
              <img
                src={unit.leftCol.bottomLeft.src}
                alt="Gallery image"
                className="w-full h-full object-cover"
                draggable="false"
              />
            </div>
            <div 
              className="w-1/2 aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => handleImageClick(unit.leftCol.bottomRight.src, e)}
            >
              <img
                src={unit.leftCol.bottomRight.src}
                alt="Gallery image"
                className="w-full h-full object-cover"
                draggable="false"
              />
            </div>
          </div>
        </div>
        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Top - two squares */}
          <div className="flex gap-4">
            <div 
              className="w-1/2 aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => handleImageClick(unit.rightCol.topLeft.src, e)}
            >
              <img
                src={unit.rightCol.topLeft.src}
                alt="Gallery image"
                className="w-full h-full object-cover"
                draggable="false"
              />
            </div>
            <div 
              className="w-1/2 aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => handleImageClick(unit.rightCol.topRight.src, e)}
            >
              <img
                src={unit.rightCol.topRight.src}
                alt="Gallery image"
                className="w-full h-full object-cover"
                draggable="false"
              />
            </div>
          </div>
          {/* Bottom - large landscape image */}
          <div 
            className="w-full aspect-[16/9] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={(e) => handleImageClick(unit.rightCol.bottom.src, e)}
          >
            <img
              src={unit.rightCol.bottom.src}
              alt="Gallery image"
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
  
  // Calculate scroll distance: move by the width of unique units
  // This loops back to the duplicates which match the beginning
  const scrollDistance = (100 / totalUnits) * uniqueUnits;
  
  
  return (
    <div 
      className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(${manualOffset}%);
          }
          100% {
            transform: translateX(${manualOffset - scrollDistance}%);
          }
        }
        .scrolling-container {
          display: flex;
          animation: ${isPaused ? 'none' : `scroll 35s linear infinite`};
          width: ${totalUnits * 100}%;
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
          ${isPaused && manualOffset !== 0 ? `transform: translateX(${manualOffset}%);` : ''}
        }
        .scrolling-container:hover {
          animation-play-state: ${isPaused ? 'paused' : 'paused'};
        }
        .scrolling-container > div {
          backface-visibility: hidden;
          transform: translateZ(0);
        }
      `}</style>
      <div className="scrolling-container">
        {gridUnits.map((unit, idx) => renderGridUnit(unit, `grid-${idx}`))}
      </div>

      {/* Image Modal/Popup - Using Portal to render at body level */}
      {selectedImage && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[95vh] sm:max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
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
            <img
              src={selectedImage}
              alt="Gallery image"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

