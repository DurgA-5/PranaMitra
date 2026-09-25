import { motion } from "framer-motion";
import { Users, AlertTriangle, Building2, MapPin, ShieldCheck, BarChart3 } from "lucide-react";

function Features() {
  const list = [
    {
      icon: <Users className="text-red-600" size={28} />,
      title: "Student Donor Network",
      description:
        "Connects a large network of active, healthy, and verified student donors willing to assist during emergencies.",
    },
    {
      icon: <AlertTriangle className="text-amber-500" size={28} />,
      title: "Emergency Blood Requests",
      description:
        "Submit critical blood requests instantly. Nearby donors matching the target blood group receive urgent alerts.",
    },
    {
      icon: <Building2 className="text-emerald-600" size={28} />,
      title: "Nearby Blood Banks",
      description:
        "Find and contact local certified blood banks. Access real-time contact details and location directions.",
    },
    {
      icon: <MapPin className="text-blue-600" size={28} />,
      title: "Real-Time Tracking",
      description:
        "Track the progress of your active blood requests from acceptance by a donor through to the final donation.",
    },
    {
      icon: <ShieldCheck className="text-indigo-600" size={28} />,
      title: "Secure Authentication",
      description:
        "Rest assured with role-based JWT authentication protecting all medical profiles, details, and request forms.",
    },
    {
      icon: <BarChart3 className="text-slate-700" size={28} />,
      title: "Admin Monitoring",
      description:
        "Features an extensive dashboard for administrators to monitor requests, check stock rates, and approve users.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <section id="features" className="py-20 bg-slate-50 border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-600">
            Platform Capabilities
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Key Features of PranaMitra
          </p>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {list.map((feat, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  {feat.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {feat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default Features;
