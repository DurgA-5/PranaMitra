import { Outlet, useLocation } from "react-router-dom";
import logo from "../assets/logos/pranamitra-logo.jpeg";

function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname.includes("/register");

  return (
    <div className="h-screen w-screen bg-[#F8F9FA] flex overflow-hidden font-sans">
      {/* Left Side: Desktop/Tablet Branding Panel (40%) */}
      <div className="hidden md:flex w-[40%] bg-gradient-to-b from-[#B71C1C] to-[#E53935] text-white p-12 flex-col justify-center items-center h-full select-none shadow-2xl relative overflow-hidden text-center">
        {/* Subtle background texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="z-10 flex flex-col items-center justify-center space-y-8 max-w-sm">
          {/* Large PranaMitra Logo */}
          <img
            src={logo}
            alt="PranaMitra Logo"
            className="w-36 h-36 rounded-[28px] object-cover shadow-2xl border-4 border-white/20 hover:scale-105 transition-transform duration-300"
          />

          {isRegister ? (
            /* Register Page Left Branding Panel Content */
            <>
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-white leading-none">Join PranaMitra</h1>
                <p className="text-red-100 text-xs font-semibold uppercase tracking-widest mt-1">
                  Become a Part of Saving Lives
                </p>
              </div>

              {/* Thin Divider */}
              <div className="w-24 h-[1px] bg-white/20" />

              {/* Description */}
              <p className="text-red-100 text-sm leading-relaxed text-slate-100/90 font-medium">
                Register as a Student Donor or Patient and help build a stronger blood donation community.
              </p>

              {/* Thin Divider */}
              <div className="w-24 h-[1px] bg-white/20" />

              {/* Slogan */}
              <div className="space-y-1.5">
                <p className="text-xs text-red-100 font-semibold uppercase tracking-wider">
                  Your Registration Can Save Lives.
                </p>
              </div>
            </>
          ) : (
            /* Login/Default Page Left Branding Panel Content */
            <>
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-white leading-none">PranaMitra</h1>
                <p className="text-red-100 text-xs font-semibold uppercase tracking-widest mt-1">
                  Digital Blood Management Platform
                </p>
              </div>

              {/* Thin Divider */}
              <div className="w-24 h-[1px] bg-white/20" />

              {/* Slogan */}
              <div className="space-y-1.5">
                <p className="text-base font-bold tracking-wide text-white">Every Drop Counts.</p>
                <p className="text-xs text-red-100 font-semibold uppercase tracking-wider">Every Donation Saves a Life.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side: Centered Viewport Authentication Container (60% or full on mobile) */}
      <div className="flex-1 w-full md:w-[60%] flex flex-col justify-center items-center p-6 h-full overflow-y-auto bg-[#F8F9FA]">
        <div className="w-full max-w-[430px] flex flex-col items-center">
          {/* Logo on mobile only */}
          <div className="md:hidden mb-6 flex flex-col items-center select-none text-center">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 rounded-[20px] object-cover shadow-lg mb-3 border-2 border-[#B71C1C]/10"
            />
            {isRegister ? (
              <>
                <h2 className="text-2xl font-black text-[#212121]">Join PranaMitra</h2>
                <p className="text-[#6B7280] text-xs font-bold uppercase tracking-wider mt-1">
                  Become a Part of Saving Lives
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-black text-[#212121]">PranaMitra</h2>
                <p className="text-[#6B7280] text-xs font-bold uppercase tracking-wider mt-1">
                  Digital Blood Management Platform
                </p>
              </>
            )}
          </div>

          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;