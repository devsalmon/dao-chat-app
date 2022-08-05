import "./App.css";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

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
  return (
    <div className="App w-full h-full flex relative bg-gray-700 overflow-hidden">
      <div className="w-fit">
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
        <Outlet />
      </div>
    </div>
  );
}
