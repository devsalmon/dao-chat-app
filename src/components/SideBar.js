import React, { useState, useEffect } from "react";
import { BsPlus, BsFillLightningFill } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import { MdOutlineCancel, MdEdit, MdCheck } from "react-icons/md";
import SearchRealms from "./SearchRealms";
import Channels from "./Channels";
import { useNavigate } from "react-router-dom";
import { getRealmMembers } from "../realms/Realms.js";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import { ProposalState } from "@solana/spl-governance";

const Sidebar = ({
  gun,
  signOut,
  network,
  connection,
  programId,
  changeNetwork,
  realms,
  loading,
  currentProposal,
  setCurrentProposal,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showChannel, setShowChannel] = useState(false);
  const [sidebarRealms, setSidebarRealms] = useState([]);
  const [userWallet, setUserWallet] = useState("");
  const [activeRealm, setActiveRealm] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedRealms = localStorage.getItem(network + "sidebarRealms");
    if (savedRealms && savedRealms.length > 0)
      setSidebarRealms(JSON.parse(savedRealms));
    console.log(savedRealms);
  }, [network]);

  useEffect(() => {
    gun
      .user()
      .get("wallet")
      .once((wallet) => {
        setUserWallet(wallet);
      });
    var myRegexp = /realms\/(.*)\/?/;
    var match = myRegexp.exec(window.location.href);
    if (match) setActiveRealm(match[1]);
  }, []);

  const searchRealms = () => {
    setShowSearch(!showSearch);
  };

  // add a realm to the sidebar by updating the appropriate local storage variable
  const addRealm = async (id) => {
    setVerifying(true);
    let members = await getRealmMembers(
      connection,
      programId,
      new PublicKey(id)
    );
    setVerifying(false);
    if (!userWallet || !members.includes(userWallet)) {
      toast.error("You do not have access to this DAO");
      return;
    }
    const savedRealms = localStorage.getItem(network + "sidebarRealms");
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

  // remove realm from the sidebar
  const removeRealm = (id) => {
    if (!window.confirm("Remove this realm from your sidebar?")) return;
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
    setShowSearch(false);
    if (!window.location.href.includes(id)) setCurrentProposal("");
    if (window.location.href.includes(id)) setShowChannel(!showChannel);
    else navigate(`/realms/${id}`);
    setActiveRealm(id);
  };

  const getRealmImage = (url) => {
    if (!url) return;
    if (url?.includes("http")) return url;
    const image = url.split("/");
    return "/" + image[image.length - 1];
  };

  return (
    <div className="flex h-full w-full">
      <div className="h-full overflow-y-scroll scrollbar-hide overflow-x-hidden w-min flex flex-col gap-2 p-2 px-4 items-center justify-start bg-gray-900 shadow-lg text-white rounded-r-xl">
        <div
          className="text-xs text-blue-500 cursor-pointer hover:opacity-75"
          onClick={changeNetwork}
        >
          {network == "devnet" ? "DEVNET" : "MAINNET"}
        </div>
        <div className="basis-1/12">
          <SideBarIcon
            icon={showSearch ? <FiMinus size="28" /> : <BsPlus size="32" />}
            onClick={searchRealms}
          />
        </div>
        <ul className="h-max flex flex-col gap-2 pb-6">
          {loading &&
            sidebarRealms &&
            sidebarRealms.map((realm) => (
              <div className="sidebar-icon animate-pulse" />
            ))}
          {sidebarRealms &&
            sidebarRealms.map((realmId) => {
              const realm = realms?.find(
                (r) => r.realmId?.toString() === realmId
              );
              return (
                realm && (
                  <SideBarIcon
                    key={realmId.toString()}
                    active={activeRealm === realmId.toString()}
                    onClick={() => goToRealm(realmId?.toString())}
                    removeRealm={() => removeRealm(realmId?.toString())}
                    icon={
                      realm?.ogImage && (
                        <img
                          className="p-2"
                          src={getRealmImage(realm?.ogImage)}
                          alt=""
                        />
                      )
                    }
                    symbol={realm?.symbol.substring(0, 2)}
                    editing={editing}
                  />
                )
              );
            })}
          <SideBarIcon
            icon={editing ? <MdCheck size="20" /> : <MdEdit size="20" />}
            onClick={() => setEditing(!editing)}
          />
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
          verifying={verifying}
          loading={loading}
          getRealmImage={getRealmImage}
        />
      </div>
      <div
        className={`transition-all duration-200 ease-in-out shadow-lg z-50 ${
          showChannel ? `max-w-[300px]` : `max-w-0 overflow-hidden`
        }`}
      >
        <Channels
          gun={gun}
          realmId={activeRealm}
          connection={connection}
          programId={programId}
          currentProposal={currentProposal}
          setCurrentProposal={setCurrentProposal}
          setShowChannel={setShowChannel}
        />
      </div>
    </div>
  );
};

const SideBarIcon = ({
  icon,
  active,
  onClick,
  removeRealm,
  symbol,
  editing,
}) => (
  <div className="flex flex-col items-center gap-1 group relative">
    <div
      className={`sidebar-icon ${active && `bg-green-600 text-white`}`}
      onClick={onClick}
    >
      {icon ?? symbol}
    </div>
    {editing && removeRealm && (
      <div
        className="text-red-500 absolute -top-2 -right-2 cursor-pointer hover:opacity-75"
        onClick={removeRealm}
      >
        <MdOutlineCancel size={20} />
      </div>
    )}
  </div>
);

export default Sidebar;
