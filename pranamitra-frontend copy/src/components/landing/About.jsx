import { motion } from "framer-motion";
import { Compass, Eye, Heart, ShieldAlert, Award, Smile } from "lucide-react";

function About() {
  const values = [
    {
      icon: <Compass className="text-red-600" size={24} />,
      title: "Our Mission",
      description:
        "To bridge the gap between voluntary student blood donors and patients in critical need, ensuring timely and safe blood transfers through digital innovation.",
    },
    {
      icon: <Eye className="text-rose-600" size={24} />,
      title: "Our Vision",
      description:
        "A community where no medical emergency is delayed due to blood shortage, powered by active youth participation and intelligent tech mapping.",
    },
  ];

  const pointers = [
    {
      icon: <Heart size={20} className="text-red-500" />,
      text: "Saves up to 3 lives per donation",
    },
    {
      icon: <ShieldAlert size={20} className="text-red-500" />,
      text: "Critical for emergency treatments & surgeries",
    },
    {
      icon: <Award size={20} className="text-red-500" />,
      text: "Empowers youth and students in local communities",
    },
    {
      icon: <Smile size={20} className="text-red-500" />,
      text: "Completely voluntary and safe clinical process",
    },
  ];

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-600">
            About PranaMitra
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Connecting Communities, Saving Lives
          </p>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* 2 Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Mission & Vision Cards */}
          <div className="space-y-6">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-red-100 hover:shadow-lg hover:shadow-red-600/[0.02] transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm shrink-0">
                    {val.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{val.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {val.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side: Why Blood Donation Matters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-6 bg-red-50/30 p-8 rounded-3xl border border-red-50"
          >
            <h3 className="text-2xl font-extrabold text-slate-950">
              Why Blood Donation Matters
            </h3>
            
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Blood is a vital element of human life, and there is no substitute for it. Medical advancements depend on blood donations daily for surgeries, trauma care, chronic conditions, and cancer treatments. A single donation can support patients in their most vulnerable times.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {pointers.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="shrink-0">{item.icon}</div>
                  <span className="text-sm font-bold text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="p-5 bg-white/80 backdrop-blur rounded-2xl border border-white mt-6 shadow-sm">
              <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                Emergency Hotline Support
              </p>
              <p className="text-sm font-semibold text-slate-700">
                Are you in urgent need of blood? Click "Request Blood" to connect directly with nearest blood banks and matching donors.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default About;
