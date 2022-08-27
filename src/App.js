import "./App.css";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";

export default function App({
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
  showSidebar,
  setShowSidebar,
}) {
  const [inRealm, setInRealm] = useState(true);

  useEffect(() => {
    if (window !== undefined) {
      setInRealm(window.location.href.includes("realms"));
    }
  }, [currentProposal, window.location.href]);

  return (
    <div className="App w-full h-full flex relative bg-gray-700 overflow-hidden">
      <Sidebar
        gun={gun}
        signOut={signOut}
        network={network}
        connection={connection}
        programId={programId}
        changeNetwork={changeNetwork}
        realms={realms}
        loading={loading}
        currentProposal={currentProposal}
        setCurrentProposal={setCurrentProposal}
        setShowSidebar={setShowSidebar}
        showSidebar={showSidebar}
      />
      <div className="relative flex flex-col w-full break-words bg-gray-700">
        {!inRealm && (
          <div
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-gray-300 absolute top-8 left-8 text-2xl cursor-pointer hover:opacity-75 w-min"
          >
            {showSidebar ? null : <AiOutlineMenu />}
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}
