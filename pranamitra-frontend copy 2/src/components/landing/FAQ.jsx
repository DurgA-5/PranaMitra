import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function FAQ() {
  const faqs = [
    {
      q: "Who can donate blood?",
      a: "Generally, healthy individuals who are between 18 and 65 years old, weigh at least 50 kg, and have no active clinical infections can donate blood. Our donor onboarding flow includes an eligibility checklist covering standard criteria.",
    },
    {
      q: "How often can I donate?",
      a: "Whole blood can be donated every 56 days (approx. 8 weeks). Platelet donors can donate more frequently, typically up to 24 times a year, with at least 7 days between donations.",
    },
    {
      q: "How do I request blood?",
      a: "Create a patient account on PranaMitra, go to the blood request panel, and fill out the request form listing required units, emergency levels, and hospitals. Our portal will alert all nearby matching donors immediately.",
    },
    {
      q: "Is registration free?",
      a: "Yes, PranaMitra is a 100% voluntary platform. There are no fees or hidden charges for registering as a donor, patient, or searching nearby blood banks.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50 border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-600">
            Common Questions
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </p>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Accordions List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-900 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                >
                  <span className="text-sm md:text-base">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-red-600 shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400 shrink-0" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-slate-500 font-semibold leading-relaxed border-t border-slate-50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default FAQ;
