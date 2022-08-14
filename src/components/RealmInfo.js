import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRealmMembers } from "../api/Members";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import Loading from "./Loading";
import { commands } from "../api/ChatCommands";
import { AiOutlineMenu, AiOutlineLink } from "react-icons/ai";

const InfoLabel = ({ label, info }) => {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="font-bold text-gray-700">{label}</div>
      <div className="text-lg">{info}</div>
    </div>
  );
};

export default function RealmInfo({
  gun,
  network,
  realms,
  showSidebar,
  setShowSidebar,
}) {
  const { realmId } = useParams();
  const [realm, setRealm] = useState(
    realms.find((r) => r.realmId?.toString() === realmId)
  );
  const [members, setMembers] = useState();

  useEffect(() => {
    console.log(realms);
    setRealm(realms.find((r) => r.realmId?.toString() === realmId));
    getMembers();
  }, [realmId, realms]);

  async function getMembers() {
    const realmMembers = await getRealmMembers(
      new Connection(clusterApiUrl(network), "recent"),
      new PublicKey("GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw"),
      new PublicKey(realmId)
    );
    setMembers(realmMembers ?? []);
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 relative text-center overflow-auto">
      <div className="flex items-center justify-between">
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-gray-300 text-2xl cursor-pointer hover:opacity-75 w-min"
        >
          {showSidebar ? null : <AiOutlineMenu />}
        </div>
        <div className="text-white text-xl">
          Welcome to {realm?.displayName ?? realm?.symbol}!
        </div>
      </div>
      <div className="rounded-lg flex flex-col gap-4 gradient shadow-lg p-3">
        {realm?.displayName && (
          <InfoLabel label={"Name"} info={realm.displayName} />
        )}
        {realm?.symbol && realm?.isCertified && (
          <InfoLabel label={"Symbol"} info={realm.symbol} />
        )}
        {
          <InfoLabel
            label={"Members"}
            info={members ? members.length : <Loading />}
          />
        }
        {realm?.website && (
          <InfoLabel
            label={"Website"}
            info={
              <div className="flex items-center gap-2 hover:text-gray-300">
                <AiOutlineLink />
                <a
                  href={realm.website}
                  target="_blank"
                  rel="noreferrer"
                  className="whitespace-nowrap"
                >
                  {realm.website}
                </a>
              </div>
            }
          />
        )}
        {realm?.twitter && (
          <InfoLabel
            label={"Twitter"}
            info={
              <a
                href={`https://twitter.com/${realm.twitter}`}
                target="_blank"
                rel="noreferrer"
                className=" hover:text-gray-300"
              >
                {realm.twitter}
              </a>
            }
          />
        )}
        {realm?.programVersion && (
          <InfoLabel label={"Program Version"} info={realm.programVersion} />
        )}
        <div className="text-xl">Available commands</div>
        {commands &&
          commands.map((c) => (
            <InfoLabel
              key={c.description}
              info={c.command}
              label={c.description}
            />
          ))}
      </div>
    </div>
  );
}
