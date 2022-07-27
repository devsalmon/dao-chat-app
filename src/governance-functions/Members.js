import { getTokenAccountsByMint } from "@solana/spl-governance";

export const fetchCouncilMembersWithTokensOutsideRealm = async ({
  realm,
  connection,
}) => {
  console.log(realm);
  if (realm?.account.config.councilMint) {
    const tokenAccounts = await getTokenAccountsByMint(
      connection.current,
      realm.account.config.councilMint.toBase58()
    );
    const tokenAccountsInfo = [];
    for (const acc of tokenAccounts) {
      tokenAccountsInfo.push(acc);
    }
    //we filter out people who dont have any tokens and we filter out accounts owned by realm e.g.
    //accounts that holds deposited tokens inside realm.
    return tokenAccountsInfo.filter(
      (x) =>
        !x.account.amount.isZero() &&
        x.account.owner.toBase58() !== realm?.pubkey.toBase58()
    );
  }
  return [];
};
