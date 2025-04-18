import React from "react";

function Footer() {
  return (
    <footer className="bg-[#2c2c2c] text-center text-white px-4 py-6 text-sm border-t border-white/20">
      <p className="font-bold uppercase mb-2 text-xs sm:text-sm">
        This is not the final version of the dictionary - it's a drawing!
      </p>
      <p className="mb-1 text-xs sm:text-sm">
        It makes a lot of mistakes and contains only part of the planned
        functionality.
      </p>
      <p className="text-xs sm:text-sm">
        We are already testing the new version, sorry for the delay.
      </p>
    </footer>
  );
}

export default Footer;
