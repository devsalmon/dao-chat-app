import {
  getTokenAccountsByMint,
  getAllTokenOwnerRecords,
  getRealm,
  parseTokenAccountData,
  getMultipleAccountInfoChunked,
  getTokenOwnerRecordsForRealmMintMapByOwner,
} from "@solana/spl-governance";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export const fetchCouncilMembersWithTokensOutsideRealm = async (
  realm,
  connection
) => {
  console.log(realm);
  if (realm?.account.config.councilMint) {
    const tokenAccounts = await getTokenAccountsByMint(
      connection.current,
      realm.account.config.councilMint.toBase58()
    );
    const tokenAccountsInfo = [];
    for (const acc of tokenAccounts) {
      tokenAccountsInfo.push(acc);
      console.log(acc);
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
//This will need to be rewritten for better performance if some realm hits more then +-5k+ members
const fetchCommunityMembersATAS = async (realm, connection, programId) => {
  const tokenRecords = await getTokenOwnerRecordsForRealmMintMapByOwner(
    connection,
    programId,
    realm.pubkey,
    realm.account.communityMint
  );
  const tokenRecordArray = tokenRecords
    ? Object.keys(tokenRecords).flatMap((x) => {
        return {
          walletAddress: x,
          community: { ...tokenRecords[x] },
        };
      })
    : [];
  if (realm?.account.communityMint) {
    const ATAS = [];
    //we filter out people who never voted and has tokens inside realm
    const communityTokenRecordsWallets = tokenRecordArray
      .filter((x) => x.community?.account.governingTokenDepositAmount.isZero())
      .map((x) => x.walletAddress);
    for (const walletAddress of communityTokenRecordsWallets) {
      const ata = await getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
        TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        realm.account.communityMint, // mint
        new PublicKey(walletAddress), // owner
        true
      );
      ATAS.push(ata);
    }
    const ownersAtas = await getMultipleAccountInfoChunked(
      connection.current,
      ATAS
    );
    const ownersAtasParsed = ownersAtas
      .filter((x) => x)
      .map((r) => {
        const publicKey = r.owner;
        const data = Buffer.from(r.data);
        const account = parseTokenAccountData(r.owner, data);
        return { publicKey, account };
      });
    return ownersAtasParsed;
  }
  return [];
};

// returns wallet addresses of members of a given realm
export async function getRealmMembers(connection, programId, realmPk) {
  try {
    // const realm = await getRealm(connection, new PublicKey(realmPk));
    // const communityMembers = await fetchCommunityMembersATAS(
    //   realm,
    //   connection,
    //   programId
    // );
    // console.log(communityMembers);
    // const m = await fetchCouncilMembersWithTokensOutsideRealm(
    //   realm,
    //   connection
    // );
    // console.log(m);
    const ownerRecords = await getAllTokenOwnerRecords(
      connection,
      programId,
      realmPk
    );
    // console.log(ownerRecords[0]?.account?.governingTokenOwner.toString());
    return ownerRecords.map((record) =>
      record?.account?.governingTokenOwner.toString()
    );
  } catch (e) {
    console.log(e);
    return [];
  }
}
