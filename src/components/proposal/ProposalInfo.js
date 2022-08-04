import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProposalState } from "@solana/spl-governance";
import ProposalStateBadge from "./ProposalStatusBadge";

export default function ProposalInfo({ proposal }) {
  useEffect(() => {});

  function getBorderColour(proposalState) {
    switch (proposalState) {
      case ProposalState.Cancelled:
      case ProposalState.Completed:
      case ProposalState.Defeated:
      case ProposalState.ExecutingWithErrors:
        return "border-transparent";
      case ProposalState.Executing:
        return "border-[#5DC9EB]";
      case ProposalState.Draft:
        return "border-transparent";
      case ProposalState.SigningOff:
        return "border-transparent";
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
      case ProposalState.Cancelled:
      case ProposalState.Completed:
      case ProposalState.Defeated:
      case ProposalState.ExecutingWithErrors:
        return "";
      case ProposalState.Executing:
        return "border-[#5DC9EB]";
      case ProposalState.Draft:
        return "border-transparent";
      case ProposalState.SigningOff:
        return "border-transparent";
      case ProposalState.Succeeded:
        return "border-[#5DC9EB]";
      case ProposalState.Voting:
        return "Voting";
      default:
        return undefined;
    }
  }

  return (
    proposal &&
    proposal?.account && (
      <div className="w-full h-full flex flex-col gap-4">
        <div>{proposal.account.state}</div>
        <div
          className={`${getBorderColour(
            proposal.account.state
          )} p-2 rounded-full border-2`}
        >
          {ProposalState[proposal.account.state]}
        </div>
      </div>
    )
  );
}
