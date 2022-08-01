import { useState } from "react";
import Input from "./Input";

export default function SearchRealms({
  realms,
  addRealm,
  loading,
  getRealmImage,
}) {
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
                key={realm.realmId?.toString()}
                onClick={() => addRealm(realm.realmId?.toString())}
              >
                <div className="sidebar-icon flex-col gap-2 h-auto w-full p-2">
                  <div className="h-12 w-12 flex items-center justify-center relative rounded-full bg-gray-500 p-2">
                    {getRealmImage(realm?.ogImage) ? (
                      <img
                        className="h-full w-full"
                        src={getRealmImage(realm?.ogImage)}
                        alt=""
                      />
                    ) : (
                      <div>{realm?.symbol?.substring(0, 2)}</div>
                    )}
                  </div>
                  {realm?.displayName ?? realm?.symbol}
                </div>
              </li>
            ))}
      </ul>
    </div>
  );
}
