import { motion } from "framer-motion";
import { UserPlus, UserCheck, FilePlus2, Search, CheckCircle2, Award } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <UserPlus size={24} className="text-red-600" />,
      title: "Register Account",
      description: "Sign up securely as either a student donor or a patient requiring blood services.",
    },
    {
      num: "02",
      icon: <UserCheck size={24} className="text-red-600" />,
      title: "Complete Profile",
      description: "Provide contact numbers, blood group types, and verified clinical eligibility info.",
    },
    {
      num: "03",
      icon: <FilePlus2 size={24} className="text-red-600" />,
      title: "Patient Requests Blood",
      description: "Patients can submit emergency blood requests listing required dates, units, and hospitals.",
    },
    {
      num: "04",
      icon: <Search size={24} className="text-red-600" />,
      title: "Matching Donor Found",
      description: "Our system automatically matches the requests against available donors in the same city.",
    },
    {
      num: "05",
      icon: <CheckCircle2 size={24} className="text-red-600" />,
      title: "Donor Accepts",
      description: "Matching student donors receive real-time alerts and accept donations with a single click.",
    },
    {
      num: "06",
      icon: <Award size={24} className="text-red-600" />,
      title: "Donation Completed",
      description: "The donor completes donation at the hospital or bank, and the request status is tracked in real-time.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-600">
            Workflow Process
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            How PranaMitra Works
          </p>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l border-slate-200 ml-4 md:ml-10 space-y-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative pl-10 md:pl-16 group"
            >
              {/* Timeline Connector Icon Circle */}
              <div className="absolute -left-[18px] md:-left-[26px] top-1.5 w-9 h-9 md:w-12 md:h-12 bg-white border-2 border-slate-200 group-hover:border-red-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-red-600/10">
                <span className="text-[10px] md:text-xs font-extrabold text-slate-400 group-hover:text-red-600 transition-colors">
                  {step.num}
                </span>
              </div>

              {/* Card Container */}
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-red-100 hover:shadow-lg hover:shadow-red-600/[0.02] transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                    {step.icon}
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;
