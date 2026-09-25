import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

function CTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Banner Box */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-10 md:p-16 text-center space-y-6 shadow-2xl">
          {/* Decorative backdrop shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-700/10 rounded-full blur-3xl -z-10" />

          {/* Icon Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/20 text-red-500 rounded-full border border-red-500/20 text-xs font-bold mx-auto">
            <Sparkles size={12} />
            Platform Launch
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to Save a Life?
          </h2>
          
          <p className="text-sm md:text-base text-slate-350 max-w-xl mx-auto font-medium leading-relaxed">
            Register as a voluntary student donor to receive nearby hospital requests, or register as a patient to request emergency blood units instantly.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-red-600 text-white font-extrabold hover:bg-red-700 transition duration-200 shadow-lg shadow-red-600/20"
            >
              Register Now
            </Link>
            
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 font-extrabold hover:bg-slate-700 hover:text-white transition duration-200"
            >
              Login to Account
              <ArrowRight size={15} />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

export default CTA;
