import { getNativeTreasuryAddress, getRealm } from "@solana/spl-governance";
import { PublicKey } from "@solana/web3.js";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export async function getTreasuryBalance(connection, realmId) {
  const programId = new PublicKey(
    "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw"
  );
  try {
    const govAccount = await getRealm(connection, new PublicKey(realmId));
    console.log("Gov account: ", govAccount.pubkey.toString());
    const treasuryAddress = await getNativeTreasuryAddress(
      programId,
      govAccount.pubkey
    );
    console.log("Treasury address:", treasuryAddress);
    const balance = await connection.getBalance(treasuryAddress);
    if (balance > 0) return balance;
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      govAccount.pubkey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );
    for (const tokenAccount of tokenAccounts.value) {
      if (tokenAccount.account.lamports > 0)
        return tokenAccount.account.lamports;
    }
    return 0;
  } catch (e) {
    console.log("Error:", e);
  }
}
