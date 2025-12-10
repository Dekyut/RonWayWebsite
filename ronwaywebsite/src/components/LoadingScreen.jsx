import { useState, useEffect } from 'react';
import carSvg from '../assets/logos/car2.svg';
import carSmokeGif from '../assets/logos/carsmoke2.gif';

function LoadingScreen({ onLoadingComplete }) {
  const [stage, setStage] = useState('entering'); // 'entering', 'smoke', 'exiting'
  const [position, setPosition] = useState('below'); // 'below', 'middle', 'top'
  const [isFadingOut, setIsFadingOut] = useState(false);

  // No need to manipulate body background - home screen is already rendered behind

  useEffect(() => {
    // Start: Car is below screen, move to middle
    const enterTimer = setTimeout(() => {
      setPosition('middle');
    }, 100);

    // After car reaches middle, wait for loading
    const loadingTimer = setTimeout(() => {
      setStage('smoke');
    }, 1500); // 1.5 seconds to reach middle + loading time

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  useEffect(() => {
    if (stage === 'smoke') {
      // Show smoke animation for 2-3 seconds
      const smokeTimer = setTimeout(() => {
        setStage('exiting');
        // Switch back to car.svg before exiting
        setTimeout(() => {
          setPosition('top');
        }, 100);
      }, 2500); // Show smoke for 2.5 seconds

      return () => clearTimeout(smokeTimer);
    }
  }, [stage]);

  useEffect(() => {
    if (position === 'top') {
      // Start fade out after car moves up (wait for car to be mostly out of view)
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 800); // Start fading after car has moved up significantly
      
      // Wait for exit animation and fade to complete before calling onLoadingComplete
      // Add extra buffer to ensure fade is completely done before home screen renders
      const exitTimer = setTimeout(() => {
        onLoadingComplete();
      }, 1400); // Total: 800ms delay + 500ms fade + 100ms buffer = 1400ms

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [position, onLoadingComplete]);

  const getTransform = () => {
    switch (position) {
      case 'below':
        return 'translateY(100vh)';
      case 'middle':
        return 'translateY(0)';
      case 'top':
        return 'translateY(-150vh)';
      default:
        return 'translateY(100vh)';
    }
  };

  const getCarImage = () => {
    return stage === 'smoke' ? carSmokeGif : carSvg;
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-500 ease-out"
      style={{
        backgroundColor: '#000000',
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? 'none' : 'auto',
        zIndex: 9999
      }}
    >
      <div
        className="transition-transform duration-1000 ease-in-out"
        style={{
          transform: getTransform(),
        }}
      >
        <img
          src={getCarImage()}
          alt="Loading car"
          className="w-64 h-64 md:w-96 md:h-96 object-contain"
        />
      </div>
    </div>
  );
}

export default LoadingScreen;

