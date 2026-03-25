import { useState, useEffect } from 'react';
import wheelSvg from '../assets/logos/Wheel.svg';
import ronwayLogo from '../assets/logos/RonWayWhite3.svg';

function LoadingScreen({ onLoadingComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Speed up as it progresses for a nice feel
        const increment = prev < 60 ? 2 : prev < 85 ? 1.5 : 0.8;
        return Math.min(prev + increment, 100);
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Small pause at 100% before fading out
      const pauseTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 400);

      const completeTimer = setTimeout(() => {
        onLoadingComplete();
      }, 1100); // 400ms pause + 700ms fade

      return () => {
        clearTimeout(pauseTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [progress, onLoadingComplete]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0a1e42 0%, #050d1a 60%, #020813 100%)',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 700ms ease-out',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        zIndex: 9999,
      }}
    >
      {/* Subtle background particles / glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Spinning Wheel */}
        <div className="relative">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
              transform: 'scale(1.6)',
              animation: 'pulseGlow 2s ease-in-out infinite',
            }}
          />

          {/* Wheel container */}
          <div
            className="relative w-32 h-32 md:w-44 md:h-44"
            style={{
              animation: 'spinWheel 3s linear infinite',
              filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.3))',
            }}
          >
            <img
              src={wheelSvg}
              alt="Loading"
              className="w-full h-full object-contain"
              style={{
                filter: 'brightness(1.1)',
              }}
            />
          </div>
        </div>

        {/* Logo */}
        <img
          src={ronwayLogo}
          alt="RonWay"
          className="h-8 md:h-10 object-contain opacity-0"
          style={{
            animation: 'fadeInUp 0.8s ease-out 0.3s forwards',
          }}
        />

        {/* Progress bar */}
        <div className="w-48 md:w-56 opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out 0.5s forwards' }}>
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, rgba(59,130,246,0.5) 0%, rgba(96,165,250,0.9) 100%)',
                boxShadow: '0 0 8px rgba(59,130,246,0.5)',
              }}
            />
          </div>
          <p
            className="text-center text-[10px] md:text-xs text-white/30 mt-2 tracking-[0.2em] uppercase font-medium"
          >
            Loading
          </p>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes spinWheel {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1.5); }
          50% { opacity: 0.8; transform: scale(1.7); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;
