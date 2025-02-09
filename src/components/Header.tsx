import React from "react";

interface HeaderProps {
  title: string;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onSignOut }) => {
  return (
    <header className="p-2 shadow-md sticky top-0 left-0 z-50 w-[100vw] bg-[#2C3930]">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center bg-[#3F4F44] rounded-full">
        <h1 className=" text-md md:text-2xl font-bold text-white">{title}</h1>
        <button
          onClick={onSignOut}
          className="text-md cursor-pointer bg-[#A27B5C] hover:backdrop-opacity-90 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
