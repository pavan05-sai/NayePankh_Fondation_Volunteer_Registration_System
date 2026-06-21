import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        &copy; {new Date().getFullYear()} Naye Pankh Foundation. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
