import React, { useState, useEffect } from "react";
import { BsPlus, BsArrowBarLeft } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { FiMinus } from "react-icons/fi";
import { MdOutlineCancel, MdEdit, MdCheck } from "react-icons/md";
import SearchRealms from "./SearchRealms";
import Channels from "./Channels";
import { useNavigate } from "react-router-dom";
import { getRealmMembers } from "../api/Members";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMove from "array-move";

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
  setShowSidebar,
  showSidebar,
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
  }, [network]);

  useEffect(() => {
    gun
      .user()
      .get("wallet")
      .once((wallet) => {
        setUserWallet(wallet);
      });
    var regexp = /realms\/(.*)\//;
    var regexp2 = /realms\/(.*)\/?/;
    var match =
      regexp.exec(window.location.href) ?? regexp2.exec(window.location.href);
    if (match) setActiveRealm(match[1]);
  }, []);

  const onSortEnd = (oldIndex, newIndex) => {
    setSidebarRealms((array) => arrayMove(array, oldIndex, newIndex));
  };

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

  const edit = () => {
    if (editing) {
      setEditing(false);
      localStorage.setItem(
        network + "sidebarRealms",
        JSON.stringify(sidebarRealms)
      );
    } else {
      setEditing(true);
    }
  };

  return (
    <div
      className={`transition-all flex w-max duration-300 ease-in-out bg-gray-900 ${
        showSidebar
          ? `max-w-[700px] overflow-visible p-2`
          : `max-w-0 overflow-hidden`
      }`}
    >
      <div className="h-full overflow-y-scroll scrollbar-hide overflow-x-hidden w-max flex flex-col gap-2 items-center justify-start shadow-lg text-white rounded-r-xl">
        <div
          className="text-xs text-blue-500 cursor-pointer hover:opacity-75"
          onClick={changeNetwork}
        >
          {network === "devnet" ? "DEVNET" : "MAINNET"}
        </div>
        <SideBarIcon
          icon={!showSidebar ? null : <BsArrowBarLeft size="20" />}
          onClick={() => setShowSidebar(!showSidebar)}
        />
        <SideBarIcon
          icon={showSearch ? <FiMinus size="28" /> : <BsPlus size="32" />}
          onClick={searchRealms}
        />
        <SortableList
          onSortEnd={onSortEnd}
          className="h-max flex flex-col gap-2 py-4 select-none"
          allowDrag={editing}
        >
          {loading &&
            sidebarRealms &&
            sidebarRealms.map((realm, index) => (
              <div key={index} className="sidebar-icon animate-pulse" />
            ))}
          {sidebarRealms &&
            sidebarRealms.map((realmId) => {
              const realm = realms?.find(
                (r) => r.realmId?.toString() === realmId
              );
              return (
                realm && (
                  <SortableItem key={realmId.toString()}>
                    <SideBarIcon
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
                  </SortableItem>
                )
              );
            })}
        </SortableList>
        <SideBarIcon
          icon={editing ? <MdCheck size="22" /> : <MdEdit size="22" />}
          onClick={edit}
        />
        <SideBarIcon icon={<BiLogOut size="22" />} onClick={signOut} />
      </div>
      <SearchRealms
        gun={gun}
        realms={realms}
        addRealm={addRealm}
        verifying={verifying}
        loading={loading}
        getRealmImage={getRealmImage}
        show={showSearch}
      />
      <Channels
        gun={gun}
        realmId={activeRealm}
        connection={connection}
        programId={programId}
        currentProposal={currentProposal}
        setCurrentProposal={setCurrentProposal}
        setShowChannel={setShowChannel}
        show={showChannel}
      />
    </div>
  );
};

const SideBarIcon = React.forwardRef(
  ({ icon, active, onClick, removeRealm, symbol, editing }, ref) => (
    <div ref={ref} className="flex flex-col items-center gap-1 group relative">
      <div
        className={`sidebar-icon ${active && `bg-[#00FFA3] text-black`}`}
        onClick={editing ? () => null : onClick}
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
  )
);

export default Sidebar;
