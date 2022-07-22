import React, { useState, useEffect } from "react";
import { BsPlus, BsFillLightningFill } from "react-icons/bs";
import Search from "./Search";

const SideBar = () => {
  const [showSearch, setShowSearch] = useState(false);

  const searchRealms = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className="flex h-full w-max">
      <div className="h-full w-max flex flex-col gap-2 p-2 items-center bg-gray-900 shadow-lg text-white rounded-r-xl">
        <SideBarIcon icon={<BsPlus size="32" />} onClick={searchRealms} />
        <SideBarIcon icon={<BsFillLightningFill size="20" />} />{" "}
        <SideBarIcon icon={<BsFillLightningFill size="20" />} />
        <SideBarIcon icon={<BsFillLightningFill size="20" />} />
        <SideBarIcon icon={<BsFillLightningFill size="20" />} />
      </div>
      <div
        className={`transition-all duration-200 ease-in-out shadow-lg z-50 ${
          showSearch ? `max-w-[1000px]` : `max-w-0 overflow-hidden`
        }`}
      >
        <Search />
      </div>
    </div>
  );
};

const SideBarIcon = ({ icon, onClick }) => (
  <div className="sidebar-icon" onClick={onClick}>
    {icon}
  </div>
);

export default SideBar;
