import React from "react";

const Button = React.forwardRef(({
  children,
  className = "",
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  ...props
}, ref) => {
  const baseStyle = "btn";
  const variantStyles = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    success: "btn-success",
    outline: "btn-outline",
  };

  const styleClass = `${baseStyle} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={styleClass}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
