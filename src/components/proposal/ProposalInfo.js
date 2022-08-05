import { useEffect, useState, useMemo } from "react";
import { ProposalState, Proposal, Realm } from "@solana/spl-governance";
import VoteResults from "./VoteResults";
import Button from "../Button";

export default function ProposalInfo({ currentProposal, realm, network }) {
  const [proposal, setProposal] = useState(
    currentProposal?.account ? new Proposal(currentProposal?.account) : null
  );
  const votingLink = useMemo(() => {
    const realmPath =
      realm.isCertified && realm.symbol
        ? realm.symbol
        : realm?.realmId?.toString();
    const clusterPath = network == "devnet" ? "?cluster=devnet" : "";
    return `https://app.realms.today/dao/${realmPath}/proposal/${currentProposal?.pubkey?.toString()}${clusterPath}`;
  }, [currentProposal, realm, network]);

  useEffect(() => {
    const p = currentProposal?.account
      ? new Proposal(currentProposal?.account)
      : null;
    setProposal(p);
  }, [realm, currentProposal]);

  function getBorderColour(proposalState) {
    switch (proposalState) {
      case ProposalState.Cancelled:
        return "border-red-500";
      case ProposalState.Completed:
        return "border-green-300";
      case ProposalState.Defeated:
        return "border-red-500";
      case ProposalState.ExecutingWithErrors:
        return "border-red-500";
      case ProposalState.Executing:
        return "border-[#5DC9EB]";
      case ProposalState.Draft:
        return "border-gray-200";
      case ProposalState.SigningOff:
        return "border-gray-400";
      case ProposalState.Succeeded:
        return "border-[#5DC9EB]";
      case ProposalState.Voting:
        return "border-[#8EFFDD]";
      default:
        return undefined;
    }
  }

  function getState(proposalState) {
    switch (proposalState) {
      case ProposalState.ExecutingWithErrors:
        return "Executing with errors";
      default:
        return ProposalState[proposalState];
    }
  }

  return (
    proposal && (
      <div className="w-full h-full flex flex-col gap-4 relative">
        <div
          className={`${getBorderColour(
            currentProposal.account.state
          )} p-2 w-min px-4 rounded-full border-2 mx-auto text-gray-300`}
        >
          {getState(currentProposal.account.state)}
        </div>
        <VoteResults proposal={proposal} />
        <a
          href={votingLink}
          className="mx-auto"
          target="_blank"
          rel="noreferrer"
        >
          <Button>VOTE</Button>
        </a>
      </div>
    )
  );
}
