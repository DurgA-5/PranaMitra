import { Heart, Activity, ShieldCheck, Sparkles } from "lucide-react";

function WhyDonate() {
  const benefits = [
    {
      icon: <Heart className="text-red-500" size={26} />,
      title: "Saves Multiple Lives",
      description:
        "Every single blood donation can be separated into components (red cells, plasma, platelets) to help save up to three lives.",
    },
    {
      icon: <Activity className="text-red-500" size={26} />,
      title: "Enhances Cardiovascular Health",
      description:
        "Regular blood donation helps reduce blood viscosity, aiding in heart function and reducing risk of stroke.",
    },
    {
      icon: <ShieldCheck className="text-red-500" size={26} />,
      title: "Complimentary Health Check",
      description:
        "Each donation includes a screening of blood pressure, hemoglobin count, and pulse rates, providing a minor health screening.",
    },
    {
      icon: <Sparkles className="text-red-500" size={26} />,
      title: "Stimulates Cell Regeneration",
      description:
        "Your body replenishes the donated volume rapidly, stimulating the production of fresh, healthy blood cells.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-600">
            Donor Education
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Should You Donate Blood?
          </p>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Benefits Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-red-100 transition-all duration-300 flex items-start gap-5"
            >
              <div className="p-3 bg-red-50 rounded-xl shrink-0">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Banner */}
        <div className="mt-12 max-w-4xl mx-auto p-6 bg-red-600 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-rose-600 opacity-20 -z-10" />
          
          <div className="space-y-1">
            <h4 className="text-lg font-extrabold">Ready to make a positive impact?</h4>
            <p className="text-xs text-red-100 font-semibold max-w-lg">
              Registration takes less than 3 minutes. Your small gesture could be the key to someone's survival.
            </p>
          </div>

          <a
            href="/register"
            className="px-6 py-3 rounded-xl bg-white text-red-600 font-bold hover:bg-slate-50 transition-colors shadow-sm select-none shrink-0"
          >
            Become a Donor Today
          </a>
        </div>

      </div>
    </section>
  );
}

export default WhyDonate;
