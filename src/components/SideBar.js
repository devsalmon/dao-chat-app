import React, { useState, useEffect } from "react";
import { BsPlus, BsFillLightningFill } from "react-icons/bs";
import Search from "./SearchRealms";
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
    const fetchedRealms = [];
    gun
      .get(gun.user()?.is?.alias)
      .map()
      .once(function (realm) {
        if (fetchedRealms.indexOf(realm) === -1) fetchedRealms.push(realm);
      });
    setRealms(fetchedRealms);
  }, []);

  const searchRealms = () => {
    setShowSearch(!showSearch);
  };

  const updateRealms = (realms) => {
    setRealms(realms);
  };

  const goToRealm = (id) => {
    navigate(id);
  };

  return (
    <div className="flex h-full w-max">
      <div className="h-full overflow-y-scroll scrollbar-hide overflow-x-hidden w-max flex flex-col gap-2 p-2 items-center bg-gray-900 shadow-lg text-white rounded-r-xl">
        <div className="basis-1/12">
          <SideBarIcon icon={<BsPlus size="32" />} onClick={searchRealms} />
        </div>
        <ul className="h-max flex flex-col gap-2">
          {realms &&
            realms.map((realmId) => (
              <SideBarIcon
                key={realmId}
                onClick={() => goToRealm(realmId)}
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
        <Search gun={gun} realms={MAINNET_REALMS} updateRealms={updateRealms} />
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
