import { useState } from "react";
import { toast } from "react-toastify";
import { Mail, User, Info, MessageSquare, Send } from "lucide-react";
import contactService from "../../services/contactService";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the form errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      await contactService.submitQuery({
        fullName: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      toast.success("Your enquiry has been submitted successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit your enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-600">
            Get In Touch
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Support & Inquiries
          </p>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* 2-Column form layout */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-8 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl">
          
          {/* Left panel: Info */}
          <div className="md:col-span-5 bg-slate-900 text-white p-8 md:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -z-10" />

            <div className="space-y-6">
              <h3 className="text-xl font-bold">Contact Information</h3>
              <p className="text-xs md:text-sm text-slate-400 font-semibold leading-relaxed">
                Have questions about registering, donating blood, or integrating your local blood bank? Reach out and we will help.
              </p>

              <div className="space-y-4 pt-4 text-xs md:text-sm font-semibold text-slate-350">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-red-500" />
                  <span>support@pranamitra.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Info size={16} className="text-red-500" />
                  <span>Available 24/7 for emergency requests</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800/30">
              <p className="text-[10px] font-extrabold text-red-500 uppercase tracking-widest mb-1">
                Emergency Tip
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                Do not wait for contact replies in critical scenarios! Log in and post a matching request directly.
              </p>
            </div>
          </div>

          {/* Right panel: Inputs form */}
          <form onSubmit={handleSubmit} className="md:col-span-7 p-8 md:p-10 space-y-5">
            
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User size={13} className="text-slate-400" />
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
                }`}
              />
              {errors.name && <p className="text-[11px] font-bold text-red-500">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" />
                Email Address
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
                }`}
              />
              {errors.email && <p className="text-[11px] font-bold text-red-500">{errors.email}</p>}
            </div>

            {/* Subject Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Info size={13} className="text-slate-400" />
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.subject
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
                }`}
              />
              {errors.subject && <p className="text-[11px] font-bold text-red-500">{errors.subject}</p>}
            </div>

            {/* Message Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={13} className="text-slate-400" />
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Provide complete details..."
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.message
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
                }`}
              />
              {errors.message && <p className="text-[11px] font-bold text-red-500">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 text-white font-extrabold hover:bg-red-700 transition duration-200 shadow-md shadow-red-600/10 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={15} />
                  Send Message
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </section>
  );
}

export default Contact;
