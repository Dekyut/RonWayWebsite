import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home', to: '/light' },
  { label: 'About Us', to: '/light/about' },
  { label: 'Services', to: '/light/services' },
  { label: 'Contact Us', to: '/light/contact' },
];

function NavBarLight() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  return (
    <nav aria-label="Main navigation" className="relative" ref={menuRef}>
      {/* Hamburger Menu Button - Mobile Only */}
      {isMobile && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col gap-1.5 p-2 -mr-2"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-[#0b0c0e] transition-all duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-[#0b0c0e] transition-all duration-300 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-[#0b0c0e] transition-all duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <div className="flex items-center gap-4 text-sm font-medium text-[#0b0c0e]/70 md:gap-6 lg:gap-8">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/light'}
              className={({ isActive }) =>
                [
                  'border-b-2 pb-1 transition-colors',
                  isActive
                    ? 'border-[#093389] text-[#093389]'
                    : 'border-transparent hover:border-[#2cbafc] hover:text-[#093389]',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMobile && isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 rounded-lg border border-[#2cbafc]/20 bg-white shadow-2xl py-4 z-50">
          <div className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/light'}
                className={({ isActive }) =>
                  [
                    'px-4 py-3 text-sm font-medium transition-colors border-l-4',
                    isActive
                      ? 'border-[#093389] text-[#093389] bg-[#2cbafc]/10'
                      : 'border-transparent text-[#0b0c0e]/70 hover:text-[#093389] hover:bg-[#2cbafc]/5',
                  ].join(' ')
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBarLight;
