import { ShieldCheck, HeartPulse, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../../assets/illustrations/hero-illustration.png";

function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const heroStats = [
    { value: "500+", label: "Registered Donors" },
    { value: "300+", label: "Patients Helped" },
    { value: "100+", label: "Blood Banks" },
    { value: "1000+", label: "Blood Requests" },
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-red-50/60 via-white to-slate-50 pt-28 lg:pt-36 pb-20 border-b border-slate-100"
    >
      {/* Decorative Glow Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[75vh]">
          
          {/* Left Text Box */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Trust Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-red-150 bg-red-50/70 px-4 py-1.5 text-xs md:text-sm text-red-600 font-semibold"
            >
              <ShieldCheck size={16} className="shrink-0" />
              <span>Trusted Digital Blood Management Platform</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-slate-900 tracking-tight"
            >
              Donate Blood, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                Save Lives.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
            >
              A modern blood donation platform connecting student donors, patients, and nearby blood banks in real time to save lives faster during emergency medical needs.
            </motion.p>

            {/* Action Call buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto text-center px-8 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-red-600/15"
              >
                Become a Donor
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto text-center px-8 py-4 rounded-2xl border-2 border-slate-200 text-slate-700 bg-white font-bold hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              >
                Request Blood
              </Link>
            </motion.div>

            {/* Banner stats grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-100"
            >
              {heroStats.map((stat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-950">
                    {stat.value}
                  </h3>
                  <p className="text-xs md:text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Vector Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            {/* Visual glow backgrounds */}
            <div className="absolute w-72 h-72 bg-red-200/40 rounded-full blur-3xl -z-10" />

            <div className="relative p-2 md:p-6 w-full max-w-md lg:max-w-none">
              <img
                src={heroImage}
                alt="Healthcare illustration"
                className="w-full h-auto object-contain select-none drop-shadow-xl hover:scale-[1.01] transition-transform duration-300"
              />

              {/* Floating Widget 1 */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute top-10 -left-4 md:-left-8 bg-white/95 backdrop-blur border border-slate-100 rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Verified Donors</h4>
                  <p className="text-xs text-slate-500 font-medium">Available Nearby</p>
                </div>
              </motion.div>

              {/* Floating Widget 2 */}
              <motion.div
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur border border-slate-100 rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                  <Activity size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Live Matching</h4>
                  <p className="text-xs text-slate-500 font-medium">Fast Support</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;