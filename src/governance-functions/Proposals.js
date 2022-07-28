import {
  getProposalsByGovernance,
  getAllProposals,
} from "@solana/spl-governance";

export const getActiveProposals = async ({
  connection,
  programId,
  realmPk,
}) => {
  console.log(getAllProposals(connection, programId, realmPk));
};
