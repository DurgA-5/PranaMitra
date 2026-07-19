import { Quote, Star } from "lucide-react";

function Testimonials() {
  const reviews = [
    {
      name: "Aditya Verma",
      role: "Student Donor, IIT Madras",
      avatar: "AV",
      quote:
        "PranaMitra makes blood donation incredibly simple. I received a matching blood request alert from a nearby hospital, accepted it on the portal, and donated blood within the hour. It is amazing to see my small act save a life.",
    },
    {
      name: "Sneha Reddy",
      role: "Patient Family Member",
      avatar: "SR",
      quote:
        "During my father's heart surgery, we urgently needed O- blood. The PranaMitra system matched us with an active student donor immediately. We are forever grateful to the platform and the donor who answered our call.",
    },
    {
      name: "Dr. Rajesh K. Sharma",
      role: "Medical Director, City Hospital",
      avatar: "RS",
      quote:
        "As a healthcare professional, I find PranaMitra's digital tracking and secure role management outstanding. It bridges the critical resource gap between donors and emergency units efficiently during surgical emergencies.",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-600">
            Success Stories
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved by Donors, Patients, and Doctors
          </p>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group"
            >
              {/* Quote bubble absolute icon */}
              <Quote className="absolute top-6 right-6 text-red-600/10 group-hover:text-red-600/20 transition-colors" size={44} />

              <div className="space-y-4 relative z-10">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold italic">
                  "{rev.quote}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="flex items-center gap-4 mt-8 border-t border-slate-200/60 pt-6">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {rev.avatar}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900">{rev.name}</h4>
                  <p className="text-[11px] font-bold text-slate-400">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Testimonials;
