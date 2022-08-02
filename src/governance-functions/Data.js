import { getNativeTreasuryAddress, getRealm } from "@solana/spl-governance";
import { PublicKey } from "@solana/web3.js";

export async function getTreasuryBalance(connection, realmId) {
  const programId = new PublicKey(
    "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw"
  );
  try {
    let govAccount = getRealm(connection, realmId);
    return getNativeTreasuryAddress(programId, new PublicKey(govAccount));
  } catch (e) {
    console.log("Error:", e);
  }
}
