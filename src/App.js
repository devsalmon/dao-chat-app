import "./App.css";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

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
}) {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="App w-full h-full flex relative bg-gray-700 overflow-hidden">
      <div
        className={`transition-all duration-200 ease-in ${
          showSidebar
            ? `w-fit max-w-[500px] overflow-visible`
            : `max-w-0 opacity-0`
        }`}
      >
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
        />
      </div>
      <div className="relative flex flex-col gap-4 p-4 w-full break-words">
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-gray-300 text-2xl cursor-pointer hover:opacity-75 w-min"
        >
          {showSidebar ? <AiOutlineClose /> : <AiOutlineMenu />}
        </div>
        <Outlet />
      </div>
    </div>
  );
}
