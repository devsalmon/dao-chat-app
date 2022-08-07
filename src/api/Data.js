import {
  getNativeTreasuryAddress,
  getRealm,
  getAllGovernances,
} from "@solana/spl-governance";
import { PublicKey } from "@solana/web3.js";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

function getSolAmount(lamports) {
  return lamports / 1000000000;
}

export async function getTreasuryBalance(connection, realmId) {
  try {
    const realm = await getRealm(connection, new PublicKey(realmId));
    const governances = await getAllGovernances(
      connection,
      realm.owner,
      realm.pubkey
    );

    const solAddresses = await Promise.all(
      governances.map((x) =>
        getNativeTreasuryAddress(new PublicKey(realm.owner), x.pubkey)
      )
    );

    const solBalances = await Promise.all(
      solAddresses.map((address) =>
        connection.getBalance(new PublicKey(address))
      )
    );

    let total = 0;
    solBalances.forEach((balance) => {
      total += balance;
    });
    return getSolAmount(total);
  } catch (e) {
    console.log("Error:", e);
  }
}
