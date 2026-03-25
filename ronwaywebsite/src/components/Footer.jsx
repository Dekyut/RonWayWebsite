import { Link } from 'react-router-dom';
import xIcon from '../assets/logos/X-SocMedIcon2.png';
import ronwayLogo from '../assets/logos/RonWayWhite3.svg';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'PAGES',
      links: [
        { label: 'Home', to: '/' },
        { label: 'About Us', to: '/about' },
        { label: 'Services', to: '/services' },
        { label: 'Safety Precautions', to: '/safety-precautions' },
        { label: 'Contact Us', to: '/contact' },
      ],
    },
    {
      title: 'COMPANY',
      links: [
        { label: 'Our Story', to: '/about#our-story' },
        { label: 'Vision & Mission', to: '/about#mission' },
        { label: 'Our Team', to: '/about#team' },
        { label: 'Location', to: '/contact#location' },
      ],
    },
    {
      title: 'SERVICES',
      links: [
        { label: 'Our Services', to: '/services#services' },
        { label: 'What We Offer', to: '/services#what-we-offer' },
        { label: 'Process Flow', to: '/services#process-flow' },
        { label: 'Fleet Gallery', to: '/#gallery' },
      ],
    },
    {
      title: 'CONTACT',
      links: [
        { label: 'Contact Form', to: '/contact#contact-form' },
        { label: 'Our Location', to: '/contact#location' },
        { label: 'FAQ', to: '/contact#faq' },
      ],
      extra: [
        { icon: 'email', text: 'ronwaycars.travel@gmail.com' },
        { icon: 'phone', text: '0968-852-7834' },
      ],
    },
    {
      title: 'LEGAL',
      links: [
        { label: 'Data Privacy Policy', to: '/data-privacy' },
      ],
    },
  ];

  return (
    <footer className="relative z-20 w-full bg-[#0a1628] text-white">
      {/* Top border accent */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>

      {/* Main Footer Content */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 pt-12 pb-8">
        {/* Footer Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-6 lg:gap-10">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-bold tracking-[0.15em] text-white/50 mb-5 uppercase">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/80 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Extra info (email/phone for Contact section) */}
              {section.extra && (
                <div className="mt-5 space-y-3">
                  {section.extra.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      {item.icon === 'email' && (
                        <svg className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                      {item.icon === 'phone' && (
                        <svg className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      )}
                      <span className="text-xs text-white/60 break-all">{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mt-10 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Media Icons */}
          <div className="flex items-center gap-5">
            {/* X / Twitter */}
            <a
              href="#"
              aria-label="RonWay on X/Twitter"
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center overflow-hidden transition-colors duration-200"
            >
              <img
                src={xIcon}
                alt="X/Twitter"
                className="h-full w-full object-contain p-1.5"
              />
            </a>

            {/* Facebook */}
            <a
              href="#"
              aria-label="RonWay on Facebook"
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5 text-white fill-current"
              >
                <path d="M15.117 8.667H13.3v-1.28c0-.437.29-.538.495-.538h1.284V4.012h-1.767c-1.944 0-2.386 1.405-2.386 2.304v2.351h-1.17V11.2h1.17v7.789h2.374V11.2h1.606l.211-2.533Z" />
              </svg>
            </a>
          </div>

          {/* Bottom Center Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-white/50">
            <Link to="/data-privacy" className="hover:text-white transition-colors duration-200">
              Data Privacy
            </Link>
            <span className="hidden sm:inline text-white/20">|</span>
            <Link to="/contact" className="hover:text-white transition-colors duration-200">
              Contact Us
            </Link>
          </div>

          {/* Logo + Copyright */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <img
              src={ronwayLogo}
              alt="RonWay Logo"
              className="h-8 md:h-10 object-contain"
            />
            <p className="text-xs text-white/40">
              &copy; {currentYear} RonWay. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
