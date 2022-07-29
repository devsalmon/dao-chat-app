import React, { useState, useEffect } from "react";
import { BsPlus, BsFillLightningFill } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import SearchRealms from "./SearchRealms";
import { useNavigate } from "react-router-dom";
import { fetchCouncilMembersWithTokensOutsideRealm } from "../governance-functions/Members";
import { getActiveProposals } from "../governance-functions/Proposals";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

const Sidebar = ({ gun, signOut, network, changeNetwork, realms, loading }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarRealms, setSidebarRealms] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const savedRealms = localStorage.getItem(network + "sidebarRealms");
    setSidebarRealms(
      savedRealms && savedRealms.length > 0 ? JSON.parse(savedRealms) : []
    );
  }, []);

  const searchRealms = () => {
    setShowSearch(!showSearch);
  };

  const addRealm = (id) => {
    const savedRealms = localStorage.getItem(network + "sidebarRealms");
    // console.log(
    //   "fetch:",
    //   fetchCouncilMembersWithTokensOutsideRealm(id, network)
    // );
    // getActiveProposals(
    //   new Connection(clusterApiUrl("devnet"), "recent"),
    //   new PublicKey("GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw"),
    //   id
    // );
    let newSavedRealms = [];
    if (savedRealms) {
      newSavedRealms = JSON.parse(savedRealms).filter((r) => r !== id);
      console.log(newSavedRealms);
      newSavedRealms.push(id);
    } else {
      newSavedRealms = [id];
    }
    localStorage.setItem(
      network + "sidebarRealms",
      JSON.stringify(newSavedRealms)
    );
    setSidebarRealms(newSavedRealms);
  };

  const removeRealm = (id) => {
    const savedRealms = localStorage.getItem(network + "sidebarRealms");
    if (!savedRealms) return;
    const newSavedRealms = JSON.parse(savedRealms).filter((r) => r !== id);
    localStorage.setItem(
      network + "sidebarRealms",
      JSON.stringify(newSavedRealms)
    );
    setSidebarRealms(newSavedRealms);
  };

  const goToRealm = (id) => {
    navigate(`/realms/${id}`);
  };

  return (
    <div className="flex h-full w-full">
      <div className="h-full overflow-y-scroll scrollbar-hide overflow-x-hidden w-full flex flex-col gap-2 p-2 items-center justify-start bg-gray-900 shadow-lg text-white rounded-r-xl">
        <div
          className="text-xs text-blue-500 cursor-pointer hover:opacity-75"
          onClick={changeNetwork}
        >
          {network == "devnet" ? "DEVNET" : "MAINNET"}
        </div>
        <div className="basis-1/12">
          <SideBarIcon icon={<BsPlus size="32" />} onClick={searchRealms} />
        </div>
        <ul className="h-max flex flex-col gap-2 pb-6">
          {sidebarRealms &&
            sidebarRealms.map(
              (realmId) =>
                realms?.find((r) => r.realmId?.toString() === realmId) && (
                  <SideBarIcon
                    key={realmId.toString()}
                    onClick={() => goToRealm(realmId?.toString())}
                    removeRealm={() => removeRealm(realmId?.toString())}
                    icon={realms
                      ?.find((r) => r.realmId?.toString() == realmId)
                      ?.symbol.substring(0, 2)}
                  />
                )
            )}
        </ul>
        <div className="absolute bottom-0 mx-auto backdrop-blur py-2">
          <div
            onClick={signOut}
            className="cursor-pointer text-white text-xs hover:opacity-75"
          >
            Sign out
          </div>
        </div>
      </div>
      <div
        className={`transition-all duration-200 ease-in-out shadow-lg z-50 ${
          showSearch ? `max-w-[300px]` : `max-w-0 overflow-hidden`
        }`}
      >
        <SearchRealms
          gun={gun}
          realms={realms}
          addRealm={addRealm}
          loading={loading}
        />
      </div>
    </div>
  );
};

const SideBarIcon = ({ icon, onClick, removeRealm }) => (
  <div className="flex flex-col items-center gap-1 group">
    <div className="sidebar-icon" onClick={onClick}>
      {icon}
    </div>
    {removeRealm && (
      <div
        className="text-red-500 group-hover:block hidden cursor-pointer hover:opacity-75"
        onClick={removeRealm}
      >
        <MdOutlineCancel size={20} />
      </div>
    )}
  </div>
);

export default Sidebar;
