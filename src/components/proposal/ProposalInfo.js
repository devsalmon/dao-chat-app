import { useEffect, useState, useMemo } from "react";
import { ProposalState, Proposal, Realm } from "@solana/spl-governance";
import VoteResultsBar from "./VoteResultsBar";
import BN from "bn.js";

export default function ProposalInfo({ currentProposal, realm }) {
  const [proposal, setProposal] = useState(
    new Proposal(currentProposal?.account)
  );
  const [totalVoteCount, setTotalVoteCount] = useState();
  const [yesVotes, setYesVotes] = useState();
  const [noVotes, setNoVotes] = useState();
  // const proposalMint = useMemo(() => {
  //   return proposal?.governingTokenMint.toBase58() ===
  //   realm?.account.communityMint.toBase58()
  //     ? mint
  //     : councilMint
  // }, [realm, proposal])

  useEffect(() => {
    const p = new Proposal(currentProposal?.account);
    setProposal(p);
    const y = getTokenAmount(p.getYesVoteCount());
    const n = getTokenAmount(p.getNoVoteCount());
    setYesVotes(y);
    setNoVotes(n);
    setTotalVoteCount(y + n);
    console.log(p?.governingTokenMint.toBase58());
    console.log(new Realm(realm));
    console.log("p");
  }, [realm, currentProposal]);

  function getTokenAmount(c, decimals) {
    return c?.div(new BN(100000)).toNumber() || 0;
  }

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
        <VoteResultsBar
          approveVotePercentage={
            totalVoteCount === 0 ? 0 : (yesVotes / totalVoteCount) * 100
          }
          denyVotePercentage={
            totalVoteCount === 0 ? 0 : (noVotes / totalVoteCount) * 100
          }
        />
      </div>
    )
  );
}
