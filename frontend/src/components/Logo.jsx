import React from "react";

// Energeide logo (image asset). The image already contains the "ENERGEIDE" wordmark.
const Logo = ({ className = "h-10 w-auto" }) => (
  <img
    src="/assets/energeide-logo.png"
    alt="Energeide"
    className={className}
    draggable="false"
  />
);

export default Logo;
