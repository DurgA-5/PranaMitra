import React from "react";

const Input = React.forwardRef(({
  label,
  error,
  icon: Icon,
  className = "",
  type = "text",
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="form-label">{label}</label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center justify-center shrink-0">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`form-input ${Icon ? "pl-11" : ""} ${
            error ? "border-red-500 focus:ring-red-500/20" : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[11px] font-bold text-red-500 tracking-wide">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
