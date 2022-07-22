import Chat from "../components/Chat";
import { useEffect, useState } from "react";
import { useParams, Outlet } from "react-router-dom";

export default function Realm({ gun }) {
  let { realmId } = useParams();

  const [activeTab, setActiveTab] = useState(0);

  const styles = {
    tabActive:
      "bg-gray-600 px-8 py-2 cursor-pointer rounded-lg shadow-sm shadow-black",
    tabInactive:
      "bg-gray-900 px-8 py-2 cursor-pointer rounded-lg shadow-inner shadow-xl shadow-black",
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <h1 className="text-center text-white text-2xl">{realmId}</h1>
      <div className="flex flex-nowrap mx-auto w-max rounded-lg bg-black items-center justify-center text-gray-400">
        <div
          onClick={() => setActiveTab(0)}
          className={activeTab === 0 ? styles.tabActive : styles.tabInactive}
        >
          Chats
        </div>
        <div
          onClick={() => setActiveTab(1)}
          className={activeTab === 1 ? styles.tabActive : styles.tabInactive}
        >
          Voting
        </div>
      </div>
    </div>
  );
}
