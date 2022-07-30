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
}) {
  return (
    <div className="App w-[400px] h-[600px] flex relative bg-gray-700 overflow-hidden">
      <div className="w-min">
        <Sidebar
          gun={gun}
          signOut={signOut}
          network={network}
          connection={connection}
          programId={programId}
          changeNetwork={changeNetwork}
          realms={realms}
          loading={loading}
        />
      </div>
      <div className="relative flex flex-col gap-4 p-4 w-5/6 break-all">
        <Outlet />
      </div>
    </div>
  );
}
