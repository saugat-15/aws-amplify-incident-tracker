import React, { useState } from "react";
import CottageIcon from "@mui/icons-material/Cottage";
import CollectionsIcon from "@mui/icons-material/Collections";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

interface HeaderProps {
  title: string;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const NavButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    text: string;
  }> = ({ onClick, icon, text }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm md:text-md cursor-pointer w-full bg-[#A27B5C] hover:bg-[#8B6B4F] text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
      aria-label={text}
    >
      {icon}
      <span>{text}</span>
    </button>
  );

  return (
    <header className="p-2 shadow-md sticky top-0 left-0 z-50 bg-[#2C3930] w-screen">
      <div className="container mx-auto px-4 md:px-6 py-3 flex gap-4 items-center justify-center md:justify-between bg-[#3F4F44] rounded-full relative">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2 hover:bg-[#A27B5C] rounded-full transition-colors mr-4"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <NavButton
            onClick={() => handleNavigation("/dashboard")}
            icon={<CottageIcon />}
            text="Home"
          />
          <NavButton
            onClick={() => handleNavigation("/gallery")}
            icon={<CollectionsIcon />}
            text="Gallery"
          />
        </div>
        <h1 className="text-lg md:text-2xl font-bold text-white">{title}</h1>
        <button
          onClick={onSignOut}
          className="hidden md:block text-sm md:text-md cursor-pointer bg-[#A27B5C] hover:bg-[#8B6B4F] text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          <ExitToAppIcon sx={{ marginRight: "6px" }} />
          Sign Out
        </button>
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#3F4F44] rounded-lg shadow-lg md:hidden p-4 space-y-3">
            <NavButton
              onClick={() => handleNavigation("/dashboard")}
              icon={<CottageIcon />}
              text="Home"
            />
            <NavButton
              onClick={() => handleNavigation("/gallery")}
              icon={<CollectionsIcon />}
              text="Gallery"
            />
            <button
              onClick={onSignOut}
              className="w-full text-sm md:hidden text-left cursor-pointer bg-[#A27B5C] hover:bg-[#8B6B4F] text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              <ExitToAppIcon />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
