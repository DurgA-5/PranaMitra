import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PranaMitraBrand from "../common/PranaMitraBrand";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { authenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardPath = () => {
    if (!role) return "/login";
    switch (role.toUpperCase()) {
      case "ADMIN":
        return "/admin";
      case "DONOR":
        return "/donor";
      case "PATIENT":
        return "/patient";
      default:
        return "/login";
    }
  };

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Blood Compatibility", href: "#compatibility" },
    { name: "Blood Banks", href: "#blood-banks" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
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
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm py-2.5"
            : "bg-white/95 backdrop-blur-lg border-b border-transparent py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center cursor-pointer select-none">
            <PranaMitraBrand size="responsive" showSubtitle={true} subtitleText="Blood Management System" />
          </Link>


          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="hover:text-red-600 transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {authenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors duration-200"
                >
                  <User size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-red-600/10"
                >
                  Register
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburguer */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer (AnimatePresence) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <PranaMitraBrand size="sm" showSubtitle={false} />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="text-base font-semibold text-slate-600 hover:text-red-600 py-1.5 transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="border-t border-slate-100 pt-6 flex flex-col gap-3">
                {authenticated ? (
                  <>
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                    >
                      <User size={16} />
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        navigate("/");
                      }}
                      className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-center"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-center"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors text-center shadow-md shadow-red-600/10"
                    >
                      Register Now
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;