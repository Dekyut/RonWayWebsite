import { useState, useEffect } from 'react';
import logo from '../assets/logos/RONWAY4.svg';
import NavBar from './NavBar';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;
      setIsScrolled(scrollPosition > viewportHeight);
    };

    // Check initial scroll position
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 text-white shadow-[0_6px_25px_rgba(0,0,0,0.35)] transition-colors duration-300 ${
        isScrolled ? 'bg-[#051941]' : 'bg-black'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 sm:py-2.5">
        {/* Logo on the left */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="RonWay Cars and Travel, Inc."
            className="h-9 w-auto sm:h-11 md:h-12"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          />
        </div>

        {/* Navigation on the right */}
        <NavBar />
      </div>
    </header>
  );
}

export default Header;
