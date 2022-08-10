import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProposalInfo from "../components/proposal/ProposalInfo";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import Chat from "../components/chats/Chat";
import Loading from "../components/Loading";

export default function Realm({ gun, network, realms, currentProposal }) {
  let { realmId, channelId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [collectionId, setCollectionId] = useState();
  const [realm, setRealm] = useState(
    realms.find((r) => r.realmId?.toString() === realmId)
  );
  const [hasAccess, setHasAccess] = useState(true);
  const [members, setMembers] = useState();
  const [userWallet, setUserWallet] = useState("");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(realm?.displayName ?? realm?.symbol);

  useEffect(() => {
    gun
      .user()
      .get("wallet")
      .once((wallet) => {
        setUserWallet(wallet);
      });
  });

  useEffect(() => {
    if (channelId) setCollectionId(`${channelId}-chats`);
    else setCollectionId(`${realmId}-chats`);
    const currentRealm = realms.find((r) => r.realmId?.toString() === realmId);
    setRealm(currentRealm);
    getMembers();
    if (currentRealm) setTitle(currentRealm.displayName ?? currentRealm.symbol);
    if (currentProposal)
      setTitle(currentProposal?.account?.name ?? currentProposal);
  }, [realmId, channelId, network, realms]);

  // useEffect(() => {
  //   if (members) setHasAccess(userWallet && members.includes(userWallet));
  // }, [members, userWallet]);

  async function getMembers() {
    // let realmMembers = await getRealmMembers(
    //   new Connection(clusterApiUrl(network), "recent"),
    //   new PublicKey("GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw"),
    //   new PublicKey(realmId)
    // );
    // setMembers(realmMembers);
    // user only has access if their wallet is in the members list
    // setHasAccess(userWallet && realmMembers.includes(userWallet));
    setLoading(false);
  }

  const styles = {
    tabActive:
      "bg-gray-600 px-8 py-2 cursor-pointer rounded-lg shadow-sm shadow-black",
    tabInactive:
      "bg-gray-900 px-8 py-2 cursor-pointer rounded-lg shadow-inner shadow-black",
  };

  return loading ? (
    <Loading />
  ) : hasAccess ? (
    <div className="w-full h-full relative flex flex-col">
      <div className="sticky top-0 z-30 w-full h-1/6 p-4 pt-0 bg-gray-700 flex flex-col justify-center gap-2 items-center">
        <h1 className="text-center text-white text-xl line-clamp-2">
          {!title ? <Loading /> : title}
        </h1>
        <div className="flex flex-nowrap mx-auto w-max rounded-lg bg-black items-center justify-center text-gray-400">
          <div
            onClick={() => setActiveTab(0)}
            className={activeTab === 0 ? styles.tabActive : styles.tabInactive}
          >
            Chat
          </div>
          {currentProposal && currentProposal !== "" && (
            <div
              onClick={() => setActiveTab(1)}
              className={
                activeTab === 1 ? styles.tabActive : styles.tabInactive
              }
            >
              Voting
            </div>
          )}
        </div>
      </div>
      <div className={`relative w-full h-5/6`}>
        {activeTab === 0 && (
          <Chat
            gun={gun}
            collectionId={collectionId}
            realmId={realmId}
            connection={new Connection(clusterApiUrl(network), "recent")}
            realmName={realm?.displayName ?? realm?.symbol}
          />
        )}
        {activeTab === 1 && currentProposal && (
          <div id="voting" className="">
            <ProposalInfo
              realm={realm}
              currentProposal={currentProposal}
              network={network}
              connection={new Connection(clusterApiUrl(network), "recent")}
            />
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="w-full h-full"></div>
  );
}
