import { getNativeTreasuryAddress, getRealm } from "@solana/spl-governance";
import { PublicKey } from "@solana/web3.js";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

function getSolAmount(lamports) {
  return lamports / 1000000000;
}

export async function getTreasuryBalance(connection, realmId) {
  try {
    const govAccount = await getRealm(connection, new PublicKey(realmId));
    const treasuryAddress = await getNativeTreasuryAddress(
      govAccount.owner,
      govAccount.account.authority
    );
    console.log("Treasury address:", treasuryAddress.toString());
    const balance = await connection.getBalance(treasuryAddress);
    if (balance > 0) return getSolAmount(balance);
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      govAccount.pubkey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );
    for (const tokenAccount of tokenAccounts.value) {
      if (tokenAccount.account.lamports > 0)
        return getSolAmount(tokenAccount.account.lamports);
    }
    return 0;
  } catch (e) {
    console.log("Error:", e);
  }
}
