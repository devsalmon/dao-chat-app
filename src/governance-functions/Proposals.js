import {
  getProposalsByGovernance,
  getAllProposals,
} from "@solana/spl-governance";

export async function getProposals(connection, programId, realmPk) {
  try {
    return getAllProposals(connection, programId, realmPk);
  } catch (e) {
    console.log("Error:", e);
  }
}

// export const castVote = createAsyncThunk(
//   "wallet/castVote",
//   async (
//     { publicKey, transactionData, selectedDelegate, isCommunityVote }: any,
//     { getState }
//   ) => {
//     try {
//       const { realms, wallet, members } = getState() as RootState;
//       const { proposal, action } = transactionData;
//       const { selectedRealm } = realms;
//       const walletPubkey = new PublicKey(wallet.publicKey);
//       let tokenOwnerRecord;
//       const governanceAuthority = walletPubkey;

//       // if Member has a token, use their own token
//       if (members.membersMap[wallet.publicKey] && !selectedDelegate) {
//         tokenOwnerRecord = members.membersMap[wallet.publicKey];
//       } else {
//         // else get the token from the tokens that have been delegated to them
//         tokenOwnerRecord = members.membersMap[selectedDelegate];
//       }

//       // each member can have a token record for community or council.
//       let tokenRecordPublicKey = isCommunityVote
//         ? tokenOwnerRecord?.communityPublicKey
//         : tokenOwnerRecord?.councilPublicKey;
//       // 1. Check if current wallet is member and has token to be voted with
//       // 2. If it does, do vote with that token
//       // 3. If not check if current wallet is delegated from an token owner record
//       // 4. if it is, check if it has the token for the proposal
//       // 5. if it does, attempt vote

//       const payer = walletPubkey;

//       const signers: Keypair[] = [];
//       const instructions: TransactionInstruction[] = [];

//       const programVersion = await getGovernanceProgramVersion(
//         connection,
//         new PublicKey(selectedRealm!.governanceId)
//       );

//       const privateKey = wallet.privateKey;
//       const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));

//       console.log("instructions before plugin", instructions);
//       console.log("token owner record", tokenOwnerRecord);
//       // PLUGIN STUFF
//       let votePlugin;
//       // TODO: update this to handle any vsr plugin, rn only runs for mango dao
//       if (
//         selectedRealm?.realmId ===
//         "DPiH3H3c7t47BMxqTxLsuPQpEC6Kne8GA9VXbxpnZxFE"
//       ) {
//         votePlugin = await getVotingPlugin(
//           selectedRealm,
//           walletKeypair,
//           new PublicKey(tokenOwnerRecord.walletId),
//           instructions
//         );
//       }
//       // END PLUGIN STUFF
//       console.log("instructions after plugin", instructions);

//       await withCastVote(
//         instructions,
//         new PublicKey(selectedRealm!.governanceId), //  realm/governance PublicKey
//         programVersion, // version object, version of realm
//         new PublicKey(selectedRealm!.pubKey), // realms publicKey
//         new PublicKey(proposal.governanceId), // proposal governance Public key
//         new PublicKey(proposal.proposalId), // proposal public key
//         new PublicKey(proposal.tokenOwnerRecord), // proposal token owner record, publicKey
//         new PublicKey(tokenRecordPublicKey), // publicKey of tokenOwnerRecord
//         governanceAuthority, // wallet publicKey
//         new PublicKey(proposal.governingTokenMint), // proposal governanceMint publicKey
//         Vote.fromYesNoVote(action), //  *Vote* class? 1 = no, 0 = yes
//         payer,
//         // TODO: handle plugin stuff here.
//         votePlugin?.voterWeightPk,
//         votePlugin?.maxVoterWeightRecord
//       );

//       const recentBlock = await connection.getLatestBlockhash();

//       const transaction = new Transaction({ feePayer: walletPubkey });
//       transaction.recentBlockhash = recentBlock.blockhash;

//       transaction.add(...instructions);
//       transaction.sign(walletKeypair);

//       const response = await sendAndConfirmTransaction(
//         connection,
//         transaction,
//         [walletKeypair]
//       );
//       console.log("response", response);
//       return { transactionError: "" };
//     } catch (error) {
//       console.log("error", error);
//       return { transactionError: error };
//     }
//   }
// );
