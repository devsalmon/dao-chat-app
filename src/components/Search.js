import { useState } from "react";
import mainnetBetaRealms from "../mainnet-beta.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const MAINNET_REALMS = parseCertifiedRealms(mainnetBetaRealms);

function parseCertifiedRealms(realms) {
  return realms.map((realm) => ({
    ...realm,
    programId: new PublicKey(realm.programId),
    realmId: new PublicKey(realm.realmId),
    sharedWalletId: realm.sharedWalletId && new PublicKey(realm.sharedWalletId),
    isCertified: true,
    programVersion: realm.programVersion,
    enableNotifi: realm.enableNotifi ?? true, // enable by default
  }));
}

export default function Search({}) {
  const [realms, setRealms] = useState(MAINNET_REALMS);
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
      <input
        className="rounded-full p-2 mb-2"
        placeholder="Search Realms"
        onChange={(e) => filterRealms(e.target.value)}
      />
      <ul className="overflow-y-auto h-full pb-16 flex flex-col gap-4">
        {filteredRealms &&
          filteredRealms.map((realm) => (
            <div key={realm.realmId}>{realm.displayName}</div>
          ))}
      </ul>
    </div>
  );
}
