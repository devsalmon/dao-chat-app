import React, { useEffect, useReducer, useState } from "react";
import "./App.css";
import SideBar from "./components/SideBar";
import { getAllTokenOwnerRecords } from "@solana/spl-governance";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Outlet } from "react-router-dom";

export default function App({ gun, signOut }) {
  const NETWORK = clusterApiUrl("mainnet-beta");
  const connection = new Connection(NETWORK);
  const user = gun.user();

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
      <div className={`transition-all duration-200 ease-in-out basis-1/6`}>
        <SideBar gun={gun} />
      </div>
      <div className="relative flex flex-col gap-4 p-4 basis-5/6 w-full break-all">
        <div className="relative items-center justify-between flex gap-4 w-full">
          <div onClick={signOut} className="cursor-pointer text-white">
            Sign out
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
