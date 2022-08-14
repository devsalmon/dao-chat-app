import { useState } from "react";
import Input from "./Input";

export default function SearchRealms({
  realms,
  addRealm,
  verifying,
  loading,
  getRealmImage,
  show,
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
    <div
      className={`transition-all duration-300 ease-in-out shadow-lg w-max z-10 ${
        show ? `max-w-[300px] px-4 pr-2` : `max-w-0 overflow-hidden`
      }`}
    >
      <div className="pb-2">
        <Input
          placeholder="Search Realms"
          onChange={(e) => filterRealms(e.target.value)}
        />
      </div>
      <ul className="relative overflow-y-auto h-full pt-4 pb-16 flex flex-col gap-4">
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
                <div className="sidebar-icon flex flex-col items-center text-center gap-2 h-auto w-full p-2 break-all">
                  <div
                    className="h-12 w-12 flex bg-center bg-cover items-center justify-center relative rounded-full bg-gray-500 p-2"
                    style={{
                      backgroundImage: `url(${getRealmImage(realm?.ogImage)})`,
                    }}
                  >
                    {!getRealmImage(realm?.ogImage) && (
                      <div>{realm?.symbol?.substring(0, 2)}</div>
                    )}
                  </div>
                  <div className="line-clamp-1">
                    {realm?.displayName ?? realm?.symbol}
                  </div>
                </div>
              </li>
            ))}
        {verifying && (
          <div
            key="verifying"
            className="h-full w-full absolute top-0 backdrop-blur left-0 flex items-center justify-center gap-2"
          >
            <div className="bg-white rounded-full h-2 w-2 animate-pulse"></div>
            <div className="bg-white rounded-full h-2 w-2 animate-pulse delay-50"></div>
            <div className=" bg-white rounded-full h-2 w-2 animate-pulse delay-75"></div>
          </div>
        )}
      </ul>
    </div>
  );
}
