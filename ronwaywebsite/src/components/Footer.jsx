import xIcon from '../assets/logos/X-SocMedIcon2.png';

function Footer() {
  return (
    <footer className="relative z-20 w-full bg-[#021945] border-t-[8px] border-[#b5b5b5] flex flex-col items-center text-white shadow-[0_-8px_25px_rgba(0,0,0,0.2)]">

        <div className="w-full py-8 md:py-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-8">
            <div
              className="h-12 w-12 rounded-full bg-black flex items-center justify-center overflow-hidden"
              aria-label="RonWay on X/Twitter"
            >
              <img
                src={xIcon}
                alt="X/Twitter"
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div aria-label="RonWay on Facebook">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-11 w-11 text-white fill-current"
              >
                <path d="M15.117 8.667H13.3v-1.28c0-.437.29-.538.495-.538h1.284V4.012h-1.767c-1.944 0-2.386 1.405-2.386 2.304v2.351h-1.17V11.2h1.17v7.789h2.374V11.2h1.606l.211-2.533Z" />
              </svg>
            </div>
          </div>
          <p className="text-sm md:text-base tracking-wide text-center w-full">Copyright @ RonWay 2025. All rights reserved.</p>
        </div>
      </footer>
  );
}

export default Footer;


