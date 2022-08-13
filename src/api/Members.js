import { getAllTokenOwnerRecords } from "@solana/spl-governance";

// returns wallet addresses of members of a given realm
export async function getRealmMembers(connection, programId, realmPk) {
  try {
    const ownerRecords = await getAllTokenOwnerRecords(
      connection,
      programId,
      realmPk
    );
    return ownerRecords.map((record) =>
      record?.account?.governingTokenOwner.toString()
    );
  } catch (e) {
    console.log(e);
    return [];
  }
}
