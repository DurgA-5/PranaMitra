import { Mail, Phone, MapPin } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import PranaMitraBrand from "../common/PranaMitraBrand";

function Footer() {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
        
        {/* Left Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <PranaMitraBrand size="responsive" showSubtitle={true} subtitleText="Blood Management System" darkBg={true} />


          <p className="text-xs md:text-sm text-slate-400 font-medium max-w-sm leading-relaxed">
            PranaMitra is a secure Blood Management System connecting student donors, patients, and registered blood banks to enable faster emergency blood support and efficient donor management.
          </p>

          <div className="pt-2 space-y-1.5 select-none">
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">
              Designed & Developed by
            </p>
            <p className="text-xs text-slate-400 font-bold tracking-wide">
              PAPUGANI DURGA PRASAD
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
              <a
                href="https://www.linkedin.com/in/durga-prasad-papugani-3a1391322/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                aria-label="LinkedIn Profile of Papugani Durga Prasad"
              >
                <FaLinkedin size={13} />
                <span>LinkedIn</span>
              </a>
              <span className="text-slate-800">|</span>
              <a
                href="https://github.com/DurgA-5/PranaMithra"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                aria-label="GitHub Repository of PranaMithra"
              >
                <FaGithub size={13} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Second Column: Quick Navigation (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs md:text-sm font-semibold text-slate-400">
            <li>
              <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="hover:text-red-500 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="hover:text-red-500 transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#features" onClick={(e) => handleNavClick(e, "#features")} className="hover:text-red-500 transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" onClick={(e) => handleNavClick(e, "#how-it-works")} className="hover:text-red-500 transition-colors">
                How It Works
              </a>
            </li>
            <li>
              <a href="#blood-banks" onClick={(e) => handleNavClick(e, "#blood-banks")} className="hover:text-red-500 transition-colors">
                Blood Banks
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")} className="hover:text-red-500 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Third Column: Resources (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Resources
          </h4>
          <ul className="space-y-2 text-xs md:text-sm font-semibold text-slate-400">
            <li>
              <a href="#faq" onClick={(e) => handleNavClick(e, "#faq")} className="hover:text-red-500 transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500 transition-colors">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500 transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500 transition-colors">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Fourth Column: Contact Information (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Contact Information
          </h4>
          <ul className="space-y-3 text-xs md:text-sm font-semibold text-slate-400">
            <li className="flex items-start gap-2.5">
              <Mail size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Email</p>
                <a href="mailto:support@pranamitra.org" className="hover:text-red-500 transition-colors break-all">
                  support@pranamitra.org
                </a>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Phone</p>
                <a href="tel:+91XXXXXXXXXX" className="hover:text-red-500 transition-colors">
                  +91 XXXXX XXXXX
                </a>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Location</p>
                <span className="text-slate-400">
                  Andhra Pradesh, India
                </span>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
        <p className="text-xs text-slate-500 font-bold tracking-wide">
          &copy; 2026 PranaMitra Blood Management System. All Rights Reserved.
        </p>

        <p className="text-xs text-slate-500 font-bold tracking-wide">
          Version 1.0
        </p>
      </div>
    </footer>
  );
}

export default Footer;
