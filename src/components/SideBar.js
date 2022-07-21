import React from "react";
import { BsPlus, BsFillLightningFill } from "react-icons/bs";

const SideBar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-900 text-white shadow-lg">
      <SideBarIcon icon={<BsPlus size="32" />} />
      <SideBarIcon icon={<BsFillLightningFill size="20" />} />{" "}
      <SideBarIcon icon={<BsFillLightningFill size="20" />} />
      <SideBarIcon icon={<BsFillLightningFill size="20" />} />
      <SideBarIcon icon={<BsFillLightningFill size="20" />} />
    </div>
  );
};

const SideBarIcon = ({ icon }) => <div className="sidebar-icon">{icon}</div>;

export default SideBar;
