/**
 * Reusable PranaMitra Brand Header Component
 * Enforces uniform logo, font size, typography, alignment, color palette & hover effects across all pages.
 */
export default function PranaMitraBrand({ 
  size = "md", // "sm" | "md" | "lg" | "xl"
  showSubtitle = true,
  subtitleText = "Blood Management System",
  darkBg = false,
  className = ""
}) {

  // Logo size mapping according to responsive requirements:
  // Desktop: 48px (w-12 h-12)
  // Laptop: 44px (w-[44px] h-[44px])
  // Tablet: 40px (w-10 h-10)
  // Mobile: 36px (w-9 h-9)
  const sizeClasses = {
    sm: "w-8 h-8",
    responsive: "w-9 h-9 sm:w-10 sm:h-10 md:w-[44px] md:h-[44px] lg:w-12 lg:h-12",
    md: "w-10 h-10 md:w-[44px] md:h-[44px] lg:w-12 lg:h-12",
    lg: "w-12 h-12 md:w-14 md:h-14",
    xl: "w-16 h-16 md:w-20 md:h-20"
  };

  const logoSize = sizeClasses[size] || sizeClasses.responsive;

  return (
    <div className={`group flex items-center gap-3 cursor-pointer select-none m-0 p-0 ${className}`}>
      {/* Official Circular Logo */}
      <img
        src="/logos/pranamitra-logo-modified.png"
        alt="PranaMitra Logo"
        className={`${logoSize} rounded-full aspect-square object-contain shrink-0 transform transition-transform duration-250 group-hover:scale-[1.03] shadow-sm`}
      />


      {/* Brand Text Block */}
      <div className="flex flex-col justify-center m-0 p-0 leading-none">
        <div className="flex items-center m-0 p-0 leading-none">
          <span 
            className="font-['Poppins',sans-serif] font-bold text-lg sm:text-xl md:text-2xl tracking-[0.3px] transition-colors duration-250"
            style={{ color: "#B71C1C" }}
          >
            Prana
          </span>
          <span 
            className={`font-['Poppins',sans-serif] font-bold text-lg sm:text-xl md:text-2xl tracking-[0.3px] transition-colors duration-250 ${
              darkBg ? "text-white" : "text-[#0F2537]"
            }`}
          >
            Mitra
          </span>
        </div>

        {showSubtitle && (
          <p 
            className={`font-['Poppins',sans-serif] font-medium text-[10px] sm:text-xs tracking-[0.3px] mt-1 ${
              darkBg ? "text-slate-300" : "text-[#64748B]"
            }`}
          >
            {subtitleText}
          </p>
        )}
      </div>
    </div>
  );
}
