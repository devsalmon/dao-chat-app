import "./App.css";
import SideBar from "./components/SideBar";
import { Outlet } from "react-router-dom";

export default function App({ gun, signOut }) {
  return (
    <div className="App w-[400px] h-[600px] flex relative bg-gray-700 overflow-hidden">
      <div className="w-min">
        <SideBar gun={gun} signOut={signOut} />
      </div>
      <div className="relative flex flex-col gap-4 p-4 w-5/6 break-all">
        <Outlet />
      </div>
    </div>
  );
}
