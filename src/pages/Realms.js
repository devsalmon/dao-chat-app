import Chat from "../components/Chat";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Realms({ gun, ...props }) {
  useEffect(() => {
    console.log(props);
  });
  return (
    <div className="h-full w-full">
      realms
      <Outlet />
    </div>
  );
}
