import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import wheelSvg from '../assets/logos/Wheel.svg';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ABOUT_TEAM_GALLERY_IMAGES } from '../data/aboutGallery';
import { TEAM_LEADERS, ALL_TEAM_MEMBERS } from '../data/team';

const MILESTONES = [
  { year: '2025', title: 'Company Launch', body: 'Started with a single premium van servicing airport transfers around Metro Manila.' },
  { year: '2026', title: 'Fleet Expansion', body: 'Grew to a multi-brand lineup of SUVs, MPVs, and executive vans to match client demand.' },
  { year: '2027', title: 'Travel Solutions', body: 'Introduced curated travel programs and corporate mobility retainers for enterprise partners.' }
];

const CORE_VALUES = [
  { title: 'Reliability', body: 'Meticulously maintained units and 24/7 dispatch monitoring keep every trip on schedule.' },
  { title: 'Safety', body: 'Professional chauffeurs, real-time tracking, and comprehensive insurance for absolute peace of mind.' },
  { title: 'Hospitality', body: 'White-glove service, flexible itineraries, and concierge-level trip coordination.' }
];

function About() {
  const [rotation, setRotation] = useState(0);
  const sectionRef = useRef(null);
  const [headerRef, headerVisible] = useScrollAnimation();
  const [coreValuesRef, coreValuesVisible] = useScrollAnimation();
  const [visionRef, visionVisible] = useScrollAnimation();
  const [missionRef, missionVisible] = useScrollAnimation();
  const [milestonesRef, milestonesVisible] = useScrollAnimation();
  const [teamRef, teamVisible] = useScrollAnimation();
  const [galleryRef, galleryVisible] = useScrollAnimation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const galleryScrollRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);
  const currentScrollX = useRef(0);
  const hasDragged = useRef(false);
  const mouseMoveHandlerRef = useRef(null);
  const mouseUpHandlerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isPaused = useRef(false);
  const lastUpdateTime = useRef(Date.now());
  const scrollSpeed = 0.5; // pixels per frame (adjust for speed)
  
  // Team carousel state - continuous scrolling
  const teamCarouselScrollRef = useRef(null);
  const teamCarouselIsDragging = useRef(false);
  const teamCarouselDragStartX = useRef(0);
  const teamCarouselScrollStartX = useRef(0);
  const teamCarouselCurrentScrollX = useRef(0);
  const teamCarouselHasDragged = useRef(false);
  const teamCarouselMouseMoveHandlerRef = useRef(null);
  const teamCarouselMouseUpHandlerRef = useRef(null);
  const teamCarouselAnimationFrameRef = useRef(null);
  const teamCarouselIsPaused = useRef(false);
  const teamCarouselLastUpdateTime = useRef(Date.now());
  const teamCarouselScrollSpeed = 0.25; // Slower than gallery (0.5)
  
  // Duplicate team members for seamless infinite scroll
  const duplicatedTeamMembers = [...ALL_TEAM_MEMBERS, ...ALL_TEAM_MEMBERS];
  
  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...ABOUT_TEAM_GALLERY_IMAGES, ...ABOUT_TEAM_GALLERY_IMAGES];
  const totalAboutGalleryImages = ABOUT_TEAM_GALLERY_IMAGES.length;
  
  // Continuous scrolling animation using requestAnimationFrame for gallery
  useEffect(() => {
    if (!galleryScrollRef.current) return;
    
    const animate = () => {
      if (!galleryScrollRef.current || isPaused.current || isDragging.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      lastUpdateTime.current = now;
      
      // Update scroll position
      const containerWidth = galleryScrollRef.current.scrollWidth / 2;
      currentScrollX.current = (currentScrollX.current + scrollSpeed) % containerWidth;
      
      // Apply transform
      galleryScrollRef.current.style.transform = `translateX(-${currentScrollX.current}px)`;
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    lastUpdateTime.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Continuous scrolling animation for team carousel
  useEffect(() => {
    if (!teamCarouselScrollRef.current) return;
    
    const animate = () => {
      if (!teamCarouselScrollRef.current || teamCarouselIsPaused.current || teamCarouselIsDragging.current) {
        teamCarouselAnimationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const now = Date.now();
      const deltaTime = now - teamCarouselLastUpdateTime.current;
      teamCarouselLastUpdateTime.current = now;
      
      // Update scroll position
      const containerWidth = teamCarouselScrollRef.current.scrollWidth / 2;
      teamCarouselCurrentScrollX.current = (teamCarouselCurrentScrollX.current + teamCarouselScrollSpeed) % containerWidth;
      
      // Apply transform
      teamCarouselScrollRef.current.style.transform = `translateX(-${teamCarouselCurrentScrollX.current}px)`;
      
      teamCarouselAnimationFrameRef.current = requestAnimationFrame(animate);
    };
    
    teamCarouselLastUpdateTime.current = Date.now();
    teamCarouselAnimationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (teamCarouselAnimationFrameRef.current) {
        cancelAnimationFrame(teamCarouselAnimationFrameRef.current);
      }
    };
  }, []);

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

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (selectedImage) {
          setSelectedImage(null);
        }
        if (selectedTeamMember) {
          setSelectedTeamMember(null);
        }
      }
    };

    if (selectedImage || selectedTeamMember) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, selectedTeamMember]);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      if (mouseMoveHandlerRef.current) {
        document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      }
      if (mouseUpHandlerRef.current) {
        document.removeEventListener('mouseup', mouseUpHandlerRef.current);
      }
      if (teamCarouselMouseMoveHandlerRef.current) {
        document.removeEventListener('mousemove', teamCarouselMouseMoveHandlerRef.current);
      }
      if (teamCarouselMouseUpHandlerRef.current) {
        document.removeEventListener('mouseup', teamCarouselMouseUpHandlerRef.current);
      }
    };
  }, []);

  // Handle drag to scroll
  const handleMouseMove = (e) => {
    if (!galleryScrollRef.current) return;
    
    const deltaX = e.clientX - dragStartX.current;
    
    // If moved more than 5px, start dragging
    if (Math.abs(deltaX) > 5) {
      e.preventDefault();
      
      if (!hasDragged.current) {
        hasDragged.current = true;
        isDragging.current = true;
        isPaused.current = true; // Pause auto-scroll
      }
      
      // Calculate new scroll position
      const newScrollX = scrollStartX.current - deltaX;
      const containerWidth = galleryScrollRef.current.scrollWidth / 2;
      
      // Wrap around for seamless loop
      currentScrollX.current = ((newScrollX % containerWidth) + containerWidth) % containerWidth;
      
      // Apply transform directly for immediate response
      galleryScrollRef.current.style.transform = `translateX(-${currentScrollX.current}px)`;
    }
  };

  const handleMouseUp = (e) => {
    // Remove global event listeners
    if (mouseMoveHandlerRef.current) {
      document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
    }
    if (mouseUpHandlerRef.current) {
      document.removeEventListener('mouseup', mouseUpHandlerRef.current);
    }
    
    if (!galleryScrollRef.current) return;
    
    if (isDragging.current) {
      // Stop dragging
      isDragging.current = false;
      
      // Resume auto-scroll after 3 seconds (like Reviews carousel)
      setTimeout(() => {
        isPaused.current = false;
        lastUpdateTime.current = Date.now(); // Reset timing
      }, 3000);
    } else {
      // If user just clicked (didn't drag), resume auto-scroll after a shorter delay
      setTimeout(() => {
        isPaused.current = false;
        lastUpdateTime.current = Date.now(); // Reset timing
      }, 1000);
    }
    
    // Reset after a short delay to allow click handler to check
    setTimeout(() => {
      hasDragged.current = false;
    }, 10);
  };

  const handleMouseDown = (e) => {
    if (!galleryScrollRef.current) return;
    isDragging.current = false;
    hasDragged.current = false;
    dragStartX.current = e.clientX;
    
    // Use current scroll position from ref
    scrollStartX.current = currentScrollX.current;
    
    // Pause auto-scroll
    isPaused.current = true;
    
    // Store handlers in refs and attach global mouse events
    mouseMoveHandlerRef.current = handleMouseMove;
    mouseUpHandlerRef.current = handleMouseUp;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    e.preventDefault();
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    if (!galleryScrollRef.current) return;
    isDragging.current = false;
    hasDragged.current = false;
    dragStartX.current = e.touches[0].clientX;
    scrollStartX.current = currentScrollX.current;
    isPaused.current = true; // Pause auto-scroll
  };

  const handleTouchMove = (e) => {
    if (!galleryScrollRef.current) return;
    
    const deltaX = e.touches[0].clientX - dragStartX.current;
    
    if (Math.abs(deltaX) > 5) {
      e.preventDefault();
      
      if (!hasDragged.current) {
        hasDragged.current = true;
        isDragging.current = true;
      }
      
      const newScrollX = scrollStartX.current - deltaX;
      const containerWidth = galleryScrollRef.current.scrollWidth / 2;
      
      currentScrollX.current = ((newScrollX % containerWidth) + containerWidth) % containerWidth;
      
      galleryScrollRef.current.style.transform = `translateX(-${currentScrollX.current}px)`;
    }
  };

  const handleTouchEnd = (e) => {
    if (!galleryScrollRef.current) return;
    
    if (isDragging.current) {
      isDragging.current = false;
      
      // Resume auto-scroll after 3 seconds
      setTimeout(() => {
        isPaused.current = false;
        lastUpdateTime.current = Date.now();
      }, 3000);
    } else {
      // If user just tapped (didn't drag), resume auto-scroll after a shorter delay
      setTimeout(() => {
        isPaused.current = false;
        lastUpdateTime.current = Date.now();
      }, 1000);
    }
    
    setTimeout(() => {
      hasDragged.current = false;
    }, 10);
  };

  // Team carousel drag handlers
  const handleTeamCarouselMouseMove = (e) => {
    if (!teamCarouselScrollRef.current) return;
    
    const deltaX = e.clientX - teamCarouselDragStartX.current;
    
    // If moved more than 5px, start dragging
    if (Math.abs(deltaX) > 5) {
      e.preventDefault();
      
      if (!teamCarouselHasDragged.current) {
        teamCarouselHasDragged.current = true;
        teamCarouselIsDragging.current = true;
        teamCarouselIsPaused.current = true; // Pause auto-scroll
      }
      
      // Calculate new scroll position
      const newScrollX = teamCarouselScrollStartX.current - deltaX;
      const containerWidth = teamCarouselScrollRef.current.scrollWidth / 2;
      
      // Wrap around for seamless loop
      teamCarouselCurrentScrollX.current = ((newScrollX % containerWidth) + containerWidth) % containerWidth;
      
      // Apply transform directly for immediate response
      teamCarouselScrollRef.current.style.transform = `translateX(-${teamCarouselCurrentScrollX.current}px)`;
    }
  };

  const handleTeamCarouselMouseUp = (e) => {
    // Remove global event listeners
    if (teamCarouselMouseMoveHandlerRef.current) {
      document.removeEventListener('mousemove', teamCarouselMouseMoveHandlerRef.current);
    }
    if (teamCarouselMouseUpHandlerRef.current) {
      document.removeEventListener('mouseup', teamCarouselMouseUpHandlerRef.current);
    }
    
    if (!teamCarouselScrollRef.current) return;
    
    if (teamCarouselIsDragging.current) {
      // Stop dragging
      teamCarouselIsDragging.current = false;
      
      // Resume auto-scroll after 3 seconds
      setTimeout(() => {
        teamCarouselIsPaused.current = false;
        teamCarouselLastUpdateTime.current = Date.now(); // Reset timing
      }, 3000);
    } else {
      // If user just clicked (didn't drag), resume auto-scroll after a shorter delay
      setTimeout(() => {
        teamCarouselIsPaused.current = false;
        teamCarouselLastUpdateTime.current = Date.now(); // Reset timing
      }, 1000);
    }
    
    // Reset after a short delay to allow click handler to check
    setTimeout(() => {
      teamCarouselHasDragged.current = false;
    }, 10);
  };

  const handleTeamCarouselMouseDown = (e) => {
    if (!teamCarouselScrollRef.current) return;
    teamCarouselIsDragging.current = false;
    teamCarouselHasDragged.current = false;
    teamCarouselDragStartX.current = e.clientX;
    
    // Use current scroll position from ref
    teamCarouselScrollStartX.current = teamCarouselCurrentScrollX.current;
    
    // Pause auto-scroll
    teamCarouselIsPaused.current = true;
    
    // Store handlers in refs and attach global mouse events
    teamCarouselMouseMoveHandlerRef.current = handleTeamCarouselMouseMove;
    teamCarouselMouseUpHandlerRef.current = handleTeamCarouselMouseUp;
    document.addEventListener('mousemove', handleTeamCarouselMouseMove);
    document.addEventListener('mouseup', handleTeamCarouselMouseUp);
    
    e.preventDefault();
  };

  // Team carousel touch handlers
  const handleTeamCarouselTouchStart = (e) => {
    if (!teamCarouselScrollRef.current) return;
    teamCarouselIsDragging.current = false;
    teamCarouselHasDragged.current = false;
    teamCarouselDragStartX.current = e.touches[0].clientX;
    teamCarouselScrollStartX.current = teamCarouselCurrentScrollX.current;
    teamCarouselIsPaused.current = true; // Pause auto-scroll
  };

  const handleTeamCarouselTouchMove = (e) => {
    if (!teamCarouselScrollRef.current) return;
    
    const deltaX = e.touches[0].clientX - teamCarouselDragStartX.current;
    
    if (Math.abs(deltaX) > 5) {
      e.preventDefault();
      
      if (!teamCarouselHasDragged.current) {
        teamCarouselHasDragged.current = true;
        teamCarouselIsDragging.current = true;
      }
      
      const newScrollX = teamCarouselScrollStartX.current - deltaX;
      const containerWidth = teamCarouselScrollRef.current.scrollWidth / 2;
      
      teamCarouselCurrentScrollX.current = ((newScrollX % containerWidth) + containerWidth) % containerWidth;
      
      teamCarouselScrollRef.current.style.transform = `translateX(-${teamCarouselCurrentScrollX.current}px)`;
    }
  };

  const handleTeamCarouselTouchEnd = (e) => {
    if (!teamCarouselScrollRef.current) return;
    
    if (teamCarouselIsDragging.current) {
      teamCarouselIsDragging.current = false;
      
      // Resume auto-scroll after 3 seconds
      setTimeout(() => {
        teamCarouselIsPaused.current = false;
        teamCarouselLastUpdateTime.current = Date.now();
      }, 3000);
    } else {
      // If user just tapped (didn't drag), resume auto-scroll after a shorter delay
      setTimeout(() => {
        teamCarouselIsPaused.current = false;
        teamCarouselLastUpdateTime.current = Date.now();
      }, 1000);
    }
    
    setTimeout(() => {
      teamCarouselHasDragged.current = false;
    }, 10);
  };

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="w-full bg-gradient-to-b from-white to-[#021637] relative"
    >
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
        />
      </div>
      <div className="max-w-[1100px] w-full text-slate-900 space-y-10 relative mx-auto py-16 px-4 md:py-20 md:px-8" style={{ zIndex: 10 }}>
        <div 
          id="our-story"
          ref={headerRef}
          className={`text-center space-y-4 transition-all duration-1000 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm uppercase tracking-[0.35em] text-blue-900 font-semibold">About RonWay</p>
          <h2 className="text-3xl md:text-4xl font-semibold">Premium mobility, crafted for every journey</h2>
          <p className="text-base md:text-lg text-slate-600">
            RonWay Cars and Travel, Inc. is a Philippine-based rental and transport partner delivering dependable ground travel for families,
            executives, and corporate teams. We pair a curated fleet with concierge-level trip planning so you can focus on the destination.
          </p>
        </div>

        <div 
          ref={coreValuesRef}
          className={`grid gap-6 md:grid-cols-3 transition-all duration-1000 ease-out delay-200 ${
            coreValuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {CORE_VALUES.map((value, index) => (
            <motion.article
              key={value.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_15px_45px_rgba(15,23,42,0.08)] cursor-pointer"
              style={{
                transitionDelay: `${index * 100}ms`
              }}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: "0_25px_60px_rgba(15,23,42,0.15)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-2">{value.title}</h3>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">{value.body}</p>
            </motion.article>
          ))}
        </div>

        {/* Mission & Vision Section */}
        <div id="mission" className="w-full py-12 md:py-16">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-12">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-900 font-semibold mb-3">Our Foundation</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">Mission & Vision</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-900 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Vision Card */}
            <motion.div 
              ref={visionRef}
              className={`relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.12)] cursor-pointer transition-all duration-1000 ease-out ${
                visionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              whileHover={{
                scale: 1.02,
                y: -8,
                boxShadow: "0_30px_80px_rgba(15,23,42,0.2)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
              
              {/* Decorative Accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900"></div>
              
              {/* Content */}
              <div className="relative p-8 md:p-10">
                {/* Icon/Emoji */}
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-4">Our Vision</h3>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                  To be the most trusted and preferred travel and transport partner in the Philippines, recognized for our commitment to safety, innovation and world-class client service.
                </p>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div 
              ref={missionRef}
              className={`relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.12)] cursor-pointer transition-all duration-1000 ease-out ${
                missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              whileHover={{
                scale: 1.02,
                y: -8,
                boxShadow: "0_30px_80px_rgba(15,23,42,0.2)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
              
              {/* Decorative Accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900"></div>
              
              {/* Content */}
              <div className="relative p-8 md:p-10">
                {/* Icon/Emoji */}
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-4">Our Mission</h3>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                  To provide safe, reliable, and professional transport services that deliver exceptional client experiences while upholding the highest standards of safety, efficiency, and integrity.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div 
          ref={milestonesRef}
          className={`bg-white rounded-3xl border border-slate-200 shadow-[0_20px_65px_rgba(15,23,42,0.1)] p-6 md:p-10 cursor-pointer transition-all duration-1000 ease-out ${
            milestonesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          whileHover={{
            scale: 1.02,
            y: -8,
            boxShadow: "0_30px_80px_rgba(15,23,42,0.15)",
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-blue-900">Milestones</h3>
          <ol className="space-y-6 relative">
            {MILESTONES.map((milestone, index) => (
              <li key={milestone.year} className="pl-6">
                <div className="absolute left-2 top-3 bottom-3 border-l border-slate-200 hidden md:block" aria-hidden />
                <div className="w-3 h-3 rounded-full bg-blue-900 absolute left-0 translate-x-[-6px] translate-y-2 hidden md:block" aria-hidden />
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{milestone.year}</p>
                <p className="text-lg font-semibold text-slate-900">{milestone.title}</p>
                <p className="text-sm md:text-base text-slate-600">{milestone.body}</p>
                {index !== MILESTONES.length - 1 && <div className="border-b border-slate-100 mt-4 md:hidden" />}
              </li>
            ))}
          </ol>
        </motion.div>
      </div>

      {/* Team Section - Full Width */}
      <div 
        id="team"
        ref={teamRef}
        className={`w-full py-16 md:py-20 px-4 md:px-8 transition-all duration-1000 ease-out ${
          teamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ zIndex: 10 }}
      >
        {/* Header Section */}
        <div className="max-w-[1400px] mx-auto mb-12">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm uppercase tracking-wider text-slate-300 font-medium">TEAM RONWAY</p>
            <div className="h-[1px] w-16 bg-blue-600"></div>
          </div>
          <h3 className="text-3xl md:text-4xl font-semibold mb-4 text-white">MEET OUR HARDWORKING TEAM</h3>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-4xl">
            Here, we proudly introduce the brilliant minds and dedicated professionals who guide our organization towards success. Our team members and leaders are not only experts in their respective fields but also passionate mentors and visionaries who inspire excellence and innovation every day. Get to know the team driving our mission forward.
          </p>
        </div>

        {/* Team Leaders Section - Top */}
        <div className="max-w-[1400px] mx-auto mb-12">
          <div className="grid grid-cols-1 gap-8">
            {TEAM_LEADERS.map((leader, index) => (
              <motion.div
                key={leader.name}
                className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-[0_4px_12px_rgba(15,23,42,0.08)] overflow-hidden cursor-pointer w-full max-w-[1000px] mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  boxShadow: "0_8px_20px_rgba(15,23,42,0.12)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
                  {/* Left Side - Profile Picture */}
                  <div className="flex items-center justify-center">
                    <div className="w-fit mx-auto flex items-center justify-center overflow-hidden">
                      <img 
                        src={leader.image} 
                        alt={leader.name}
                        className="w-auto h-auto max-w-full object-contain"
                        style={{ transform: 'scale(0.98)' }}
                      />
                    </div>
                  </div>
                  
                  {/* Right Side - Name, Title, and Description */}
                  <div className="flex flex-col justify-center space-y-3">
                    <div>
                      <h4 className="text-2xl md:text-3xl font-semibold text-white mb-1.5">{leader.name}</h4>
                      <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-3">{leader.role}</p>
                    </div>
                    {leader.description && (
                      <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                        {leader.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Members Carousel - Continuous Scrolling */}
        <div className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleTeamCarouselMouseDown}
          onTouchStart={handleTeamCarouselTouchStart}
          onTouchMove={handleTeamCarouselTouchMove}
          onTouchEnd={handleTeamCarouselTouchEnd}
        >
          <style>{`
            .team-carousel-scroll {
              display: flex;
              will-change: transform;
            }
          `}</style>
          <div 
            ref={teamCarouselScrollRef}
            className="team-carousel-scroll gap-4 md:gap-6"
          >
            {duplicatedTeamMembers.map((member, index) => (
              <motion.div
                key={`${member.name}-${index}`}
                className="flex-shrink-0 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-[0_4px_12px_rgba(15,23,42,0.08)] overflow-hidden cursor-pointer w-[280px] md:w-[320px]"
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0_8px_20px_rgba(15,23,42,0.12)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  // Only open modal if not dragging
                  if (!teamCarouselHasDragged.current) {
                    setSelectedTeamMember(member);
                  }
                }}
              >
                {/* Logo/Profile Picture Area */}
                <div className="w-fit mx-auto flex items-center justify-center overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-auto h-auto max-w-full object-contain"
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
                {/* Name and Title */}
                <div className="p-4 bg-white/5">
                  <h4 className="text-base font-semibold text-white mb-1">{member.name}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Section - Full Width */}
      <div 
        ref={galleryRef}
        className={`w-full py-16 md:py-20 px-4 md:px-8 transition-all duration-1000 ease-out ${
          galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ zIndex: 10 }}
      >
        <div 
          className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <style>{`
            .gallery-scroll {
              display: flex;
              will-change: transform;
            }
          `}</style>
          <div 
            ref={galleryScrollRef}
            className="gallery-scroll gap-4 md:gap-6"
          >
            {duplicatedImages.map((image, index) => {
              const hasError = imageErrors[index % totalAboutGalleryImages];
              if (hasError) return null;
              
              return (
                <div
                  key={index}
                  className={`flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl select-none ${
                    image.type === 'long' 
                      ? 'w-[400px] md:w-[600px] lg:w-[700px] aspect-[16/9]' 
                      : 'w-[300px] md:w-[450px] lg:w-[500px] aspect-square'
                  }`}
                  onClick={(e) => {
                    // Only open modal if not dragging
                    if (!hasDragged.current) {
                      setSelectedImage(image.src);
                    }
                  }}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={image.src}
                      alt={`Gallery image ${(index % totalAboutGalleryImages) + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={() => setImageErrors(prev => ({ ...prev, [index % totalAboutGalleryImages]: true }))}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Gallery image"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Team Member Modal */}
      {selectedTeamMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setSelectedTeamMember(null)}
        >
          <div
            className="relative bg-black border-2 border-[#3533c7] rounded-lg max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedTeamMember(null)}
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

            <div className="p-4 sm:p-6 md:p-8">
              {/* Top Section - Profile Info */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6 md:mb-8">
                {/* Left side - Profile Picture */}
                <div className="w-full md:w-[280px] lg:w-[320px] flex-shrink-0 flex items-center justify-center">
                  <div className="w-full rounded-xl overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-[#3533c7]/50 shadow-lg">
                    <img
                      src={selectedTeamMember.image}
                      alt={selectedTeamMember.name}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                {/* Right side - Name, Role, Description */}
                <div className="flex-1 flex flex-col justify-center text-white min-w-0">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 font-['Montserrat',sans-serif]">
                    {selectedTeamMember.name}
                  </h2>
                  
                  <p className="text-xl sm:text-2xl text-[#3533c7] mb-4 sm:mb-6 font-semibold">
                    {selectedTeamMember.role}
                  </p>

                  {/* Description */}
                  {selectedTeamMember.description && (
                    <div className="space-y-2">
                      <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                        {selectedTeamMember.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Section - Full Width */}
              {selectedTeamMember.certificate && (
                <div className="w-full border-t border-[#3533c7]/30 pt-6 md:pt-8">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white text-center">
                    Certificate
                  </h3>
                  <div className="w-full rounded-xl overflow-hidden bg-gray-900 border-2 border-[#3533c7] shadow-2xl">
                    <img
                      src={selectedTeamMember.certificate}
                      alt={`${selectedTeamMember.name} Certificate`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default About;

