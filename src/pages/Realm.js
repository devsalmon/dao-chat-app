//import Chat from "../components/Chat";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "gun/lib/unset.js";
import mainnetBetaRealms from "../realms/mainnet-beta.json";
import { PublicKey } from "@solana/web3.js";
import Chat from "../components/Chat";

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

export default function Realm({ gun }) {
  let { realmId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [collectionId, setCollectionId] = useState(`chats-${realmId}`);
  const [realm, setRealm] = useState(
    MAINNET_REALMS.find((r) => r.realmId.toString() == realmId)
  );

  useEffect(() => {
    setCollectionId(`chats-${realmId}`);
    setRealm(MAINNET_REALMS.find((r) => r.realmId.toString() == realmId));
  }, [realmId]);

  const styles = {
    tabActive:
      "bg-gray-600 px-8 py-2 cursor-pointer rounded-lg shadow-sm shadow-black",
    tabInactive:
      "bg-gray-900 px-8 py-2 cursor-pointer rounded-lg shadow-inner shadow-black",
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute z-50 w-full top-0 pb-4 bg-gray-700 flex flex-col gap-2 items-center">
        <h1 className="text-center text-white text-xl">
          {realm.displayName ?? realm.symbol}
        </h1>
        <div className="flex flex-nowrap mx-auto w-max rounded-lg bg-black items-center justify-center text-gray-400">
          <div
            onClick={() => setActiveTab(0)}
            className={activeTab === 0 ? styles.tabActive : styles.tabInactive}
          >
            Chat
          </div>
          <div
            onClick={() => setActiveTab(1)}
            className={activeTab === 1 ? styles.tabActive : styles.tabInactive}
          >
            Voting
          </div>
        </div>
      </div>
      <div className="relative w-full h-full pt-24">
        {activeTab === 0 && <Chat gun={gun} collectionId={collectionId} />}
        {activeTab === 1 && <div id="voting" className=""></div>}
      </div>
    </div>
  );
}
