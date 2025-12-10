import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import SafetyPrecautions from './pages/SafetyPrecautions.jsx';
import Contact from './pages/Contact.jsx';
import HeaderLight from './components/light/HeaderLight.jsx';
import FooterLight from './components/light/FooterLight.jsx';
import HomeLight from './pages/light/HomeLight.jsx';
import AboutLight from './pages/light/AboutLight.jsx';
import ServicesLight from './pages/light/ServicesLight.jsx';
import ContactLight from './pages/light/ContactLight.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import PageTransition from './components/PageTransition.jsx';

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Only show loading screen on first visit to home page
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      setIsLoading(false);
    }
  }, []);

  // Set body background during loading - home screen is already rendered behind
  useEffect(() => {
    if (isLoading) {
      // Keep default background since home screen is already loaded behind
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    }
  }, [isLoading]);

  const handleLoadingComplete = () => {
    // Remove loading screen after fade completes
    setIsLoading(false);
    sessionStorage.setItem('hasVisited', 'true');
  };

  const location = useLocation();
  const isLightTheme = location.pathname.startsWith('/light');

  // Update document title based on current route
  useEffect(() => {
    const getPageTitle = (pathname) => {
      // Remove /light prefix for title mapping
      const path = pathname.replace('/light', '') || '/';
      
      const titleMap = {
        '/': 'Home | RonWay',
        '/about': 'About Us | RonWay',
        '/services': 'Services | RonWay',
        '/safety-precautions': 'Safety Precautions | RonWay',
        '/contact': 'Contact | RonWay',
      };
      
      return titleMap[path] || 'RonWay';
    };
    
    document.title = getPageTitle(location.pathname);
  }, [location.pathname]);

  return (
    <>
      {/* Home screen - always rendered, behind loading screen when loading */}
      <div className={`min-h-screen flex flex-col font-['Montserrat',system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] leading-normal font-normal ${
        isLightTheme 
          ? 'bg-gradient-to-b from-white via-blue-50 to-white text-[#0b0c0e]' 
          : 'bg-slate-50 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.15),transparent_55%)] text-slate-900'
      }`}>
        {isLightTheme ? <HeaderLight /> : <Header />}
        <ScrollToTopOnRouteChange />
        <main className="flex-1 w-full m-0 p-0">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <PageTransition>
                  <Home />
                </PageTransition>
              } />
              <Route path="/about" element={
                <PageTransition>
                  <About />
                </PageTransition>
              } />
              <Route path="/services" element={
                <PageTransition>
                  <Services />
                </PageTransition>
              } />
              <Route path="/safety-precautions" element={
                <PageTransition>
                  <SafetyPrecautions />
                </PageTransition>
              } />
              <Route path="/contact" element={
                <PageTransition>
                  <Contact />
                </PageTransition>
              } />
              <Route path="/light" element={
                <PageTransition>
                  <HomeLight />
                </PageTransition>
              } />
              <Route path="/light/about" element={
                <PageTransition>
                  <AboutLight />
                </PageTransition>
              } />
              <Route path="/light/services" element={
                <PageTransition>
                  <ServicesLight />
                </PageTransition>
              } />
              <Route path="/light/contact" element={
                <PageTransition>
                  <ContactLight />
                </PageTransition>
              } />
            </Routes>
          </AnimatePresence>
        </main>
        {isLightTheme ? <FooterLight /> : <Footer />}
        <ScrollToTop />
      </div>
      
      {/* Loading screen overlay - only shown when isLoading is true */}
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
    </>
  );
}

export default App;

