import {
  getProposalsByGovernance,
  getAllProposals,
} from "@solana/spl-governance";

export const getActiveProposals = async ({
  connection,
  programId,
  realmPk,
}) => {
  console.log("Proposals", getAllProposals(connection, programId, realmPk));
};
