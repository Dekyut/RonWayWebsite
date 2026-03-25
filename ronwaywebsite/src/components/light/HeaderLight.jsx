import logo from '../../assets/logos/RonWayFullLogo.svg';
import NavBarLight from './NavBarLight';

function HeaderLight() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#2cbafc]/20 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 sm:py-2.5 md:px-12">
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
        <NavBarLight />
      </div>
    </header>
  );
}

export default HeaderLight;
