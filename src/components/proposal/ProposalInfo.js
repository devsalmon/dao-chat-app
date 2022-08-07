import { useEffect, useState, useMemo } from "react";
import {
  ProposalState,
  Proposal,
  getRealmConfigAddress,
  getGovernanceAccount,
  RealmConfigAccount,
} from "@solana/spl-governance";
import { programId } from "../../constants";
import VoteResults from "./VoteResults";
import Button from "../Button";
import { PublicKey } from "@solana/web3.js";

export default function ProposalInfo({
  currentProposal,
  realm,
  network,
  connection,
}) {
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

  function getColour(proposalState) {
    switch (proposalState) {
      case ProposalState.Cancelled:
        return "red-500";
      case ProposalState.Completed:
        return "green-300";
      case ProposalState.Defeated:
        return "red-500";
      case ProposalState.ExecutingWithErrors:
        return "red-500";
      case ProposalState.Executing:
        return "#5DC9EB";
      case ProposalState.Draft:
        return "gray-200";
      case ProposalState.SigningOff:
        return "gray-400";
      case ProposalState.Succeeded:
        return "#5DC9EB";
      case ProposalState.Voting:
        return "#8EFFDD";
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
          className={`p-2 px-4 w-min rounded-full border-2 mx-auto`}
          style={{
            border: `2px solid ${getColour(currentProposal.account.state)}`,
            color: `${getColour(currentProposal.account.state)}`,
          }}
        >
          {getState(currentProposal.account.state)}
        </div>
        <VoteResults proposal={proposal} governance={realm?.governance} />
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
