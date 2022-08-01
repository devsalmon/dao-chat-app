import {
  getProposalsByGovernance,
  getAllProposals,
} from "@solana/spl-governance";

export async function getActiveProposals(connection, programId, realmPk) {
  try {
    return getAllProposals(connection, programId, realmPk);
  } catch (e) {
    console.log("Error:", e);
  }
}
