import { useState } from "react";
import Input from "./Input";

export default function SearchRealms({ realms, addRealm, loading }) {
  const [filteredRealms, setFilteredRealms] = useState([]);

  const filterRealms = (v) => {
    console.log(realms);
    if (v.length > 0) {
      const filtered = realms.filter(
        (r) =>
          r.displayName?.toLowerCase().includes(v.toLowerCase()) ||
          r.symbol?.toLowerCase().includes(v.toLowerCase())
      );
      setFilteredRealms(filtered);
    } else {
      setFilteredRealms(realms);
    }
  };

  return (
    <div className="w-max h-full p-2 z-50">
      <Input
        placeholder="Search Realms"
        onChange={(e) => filterRealms(e.target.value)}
      />
      <ul className="overflow-y-auto h-full pt-4 pb-16 flex flex-col gap-4">
        {loading
          ? Array.from(Array(10).keys()).map((item) => (
              <li key={item}>
                <div className="sidebar-icon w-full animate-pulse " />
              </li>
            ))
          : filteredRealms &&
            filteredRealms.map((realm) => (
              <li
                key={realm.realmId}
                onClick={() => addRealm(realm.realmId.toString())}
              >
                <div className="sidebar-icon w-full">
                  {realm?.displayName ?? realm?.symbol}
                </div>
              </li>
            ))}
      </ul>
    </div>
  );
}
