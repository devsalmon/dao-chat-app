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

  const borderColour = useMemo(() => {
    return getColour(currentProposal.account.state);
  }, [currentProposal]);

  const textColour = useMemo(() => {
    return getColour(currentProposal.account.state);
  }, [currentProposal.account]);

  function getColour(proposalState) {
    switch (proposalState) {
      case ProposalState.Cancelled:
        return "red";
      case ProposalState.Completed:
        return "#8EFFDD";
      case ProposalState.Defeated:
        return "red";
      case ProposalState.ExecutingWithErrors:
        return "red";
      case ProposalState.Executing:
        return "#5DC9EB";
      case ProposalState.Draft:
        return "gray";
      case ProposalState.SigningOff:
        return "gray";
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
      <div className="w-[80%] mx-auto px-10 py-6 h-fit bg-gray-600 rounded-lg shadow-xl top-20 flex flex-col gap-4 relative">
        <div
          className={`p-2 px-4 w-min rounded-full border-2 mx-auto`}
          style={{
            border: `2px solid ${borderColour}`,
            color: `${textColour}`,
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
