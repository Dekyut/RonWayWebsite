import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import homeBg from '../../assets/background/Home-BG.png';
import wheelSvg from '../../assets/logos/Wheel.svg';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const MILESTONES = [
  { year: '2025', title: 'Company Launch', body: 'Started with a single premium van servicing airport transfers around Metro Manila.' },
  { year: '2026', title: 'Fleet Expansion', body: 'Grew to a multi-brand lineup of SUVs, MPVs, and executive vans to match client demand.' },
  { year: '2027', title: 'Travel Solutions', body: 'Introduced curated travel programs and corporate mobility retainers for enterprise partners.' }
];

const CORE_VALUES = [
  { title: 'Reliability', body: 'Meticulously maintained units and 24/7 dispatch monitoring keep every trip on schedule.', icon: '✓' },
  { title: 'Safety', body: 'Professional chauffeurs, real-time tracking, and comprehensive insurance for absolute peace of mind.', icon: '🛡' },
  { title: 'Hospitality', body: 'White-glove service, flexible itineraries, and concierge-level trip coordination.', icon: '✨' }
];

const TEAM_MEMBERS = [
  { name: 'John Doe', role: 'Founder & CEO', description: 'Visionary leader with over 15 years of experience in the transportation industry.' },
  { name: 'Jane Smith', role: 'Operations Manager', description: 'Ensures seamless operations and exceptional service delivery across all routes.' },
  { name: 'Mike Johnson', role: 'Fleet Director', description: 'Oversees vehicle maintenance and fleet expansion to meet growing demand.' },
  { name: 'Sarah Williams', role: 'Customer Relations', description: 'Dedicated to providing personalized service and building lasting client relationships.' }
];

function AboutLight() {
  const [rotation, setRotation] = useState(0);
  const sectionRef = useRef(null);
  const [headerRef, headerVisible] = useScrollAnimation();
  const [valuesRef, valuesVisible] = useScrollAnimation();
  const [visionRef, visionVisible] = useScrollAnimation();
  const [missionRef, missionVisible] = useScrollAnimation();
  const [timelineRef, timelineVisible] = useScrollAnimation();
  const [teamRef, teamVisible] = useScrollAnimation();

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
        
        setRotation(scrollProgress * 360);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Hero Section - Minimalist */}
      <section 
        ref={sectionRef}
        className="relative w-full min-h-[60vh] flex items-center justify-center"
        style={{ 
          backgroundImage: `url(${homeBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#2cbafc]/10 via-white to-[#093389]/5"></div>
        
        {/* Wheel background element */}
        <div 
          className="fixed bottom-0 left-0 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-15 pointer-events-none"
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
            style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(2000%) hue-rotate(200deg) brightness(0.9) contrast(1.2)' }}
          />
        </div>
        
        <div 
          ref={headerRef}
          className={`max-w-4xl mx-auto px-6 md:px-12 py-20 text-center relative z-10 transition-all duration-1000 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="text-sm font-medium tracking-widest uppercase text-[#2cbafc] mb-6 block">About Us</span>
          <h1 className="text-6xl md:text-8xl font-light text-[#0b0c0e] mb-6 leading-tight">
            Premium Mobility
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#2cbafc] to-[#093389] mx-auto mb-8"></div>
          <p className="text-xl text-[#0b0c0e]/70 leading-relaxed max-w-2xl mx-auto">
            RonWay Cars and Travel, Inc. is a Philippine-based rental and transport partner delivering dependable ground travel for families, executives, and corporate teams. We pair a curated fleet with concierge-level trip planning so you can focus on the destination.
          </p>
        </div>
      </section>

      {/* Core Values - Horizontal Cards with Icons */}
      <section className="w-full py-20 px-6 md:px-12 bg-white">
        <div 
          ref={valuesRef}
          className={`max-w-7xl mx-auto transition-all duration-1000 ease-out ${
            valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {CORE_VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                className="group relative p-8 bg-gradient-to-br from-white to-[#2cbafc]/5 rounded-2xl border-l-4 border-[#093389] cursor-pointer transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  boxShadow: "0_20px_40px_rgba(44,186,252,0.25)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-semibold text-[#093389] mb-3">{value.title}</h3>
                <p className="text-[#0b0c0e]/70 leading-relaxed">{value.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission - Side by Side Split */}
      <section className="w-full py-20 px-6 md:px-12 bg-gradient-to-b from-white to-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            ref={visionRef}
            className={`mb-12 cursor-pointer transition-all duration-1000 ease-out ${
              visionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            whileHover={{
              scale: 1.02,
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-white p-10 md:p-16 rounded-3xl shadow-lg border-t-4 border-[#2cbafc]">
              <div className="flex items-start gap-6">
                <div className="w-2 h-20 bg-gradient-to-b from-[#2cbafc] to-[#093389] rounded-full flex-shrink-0"></div>
                <div>
                  <span className="text-sm font-medium tracking-widest uppercase text-[#2cbafc] mb-4 block">Our Vision</span>
                  <h2 className="text-4xl md:text-5xl font-light text-[#093389] mb-6">Trusted Excellence</h2>
                  <p className="text-lg text-[#0b0c0e]/70 leading-relaxed">
                    To become one of the most trusted and preferred car rental and travel service companies in the Philippines by consistently offering quality vehicles, dependable service, and exceptional customer care.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            ref={missionRef}
            className={`cursor-pointer transition-all duration-1000 ease-out ${
              missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            whileHover={{
              scale: 1.02,
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-gradient-to-br from-[#093389] to-[#2cbafc] p-10 md:p-16 rounded-3xl shadow-lg text-white">
              <div className="flex items-start gap-6">
                <div className="w-2 h-20 bg-white/30 rounded-full flex-shrink-0"></div>
                <div>
                  <span className="text-sm font-medium tracking-widest uppercase text-white/80 mb-4 block">Our Mission</span>
                  <h2 className="text-4xl md:text-5xl font-light mb-6">Seamless Journeys</h2>
                  <p className="text-lg text-white/90 leading-relaxed">
                    To deliver convenient, safe, and reliable car rental and travel services that make every client's journey comfortable, efficient, and worry-free.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline - Vertical Flow Design */}
      <section className="w-full py-20 px-6 md:px-12 bg-[#f8fafc]">
        <div 
          ref={timelineRef}
          className={`max-w-4xl mx-auto transition-all duration-1000 ease-out ${
            timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <span className="text-sm font-medium tracking-widest uppercase text-[#2cbafc] mb-4 block">Our Journey</span>
            <h2 className="text-5xl md:text-6xl font-light text-[#0b0c0e] mb-4">Milestones</h2>
            <div className="w-20 h-0.5 bg-[#2cbafc] mx-auto"></div>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2cbafc] via-[#093389] to-[#2cbafc] transform md:-translate-x-1/2"></div>

            {MILESTONES.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`relative mb-12 flex items-start gap-6 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-[#093389] rounded-full border-4 border-white shadow-lg transform md:-translate-x-1/2 z-10"></div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                  <motion.div 
                    className="bg-white p-6 rounded-xl shadow-lg border border-[#2cbafc]/20 cursor-pointer"
                    whileHover={{
                      scale: 1.05,
                      y: -8,
                      boxShadow: "0_20px_40px_rgba(44,186,252,0.25)",
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-sm font-semibold text-[#2cbafc] mb-2">{milestone.year}</div>
                    <h3 className="text-2xl font-semibold text-[#093389] mb-3">{milestone.title}</h3>
                    <p className="text-[#0b0c0e]/70 leading-relaxed">{milestone.body}</p>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team - Horizontal Cards */}
      <section className="w-full py-20 px-6 md:px-12 bg-white">
        <div 
          ref={teamRef}
          className={`max-w-7xl mx-auto transition-all duration-1000 ease-out ${
            teamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <span className="text-sm font-medium tracking-widest uppercase text-[#2cbafc] mb-4 block">Our Team</span>
            <h2 className="text-5xl md:text-6xl font-light text-[#0b0c0e] mb-4">Meet the Experts</h2>
            <div className="w-20 h-0.5 bg-[#2cbafc] mx-auto"></div>
          </div>

          <div className="space-y-6">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.div
                key={member.name}
                className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg cursor-pointer transition-all duration-300 border-l-4 border-[#2cbafc]"
                style={{ transitionDelay: `${index * 100}ms` }}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  boxShadow: "0_25px_60px_rgba(44,186,252,0.25)",
                  borderColor: '#093389',
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#093389] to-[#2cbafc] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-[#093389] mb-1">{member.name}</h3>
                    <p className="text-[#2cbafc] font-medium mb-3">{member.role}</p>
                    <p className="text-[#0b0c0e]/70 leading-relaxed">{member.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutLight;
