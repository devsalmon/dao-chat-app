import { useState } from "react";
import Input from "./Input";

export default function SearchRealms({ gun, realms, addRealm }) {
  const [filteredRealms, setFilteredRealms] = useState([]);

  const filterRealms = (v) => {
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
    <div className="w-max h-full p-2">
      <Input
        placeholder="Search Realms"
        onChange={(e) => filterRealms(e.target.value)}
      />
      <ul className="overflow-y-auto h-full pt-4 pb-16 flex flex-col gap-4">
        {filteredRealms &&
          filteredRealms.map((realm) => (
            <div
              key={realm.realmId}
              onClick={() => addRealm(realm.realmId.toString())}
            >
              {realm.displayName}
            </div>
          ))}
      </ul>
    </div>
  );
}
