import React, { useState, useEffect } from "react";
import { BsPlus, BsFillLightningFill } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import SearchRealms from "./SearchRealms";
import mainnetBetaRealms from "../realms/mainnet-beta.json";
import { PublicKey } from "@solana/web3.js";
import { useNavigate } from "react-router-dom";

const MAINNET_REALMS = parseCertifiedRealms(mainnetBetaRealms);

function parseCertifiedRealms(realms) {
  return realms.map((realm) => ({
    ...realm,
    programId: new PublicKey(realm.programId),
    realmId: new PublicKey(realm.realmId),
    sharedWalletId: realm.sharedWalletId && new PublicKey(realm.sharedWalletId),
    isCertified: true,
    programVersion: realm.programVersion,
    enableNotifi: realm.enableNotifi ?? true, // enable by default
  }));
}

const SideBar = ({ gun }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [realms, setRealms] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const savedRealms = localStorage.getItem("realms");
    setRealms(
      savedRealms && savedRealms.length > 0 ? JSON.parse(savedRealms) : []
    );
  }, []);

  const searchRealms = () => {
    setShowSearch(!showSearch);
  };

  const addRealm = (id) => {
    const savedRealms = localStorage.getItem("realms");
    let newSavedRealms = [];
    if (savedRealms) {
      newSavedRealms = JSON.parse(savedRealms).filter((r) => r !== id);
      console.log(newSavedRealms);
      newSavedRealms.push(id);
    } else {
      newSavedRealms = [id];
    }
    localStorage.setItem("realms", JSON.stringify(newSavedRealms));
    setRealms(newSavedRealms);
  };

  const removeRealm = (id) => {
    const savedRealms = localStorage.getItem("realms");
    if (!savedRealms) return;
    const newSavedRealms = JSON.parse(savedRealms).filter((r) => r !== id);
    localStorage.setItem("realms", JSON.stringify(newSavedRealms));
    setRealms(newSavedRealms);
  };

  const goToRealm = (id) => {
    navigate(`/realms/${id}`);
  };

  return (
    <div className="flex h-full w-full">
      <div className="h-full overflow-y-scroll scrollbar-hide overflow-x-hidden w-full flex flex-col gap-2 p-2 items-center justify-start bg-gray-900 shadow-lg text-white rounded-r-xl">
        <div className="basis-1/12">
          <SideBarIcon icon={<BsPlus size="32" />} onClick={searchRealms} />
        </div>
        <ul className="h-max flex flex-col gap-2">
          {realms &&
            realms.map((realmId) => (
              <SideBarIcon
                key={realmId}
                onClick={() => goToRealm(realmId)}
                removeRealm={() => removeRealm(realmId)}
                icon={MAINNET_REALMS.find(
                  (r) => r.realmId == realmId
                )?.symbol.substring(0, 2)}
              />
            ))}
        </ul>
      </div>
      <div
        className={`transition-all duration-200 ease-in-out shadow-lg z-50 ${
          showSearch ? `max-w-[1000px]` : `max-w-0 overflow-hidden`
        }`}
      >
        <SearchRealms gun={gun} realms={MAINNET_REALMS} addRealm={addRealm} />
      </div>
    </div>
  );
};

const SideBarIcon = ({ icon, onClick, removeRealm }) => (
  <div className="flex items-center gap-1 group">
    <div className="sidebar-icon" onClick={onClick}>
      {icon}
    </div>
    {removeRealm && (
      <div
        className="text-red-500 group-hover:block hidden cursor-pointer"
        onClick={removeRealm}
      >
        <MdOutlineCancel size={20} />
      </div>
    )}
  </div>
);

export default SideBar;
