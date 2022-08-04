import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProposalInfo from "../components/proposal/ProposalInfo";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import Chat from "../components/Chat";
import { getProposals } from "../governance-functions/Proposals";
import { programId } from "../constants";

const Loading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center gap-2">
      <div className="bg-white rounded-full h-2 w-2 animate-pulse"></div>
      <div className="bg-white rounded-full h-2 w-2 animate-pulse delay-50"></div>
      <div className=" bg-white rounded-full h-2 w-2 animate-pulse delay-75"></div>
    </div>
  );
};

export default function Realm({ gun, network, realms }) {
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
  const [loadingProposal, setLoadingProposal] = useState(true);
  const [title, setTitle] = useState(realm?.displayName ?? realm?.symbol);
  const [currentProposal, setCurrentProposal] = useState({});

  useEffect(() => {
    gun
      .user()
      .get("wallet")
      .once((wallet) => {
        setUserWallet(wallet);
      });
  });

  useEffect(() => {
    if (channelId) setCollectionId(`chats-${channelId}`);
    else setCollectionId(`chats-${realmId}`);
    const currentRealm = realms.find((r) => r.realmId?.toString() === realmId);
    setRealm(currentRealm);
    getMembers();
    fetchProposals(currentRealm);
  }, [realmId, channelId, network, realms]);

  async function fetchProposals(currentRealm) {
    setLoadingProposal(true);
    let proposals = await getProposals(
      new Connection(clusterApiUrl(network), "recent"),
      programId,
      new PublicKey(realmId)
    );
    let found = false;
    proposals.forEach((x) => {
      if (x?.length > 0) {
        x.forEach((proposal) => {
          if (proposal.pubkey.toString() === channelId) {
            found = true;
            setCurrentProposal(proposal);
            setTitle(proposal.account.name);
          }
        });
      }
    });
    if (!found) setTitle(currentRealm.displayName ?? currentRealm.symbol);
    setLoadingProposal(false);
  }

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
    <div className="w-full h-full relative">
      <div className="absolute z-50 w-full top-0 pb-4 bg-gray-700 flex flex-col gap-2 items-center">
        <h1 className="text-center text-white text-xl">
          {loadingProposal ? <Loading /> : title}
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
        {activeTab === 0 && (
          <Chat
            gun={gun}
            collectionId={collectionId}
            realmId={realmId}
            connection={new Connection(clusterApiUrl(network), "recent")}
            realmName={realm?.displayName ?? realm?.symbol}
          />
        )}
        {activeTab === 1 && (
          <div id="voting" className="">
            <ProposalInfo proposal={currentProposal} />
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="w-full h-full"></div>
  );
}
