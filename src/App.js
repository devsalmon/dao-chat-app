import React, { useEffect, useReducer, useState } from "react";
import "./App.css";
import SideBar from "./components/SideBar";
import { getAllTokenOwnerRecords } from "@solana/spl-governance";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { GiHamburgerMenu } from "react-icons/gi";
import { Outlet } from "react-router-dom";

export default function App({ gun, signOut }) {
  const NETWORK = clusterApiUrl("mainnet-beta");
  const connection = new Connection(NETWORK);
  const user = gun.user();

  const [showSidebar, setShowSidebar] = useState(false);

  // async function getRealmMembers() {
  //   const members = await getAllTokenOwnerRecords(
  //     connection,
  //     getProvider().publicKey,
  //     MAINNET_REALMS[0].realmId
  //   );
  //   console.log(members);
  // }

  const getProvider = () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    } else if ("solflare" in window) {
      const provider = window.solflare;
      if (provider.isSolflare) {
        return provider;
      }
    }
  };

  return (
    <div className="App w-[400px] h-[600px] flex relative bg-gray-700 overflow-hidden">
      <div
        className={`transition-all duration-200 ease-in-out ${
          showSidebar ? `max-w-[1000px]` : `max-w-0 overflow-hidden`
        }`}
      >
        <SideBar gun={gun} />
      </div>
      <div className="relative flex flex-col gap-4 p-4 w-full">
        <div className="relative items-center justify-between flex gap-4 w-full">
          <div
            onClick={() => setShowSidebar(!showSidebar)}
            className="cursor-pointer"
          >
            <GiHamburgerMenu />
          </div>
          <div onClick={signOut} className="cursor-pointer">
            Sign out
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
