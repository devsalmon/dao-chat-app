import { ProposalState } from "@solana/spl-governance";
// import classNames from "classnames";

// import useRealm from "@hooks/useRealm";
// import useRealmGovernance from "../hooks/useRealmGovernance";

export const hasInstructions = (proposal) => {
  if (proposal.instructionsCount) {
    return true;
  }

  if (proposal.options) {
    for (const option of proposal.options) {
      if (option.instructionsCount) {
        return true;
      }
    }
  }

  return false;
};

function getBorderColor(proposalState, otherState) {
  switch (proposalState) {
    case ProposalState.Cancelled:
    case ProposalState.Completed:
    case ProposalState.Defeated:
    case ProposalState.ExecutingWithErrors:
      return "border-transparent";
    case ProposalState.Executing:
      return "border-[#5DC9EB]";
    case ProposalState.Draft:
      return otherState.isCreator ? "border-white" : "border-transparent";
    case ProposalState.SigningOff:
      return otherState.isSignatory ? "border-[#F5A458]" : "border-transparent";
    case ProposalState.Succeeded:
      return !hasInstructions(otherState.proposal)
        ? "border-transparent"
        : "border-[#5DC9EB]";
    case ProposalState.Voting:
      return otherState.votingEnded ? "border-[#5DC9EB]" : "border-[#8EFFDD]";
  }
}

function getLabel(proposalState, otherState) {
  switch (proposalState) {
    case ProposalState.Cancelled:
      return "Cancelled";
    case ProposalState.Completed:
      return "Completed";
    case ProposalState.Defeated:
      return "Defeated";
    case ProposalState.Draft:
      return "Draft";
    case ProposalState.Executing:
      return "Executable";
    case ProposalState.ExecutingWithErrors:
      return "Executing w/ errors";
    case ProposalState.SigningOff:
      return "Signing off";
    case ProposalState.Succeeded:
      return !hasInstructions(otherState.proposal) ? "Completed" : "Executable";
    case ProposalState.Voting:
      return otherState.votingEnded ? "Finalizing" : "Voting";
    default:
      return "Cancelled";
  }
}

function getOpacity(proposalState, otherState) {
  switch (proposalState) {
    case ProposalState.Cancelled:
    case ProposalState.Completed:
    case ProposalState.Defeated:
    case ProposalState.ExecutingWithErrors:
      return "opacity-70";
    case ProposalState.Draft:
      return otherState.isCreator ? "" : "opacity-70";
    case ProposalState.SigningOff:
      return otherState.isSignatory ? "" : "opacity-70";
    case ProposalState.Succeeded:
      return !hasInstructions(otherState.proposal) ? "opacity-70" : "";
    default:
      return "";
  }
}

function getTextColor(proposalState, otherState) {
  switch (proposalState) {
    case ProposalState.Cancelled:
    case ProposalState.Draft:
      return "text-white";
    case ProposalState.Completed:
      return "text-[#8EFFDD]";
    case ProposalState.Defeated:
    case ProposalState.ExecutingWithErrors:
      return "text-[#FF7C7C]";
    case ProposalState.Executing:
      return "text-[#5DC9EB]";
    case ProposalState.SigningOff:
      return "text-[#F5A458]";
    case ProposalState.Succeeded:
      return !hasInstructions(otherState.proposal)
        ? "text-[#8EFFDD]"
        : "text-[#5DC9EB]";
    case ProposalState.Voting:
      return otherState.votingEnded
        ? "bg-gradient-to-r from-[#00C2FF] via-[#00E4FF] to-[#87F2FF] bg-clip-text text-transparent"
        : "text-[#8EFFDD]";
  }
}

export default function ProposalStateBadge(props) {
  //   const { ownTokenRecord, ownCouncilTokenRecord } = useRealm();
  //   const governance = useRealmGovernance(props.proposal.governance);

  //   const isCreator =
  //     ownTokenRecord?.pubkey.equals(props.proposal.tokenOwnerRecord) ||
  //     ownCouncilTokenRecord?.pubkey.equals(props.proposal.tokenOwnerRecord) ||
  //     false;

  // For now, we're not going to display any special UI if the user is a signatory
  const isSignatory = false;

  const votingEnded =
    props.proposal.getTimeToVoteEnd(props.proposal.overnance) < 0;

  const otherState = {
    // isCreator,
    isSignatory,
    votingEnded,
    proposal: props.proposal,
  };

  return (
    <div
      className={
        "border flex min-w-max "
        // "border",
        // "inline-flex",
        // "min-w-max",
        // "items-center",
        // "px-2@,
        // "py-1"
        // "rounded-full"
        // "text-xs"
        // getBorderColor(props.proposal.state, otherState),
        // getOpacity(props.proposal.state, otherState),
        // getTextColor(props.proposal.state, otherState)
      }
    >
      {getLabel(props.proposal.state, otherState)}
    </div>
  );
}
