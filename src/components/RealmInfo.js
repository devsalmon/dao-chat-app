import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRealmMembers } from "../realms/Realms";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import Loading from "./Loading";
import { commands } from "../api/ChatCommands";

const InfoLabel = ({ label, info }) => {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="font-bold text-gray-700">{label}</div>
      <div className="text-lg">{info}</div>
    </div>
  );
};

export default function RealmInfo({ gun, network, realms }) {
  const { realmId } = useParams();
  const [realm, setRealm] = useState(
    realms.find((r) => r.realmId?.toString() === realmId)
  );
  const [members, setMembers] = useState();

  useEffect(() => {
    setRealm(realms.find((r) => r.realmId?.toString() === realmId));
    getMembers();
  }, [realmId]);

  async function getMembers() {
    const realmMembers = await getRealmMembers(
      new Connection(clusterApiUrl(network), "recent"),
      new PublicKey("GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw"),
      new PublicKey(realmId)
    );
    setMembers(realmMembers ?? []);
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 relative text-center">
      <div className="text-white text-xl">
        Welcome to {realm?.displayName ?? realm?.symbol}!
      </div>
      <div className="rounded-lg flex flex-col gap-4 bg-gray-300 shadow-lg p-3">
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
        {realm?.website && <InfoLabel label={"Website"} info={realm.website} />}
        {realm?.twitter && <InfoLabel label={"Twitter"} info={realm.twitter} />}
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
