import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { 
    label: 'Home', 
    to: '/',
    dropdown: [
      { label: 'Cars', section: 'cars', description: 'Browse our fleet' },
      { label: 'Gallery', section: 'gallery', description: 'View our gallery' },
      { label: 'Reviews', section: 'reviews', description: 'Customer testimonials' },
    ]
  },
  { 
    label: 'About Us', 
    to: '/about',
    dropdown: [
      { label: 'Our Story', to: '/about', section: 'our-story', description: 'Learn about RonWay' },
      { label: 'Vision & Mission', to: '/about', section: 'mission', description: 'Our commitment' },
      { label: 'Team', to: '/about', section: 'team', description: 'Meet the team' },
    ]
  },
  { 
    label: 'Services', 
    to: '/services',
    dropdown: [
      { label: 'Our Services', to: '/services', section: 'services', description: 'All services' },
      { label: 'What We Offer', to: '/services', section: 'what-we-offer', description: 'Our offerings' },
      { label: 'Safety Precautions', to: '/safety-precautions', description: 'Safety measures' },
      { label: 'Process Flow', to: '/services', section: 'process-flow', description: 'How we work' },
    ]
  },
  { 
    label: 'Contact Us', 
    to: '/contact',
    dropdown: [
      { label: 'Contact Form', to: '/contact', section: 'contact-form', description: 'Get in touch' },
      { label: 'Location', to: '/contact', section: 'location', description: 'Find us' },
      { label: 'FAQ', to: '/contact', section: 'faq', description: 'Frequently asked questions' },
    ]
  },
];

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [hoveredDropdownItem, setHoveredDropdownItem] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const dropdownRefs = useRef({});
  const hoverTimeoutRef = useRef(null);
  const menuRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Handle navigation to section on page load or route change
  useEffect(() => {
    const scrollToSectionOnLoad = () => {
      // Get hash from URL (React Router might not preserve it in location.hash)
      const hashFromUrl = window.location.hash.replace('#', '');
      const hash = hashFromUrl || location.hash.replace('#', '');
      
      if (hash) {
        // Wait for page to render, try multiple times with increasing delays
        const attemptScroll = (attempt = 0) => {
          const element = document.getElementById(hash);
          if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            setCurrentSection(hash);
            // Update URL hash if not already there
            if (window.location.hash !== `#${hash}`) {
              window.history.replaceState(null, '', `#${hash}`);
            }
          } else if (attempt < 5) {
            // Retry if element not found yet (page still loading)
            setTimeout(() => attemptScroll(attempt + 1), 200 * (attempt + 1));
          }
        };
        
        // Start with a small delay, then retry if needed
        setTimeout(() => attemptScroll(), 100);
      }
    };

    scrollToSectionOnLoad();
  }, [location.pathname, location.hash]);

  // Track current section based on scroll position and hash
  useEffect(() => {
    const updateCurrentSection = () => {
      const hash = location.hash.replace('#', '');
      if (hash) {
        setCurrentSection(hash);
        return;
      }

      // Get sections based on current page
      let sections = [];
      if (location.pathname === '/') {
        sections = ['cars', 'gallery', 'reviews'];
      } else if (location.pathname === '/about') {
        sections = ['our-story', 'mission', 'team'];
      } else if (location.pathname === '/services') {
        sections = ['services', 'what-we-offer', 'process-flow'];
      } else if (location.pathname === '/contact') {
        sections = ['contact-form', 'location', 'faq'];
      }

      const scrollPosition = window.scrollY + 150; // Offset for header

      // Find the section we're currently in (check from bottom to top)
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          // Check if we're past the start of this section
          if (scrollPosition >= elementTop - 100) {
            setCurrentSection(sections[i]);
            return;
          }
        }
      }
      
      // If at the top of the page, set the first section
      if (sections.length > 0 && window.scrollY < 200) {
        const firstElement = document.getElementById(sections[0]);
        if (firstElement) {
          setCurrentSection(sections[0]);
          return;
        }
      }
      
      setCurrentSection(null);
    };

    updateCurrentSection();
    window.addEventListener('scroll', updateCurrentSection, { passive: true });
    window.addEventListener('hashchange', updateCurrentSection);

    return () => {
      window.removeEventListener('scroll', updateCurrentSection);
      window.removeEventListener('hashchange', updateCurrentSection);
    };
  }, [location.hash, location.pathname]);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 100; // Account for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        // Update hash without triggering scroll
        window.history.replaceState(null, '', `#${sectionId}`);
        setCurrentSection(sectionId);
      }
    }, 100);
  };

  // Handle dropdown hover
  const handleDropdownEnter = (itemLabel) => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setOpenDropdown(itemLabel);
  };

  const handleDropdownLeave = () => {
    if (isMobile) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // Handle dropdown item hover - auto-scroll if on same page
  const handleDropdownItemHover = (item, index) => {
    if (isMobile) return;
    
    setHoveredDropdownItem(index);
    
    // If item has a section and we're on the same page, scroll to it
    if (item.section) {
      if (item.to && location.pathname === item.to.split('#')[0]) {
        scrollToSection(item.section);
      } else if (!item.to && location.pathname === '/') {
        scrollToSection(item.section);
      }
    }
  };

  // Check if dropdown item should be highlighted (when not hovering)
  const isDropdownItemActive = (dropdownItem) => {
    // Highlight if current section matches
    if (dropdownItem.section && currentSection === dropdownItem.section) {
      return true;
    }
    
    // For items with hash in URL, check if hash matches
    if (dropdownItem.to && dropdownItem.to.includes('#')) {
      const hash = dropdownItem.to.split('#')[1];
      if (location.hash === `#${hash}`) {
        return true;
      }
    }
    
    // For regular links without sections, only highlight if exact route match AND we're at the top of the page
    if (dropdownItem.to && !dropdownItem.section) {
      // Only highlight if we're on that route AND at the top (no hash, no current section)
      if (location.pathname === dropdownItem.to && !currentSection && !location.hash) {
        return true;
      }
    }
    
    return false;
  };

  return (
    <nav aria-label="Main navigation" className="relative" ref={menuRef}>
      {/* Hamburger Menu Button - Mobile Only */}
      {isMobile && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="flex flex-col gap-1.5 p-2 -mr-2"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <div className="flex items-center gap-2 text-sm font-medium md:gap-4 lg:gap-6">
          {NAV_ITEMS.map((item) => {
            const isOpen = openDropdown === item.label;
            const hasDropdown = item.dropdown && item.dropdown.length > 0;

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => hasDropdown && handleDropdownEnter(item.label)}
                onMouseLeave={handleDropdownLeave}
                ref={(el) => (dropdownRefs.current[item.label] = el)}
              >
                <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                      'px-3 py-2 rounded-lg transition-all duration-200 font-["Montserrat",sans-serif]',
                      isActive || isOpen
                        ? 'bg-[#051941] text-white'
                        : 'text-gray-200 hover:text-white hover:bg-[#051941]/50',
                  ].join(' ')
                }
              >
                  {item.label}
              </NavLink>

                {/* Dropdown */}
                {hasDropdown && isOpen && (
                  <div
                    className="absolute right-0 mt-2 w-[500px] rounded-lg border border-white/20 bg-[#051941] shadow-2xl py-4 z-50"
                    onMouseEnter={() => hasDropdown && handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="grid grid-cols-2 gap-4 px-4">
                      {item.dropdown.map((dropdownItem, index) => {
                        const isActive = isDropdownItemActive(dropdownItem);
                        const isHovered = hoveredDropdownItem === index;

                        // Determine the target path - use dropdownItem.to if available, otherwise use parent item.to
                        const targetPath = dropdownItem.to ? dropdownItem.to.split('#')[0] : item.to;
                        
                        return (
                          <div
                            key={index}
                            className="group cursor-pointer"
                            onMouseEnter={() => handleDropdownItemHover(dropdownItem, index)}
                            onMouseLeave={() => setHoveredDropdownItem(null)}
                          >
                            {targetPath ? (
                              <NavLink
                                to={targetPath}
                                onClick={(e) => {
                                  if (dropdownItem.section) {
                                    if (location.pathname === targetPath) {
                                      // Same page - prevent default and scroll
                                      e.preventDefault();
                                      scrollToSection(dropdownItem.section);
                                    } else {
                                      // Different page - navigate programmatically with hash
                                      e.preventDefault();
                                      navigate(`${targetPath}#${dropdownItem.section}`);
                                      // Scroll will be handled by useEffect after navigation
                                    }
                                  }
                                  setOpenDropdown(null);
                                }}
                                className={() =>
                                  [
                                    'block p-3 rounded-md transition-all duration-200',
                                    (isActive && !isHovered) || isHovered
                                      ? 'bg-[#1e3a8a] text-white'
                                      : 'text-gray-200 hover:bg-[#1e3a8a]/50 hover:text-white',
                                  ].join(' ')
                                }
                              >
                                <div className="font-semibold text-white mb-1 text-sm">
                                  {dropdownItem.label}
                                </div>
                                <div className="text-xs text-gray-400 group-hover:text-gray-300">
                                  {dropdownItem.description}
                                </div>
                              </NavLink>
                            ) : (
                              <div 
                                className={`block p-3 rounded-md transition-all duration-200 cursor-pointer ${
                                  (isActive && !isHovered) || isHovered
                                    ? 'bg-[#1e3a8a] text-white'
                                    : 'text-gray-200 hover:bg-[#1e3a8a]/50 hover:text-white'
                                }`}
                                onClick={() => {
                                  if (dropdownItem.section) {
                                    scrollToSection(dropdownItem.section);
                                  }
                                  setOpenDropdown(null);
                                }}
                              >
                                <div className="font-semibold text-white mb-1 text-sm">
                                  {dropdownItem.label}
                                </div>
                                <div className="text-xs text-gray-400 group-hover:text-gray-300">
                                  {dropdownItem.description}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMobile && isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 rounded-lg border border-white/20 bg-[#051941] shadow-2xl py-4 z-50">
          <div className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const hasDropdown = item.dropdown && item.dropdown.length > 0;

              if (!hasDropdown) {
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      [
                        'px-4 py-3 text-sm font-medium transition-colors border-l-4',
                        isActive
                          ? 'border-white text-white bg-white/10'
                          : 'border-transparent text-gray-200 hover:text-white hover:bg-white/5',
                      ].join(' ')
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </NavLink>
                );
              }

              return (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMobileOpenDropdown(mobileOpenDropdown === item.label ? null : item.label);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors border-l-4 flex items-center justify-between ${
                      mobileOpenDropdown === item.label
                        ? 'border-white text-white bg-white/10'
                        : 'border-transparent text-gray-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                    <span className="text-xs opacity-80">
                      {mobileOpenDropdown === item.label ? '▲' : '▼'}
                    </span>
                  </button>

                  {mobileOpenDropdown === item.label && item.dropdown && (
                    <div className="bg-[#1e3a8a]/30 border-l-4 border-white/30 ml-4">
                      {item.dropdown.map((dropdownItem, index) => {
                        // Determine the target path - use dropdownItem.to if available, otherwise use parent item.to
                        const targetPath = dropdownItem.to ? dropdownItem.to.split('#')[0] : item.to;
                        
                        return targetPath ? (
                          <NavLink
                            key={index}
                            to={targetPath}
                            className={({ isActive }) =>
                              [
                                'block px-4 py-2 text-sm transition-colors',
                                isActive
                                  ? 'bg-white/10 text-white'
                                  : 'text-gray-200 hover:bg-white/5 hover:text-white',
                              ].join(' ')
                            }
                            onClick={(e) => {
                              if (dropdownItem.section) {
                                if (location.pathname === targetPath) {
                                  // Same page - prevent default and scroll
                                  e.preventDefault();
                                  scrollToSection(dropdownItem.section);
                                } else {
                                  // Different page - navigate programmatically with hash
                                  e.preventDefault();
                                  navigate(`${targetPath}#${dropdownItem.section}`);
                                  // Scroll will be handled by useEffect after navigation
                                }
                              }
                              setIsMenuOpen(false);
                              setMobileOpenDropdown(null);
                            }}
                          >
                            {dropdownItem.label}
                          </NavLink>
                        ) : (
                          <button
                            key={index}
                            onClick={() => {
                              if (dropdownItem.section) {
                                scrollToSection(dropdownItem.section);
                              }
                              setIsMenuOpen(false);
                              setMobileOpenDropdown(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-200 transition-colors hover:bg-white/5 hover:text-white"
                          >
                            {dropdownItem.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
