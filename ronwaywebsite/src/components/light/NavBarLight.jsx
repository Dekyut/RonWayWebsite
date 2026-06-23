import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/bodyScrollLock';

const NAV_ITEMS = [
  { label: 'Home', to: '/light' },
  { label: 'About Us', to: '/light/about' },
  { label: 'Services', to: '/light/services' },
  { label: 'Contact Us', to: '/light/contact' },
];

function NavBarLight() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileMenuStyle, setMobileMenuStyle] = useState({ top: 0, right: 16 });
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      lockBodyScroll();
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (isMenuOpen) {
        unlockBodyScroll();
      }
    };
  }, [isMenuOpen]);

  const toggleMobileMenu = () => {
    if (!isMenuOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setMobileMenuStyle({
        top: rect.bottom + 8,
        right: Math.max(16, window.innerWidth - rect.right),
      });
    }
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav aria-label="Main navigation" className="relative" ref={menuRef}>
      {/* Hamburger Menu Button - Mobile Only */}
      {isMobile && (
        <button
          type="button"
          onClick={toggleMobileMenu}
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
        <div
          className="fixed w-64 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-lg border border-[#2cbafc]/20 bg-white shadow-2xl py-4 z-[60]"
          style={{ top: mobileMenuStyle.top, right: mobileMenuStyle.right }}
        >
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
