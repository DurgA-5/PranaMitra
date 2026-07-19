import React from "react";

const Card = React.forwardRef(({
  children,
  className = "",
  hoverable = false,
  ...props
}, ref) => {
  const cardStyle = `card ${hoverable ? "card-hover" : ""} ${className}`;

  return (
    <div
      ref={ref}
      className={cardStyle}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
