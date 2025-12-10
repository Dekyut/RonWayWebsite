import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import bg1 from '../assets/background/BG 1.svg';
import wheelSvg from '../assets/logos/Wheel.svg';
import firstAidKit from '../assets/safety_equipments/First Aid Kit.png';
import fireExtinguisher from '../assets/safety_equipments/Fire Extinguisher.png';
import dashcam from '../assets/safety_equipments/Dashcam.png';
import earlyWarningDevice from '../assets/safety_equipments/Early Warning Device.png';
import mirrorDashcam from '../assets/safety_equipments/Mirror dashcam.png';

function SafetyPrecautions() {
  const sectionRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

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

  return (
    <section 
      ref={sectionRef}
      className="w-full py-16 px-4 md:py-20 md:px-8 flex flex-col justify-center relative min-h-screen"
    >
      {/* Background with BG 1.svg */}
      <div 
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${bg1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="fixed inset-0 bg-[#010915]/80 z-0" />

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
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* Safety Precautions Section */}
      <div 
        className="max-w-[1200px] w-full mx-auto relative mt-20 mb-16"
        style={{ zIndex: 10 }}
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-sm uppercase tracking-[0.35em] text-[#85c1ff] font-semibold mb-4">Safety First</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Safety Precautions
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Your safety is our top priority. We equip all our vehicles with essential safety equipment to ensure a secure journey.
          </p>
        </motion.div>

        {/* Comprehensive Insurance Section */}
        <motion.div 
          className="bg-gradient-to-b from-[#04132f] to-[#010915] rounded-3xl border border-[#0b2f66] p-8 md:p-12 mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-[#85c1ff]">
              Comprehensive Insurance Coverage
            </h3>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-4xl mx-auto">
              All our vehicles are fully covered with <span className="font-bold text-white">COMPREHENSIVE INSURANCE</span> for the safety and protection of our clients.
            </p>
          </div>
        </motion.div>

        {/* Safety Equipment Section */}
        <motion.div 
          className="bg-gradient-to-b from-[#04132f] to-[#010915] rounded-3xl border border-[#0b2f66] p-8 md:p-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-[#85c1ff] text-center">
              Safety Equipment
            </h3>
            <p className="text-slate-200 mb-6 leading-relaxed text-center max-w-3xl mx-auto">
              Our services also come with safety equipment. Here are the items we provide in all our vehicles:
            </p>
          </div>

          {/* Safety Equipment Grid - 3 columns layout */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {/* Top Left: First Aid Kits (2 kits) */}
            <div className="bg-[#010915] border border-[#0b2f66] rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px] md:min-h-[250px] cursor-pointer group hover:border-[#85c1ff]/50 transition-all duration-300">
              <div 
                className="w-full h-32 md:h-40 bg-slate-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden group-hover:bg-slate-700 transition-colors duration-300"
                onClick={() => setSelectedImage(firstAidKit)}
              >
                <img 
                  src={firstAidKit} 
                  alt="First Aid Kit" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm md:text-base text-slate-200 text-center font-medium">First Aid Kits</p>
            </div>

            {/* Center: Fire Extinguisher */}
            <div className="bg-[#010915] border border-[#0b2f66] rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px] md:min-h-[250px] cursor-pointer group hover:border-[#85c1ff]/50 transition-all duration-300">
              <div 
                className="w-full h-32 md:h-40 bg-slate-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden group-hover:bg-slate-700 transition-colors duration-300"
                onClick={() => setSelectedImage(fireExtinguisher)}
              >
                <img 
                  src={fireExtinguisher} 
                  alt="Fire Extinguisher" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm md:text-base text-slate-200 text-center font-medium">Fire Extinguisher</p>
            </div>

            {/* Top Right: Dashcam */}
            <div className="bg-[#010915] border border-[#0b2f66] rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px] md:min-h-[250px] cursor-pointer group hover:border-[#85c1ff]/50 transition-all duration-300">
              <div 
                className="w-full h-32 md:h-40 bg-slate-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden group-hover:bg-slate-700 transition-colors duration-300"
                onClick={() => setSelectedImage(dashcam)}
              >
                <img 
                  src={dashcam} 
                  alt="Dashcam" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm md:text-base text-slate-200 text-center font-medium">Dashcam</p>
            </div>

            {/* Bottom Left: Philippine Early Warning Device */}
            <div className="bg-[#010915] border border-[#0b2f66] rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px] md:min-h-[250px] cursor-pointer group hover:border-[#85c1ff]/50 transition-all duration-300">
              <div 
                className="w-full h-32 md:h-40 bg-slate-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden group-hover:bg-slate-700 transition-colors duration-300"
                onClick={() => setSelectedImage(earlyWarningDevice)}
              >
                <img 
                  src={earlyWarningDevice} 
                  alt="Early Warning Device" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm md:text-base text-slate-200 text-center font-medium">Early Warning Device</p>
            </div>

            {/* Empty center cell */}
            <div className="bg-transparent"></div>

            {/* Bottom Right: Mirror Dashcam */}
            <div className="bg-[#010915] border border-[#0b2f66] rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px] md:min-h-[250px] cursor-pointer group hover:border-[#85c1ff]/50 transition-all duration-300">
              <div 
                className="w-full h-32 md:h-40 bg-slate-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden group-hover:bg-slate-700 transition-colors duration-300"
                onClick={() => setSelectedImage(mirrorDashcam)}
              >
                <img 
                  src={mirrorDashcam} 
                  alt="Mirror Dashcam" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm md:text-base text-slate-200 text-center font-medium">Mirror Dashcam</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Safety equipment"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold bg-black/50 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-200"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default SafetyPrecautions;

