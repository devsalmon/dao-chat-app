import Chat from "../components/Chat";
import { useEffect, useState, useParams } from "react";

export default function Realm({ gun }) {
  let { realmId } = useParams();
  useEffect(() => {});
  return <div>realm {realmId}</div>;
}
