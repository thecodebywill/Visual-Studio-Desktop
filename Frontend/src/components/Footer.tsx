import React from "react";

const Footer: React.FC = () => {
  return (
    <footer>
      <p>© {new Date().getFullYear()} Paynder. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
