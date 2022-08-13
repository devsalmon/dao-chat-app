import { PublicKey } from "@solana/web3.js";
import { getAllTokenOwnerRecords, getRealms } from "@solana/spl-governance";
import mainnetBetaRealms from "./mainnet-beta.json";
import devnetRealms from "./devnet.json";

// CERTIFIED REALMS
const CERTIFIED_MAINNET = parseCertifiedRealms(mainnetBetaRealms);
const CERTIFIED_DEVNET = parseCertifiedRealms(devnetRealms);

// return certified realms based on network
export function getCertifiedRealmInfos(network) {
  return network === "mainnet" ? CERTIFIED_MAINNET : CERTIFIED_DEVNET;
}

function createUnchartedRealmInfo(realm) {
  return {
    symbol: realm.account.name,
    programId: new PublicKey(realm.owner),
    realmId: realm.pubkey,
    displayName: realm.account.name,
    isCertified: false,
    enableNotifi: true, // enable by default
  };
}

// get all uncharted realms (all realms excluding certified realms)
export async function getUnchartedRealmInfos(connection) {
  const certifiedRealms = getCertifiedRealmInfos(connection);

  const allRealms = (
    await Promise.all(
      // Assuming all the known spl-gov instances are already included in the certified realms list
      arrayToUnique(certifiedRealms, (r) => r.programId.toBase58()).map((p) => {
        return getRealms(connection, p.programId);
      })
    )
  )
    .flatMap((r) => Object.values(r))
    .sort((r1, r2) => r1.account.name.localeCompare(r2.account.name));

  const excludedRealms = arrayToMap(certifiedRealms, (r) =>
    r.realmId.toBase58()
  );

  return Object.values(allRealms).map((r) => {
    return !(
      excludedRealms.has(r.pubkey.toBase58()) ||
      EXCLUDED_REALMS.has(r.pubkey.toBase58())
    )
      ? createUnchartedRealmInfo(r)
      : {};
  });
}

function parseCertifiedRealms(realms) {
  return realms.map((realm) => ({
    ...realm,
    programId: new PublicKey(realm.programId),
    realmId: new PublicKey(realm.realmId),
    sharedWalletId: realm.sharedWalletId && new PublicKey(realm.sharedWalletId),
    isCertified: true,
    programVersion: realm.programVersion,
    enableNotifi: realm.enableNotifi ?? true, // enable by default
  }));
}

// Converts array of items to a Map
function arrayToMap(source, getKey) {
  return new Map(source.map((item) => [getKey(item), item]));
}

// Returns unique elements from the given source array and using the provided key selector
function arrayToUnique(source, getKey) {
  return Array.from(arrayToMap(source, getKey).values());
}

// Other excluded ones are know test DAOs like Test 'Grape Test' for example
//hidden realms
const EXCLUDED_REALMS = new Map([
  ["HtV3PXqDhuPoCTDfYhaWxrs5e7oYk96zYpiWSrWCj6FC", ""],
  ["3mBJhp6w7Sqi6JhbnNvV6yi3RHDveUGsmzeyWprBFBWB", ""],
  ["4Q1s1vQkgfnyZNWdhehQ8q8jwy4zAtFnznzRVqs72VF3", ""],
  ["3wMVntu1fPdUbk1RLm5vSnGoiapK2ALqf6NENtescMqr", ""],
  ["98hsdTteLBUTiBCLq399QGZJr3bLQMoZe4TYyzNhRkDF", ""],
  ["2tmd2zN3TRGGjDKaRtvLRWgkwNQGQQL4p81btR59qrJX", ""],
  ["EtwCjZW4toGDzWDtSsCHueAduEW3E2JNDssKJGf3e6fz", ""],
  ["2yPZWLpsLgs4BT53J2k8vjqBZoXpWBNWJ3CdpmBVZdam", ""],
  ["Gn43s7KsVPC8rYhrK4DouQ4iiG49SpegjEKfSgkeEfNW", ""],
  ["24PDx9UiyVKsgHdtb17mdjngNDk1ZQ9ASNG3cKSWRqsU", ""],
  ["BS1ujZP29jvLGMiVgdqsZE1GMAemEdoJvJuaWWRBMWnD", ""],
  ["2dHH8GciYQNXVf2FqiB9rrqUTsLijoZv2U8DLZd6CfXF", ""],
  ["2F96LbxCv2VdmAy3psyBmfwjULU5vJmnoaaW8AKAuKjd", ""],
  ["Ad7bjv7pugibV1TbpD3FTubk17L5FxXcLWr54yF8kmj", ""],
  ["2RQ9KQUJocKasNeNniAqwuDL3tPVsyxuPPtgjHgcKaYG", ""],
  ["6E7RUhSYnYidySEpGFMhwfG1jDYnWqYBu6sHadmFRPXt", ""],
  ["DU4LCYgMA3Krupm5zdiGQVTfsabD2mqhrEHdmSWkCYcQ", ""],
  ["6smJyNvvyKSZdQu1qnvdSyQUjHPhgEB4APEDsQVELE28", ""],
  ["6vX5gasMN6XevEEaXLHRvrkm3B8irtVnEEiMMDP37rTb", ""],
  ["3UHqhBG1sju6685QrcH9d8WJVEW2Us5AnGsTY1Lh2Kxf", ""],
  ["7Pm2249LrXxLLVPJumUsBVR6FuPhDJxXxfiWbjZ8DP1T", ""],
  ["6ezQ3Z18YDCWUj83tKk21JB73ptu1CNcZCfgVBcfx59Z", ""],
  ["DgYzfAF8uh5QQTXREYaUZK7P6crNPrWDGqLBBbytkKGs", ""],
  ["DVYnCzaXVi8LeARnMUbMHTF9K7eN9AM8oVxvJLNmwABe", ""],
  ["BQVzxd7BKrbE7WyZ5mzQjcyjgxpmjURXu5HpU4K4dsBg", ""],
  ["2o7fFryGHyTfb2pB4ph3xybPSN2WAGWExp53jU8bacjW", ""],
  ["JxTAAbnXRd13CPz5PDZeDsFpxy9ADL3BV28YsDT1N5k", ""],
  ["HcnRFMcJNzSH9J1332swEhWc91CSGjJwfyYACpd2ZWke", ""],
  ["2ZF1CNK1GpYHuSpBvWAjKU4LMfEziEJmZV4eGsCUNR3L", ""],
  ["GBjvsTy4d3V7nzvUD8pgX4hTKkok4m76RDHYyHvoRTsd", ""],
  ["6pwXZrHvHc44Mg8c6rEZbEWzSBreWnP5DAYkt2vfhWjU", ""],
  ["5LSkHM5BsgM5m7wLy222kvhWceYK5e1sZ5DHHU8G8pP", ""],
  ["Gj8WE4jVZf9BCEUgtkShSoicPrTU4jhoyqi4d52ayAhY", ""],
  ["HxsBLUnTz4tTEbJzPbNY69At1B99T9yvVouskPJGEjF", "Grape Test"],
  ["2aia1CN3YoFergRxyDTPed5Kup4LDmZMEgWxEzZ7vaKB", ""],
  ["AX2wfHP9NQ6z8JA4exmHnfkqgxiBb4Kcv6BjR8NJFhgL", ""],
  ["EroKomMwa4m7Q4PEUNy3nHRjeZ49P3A5CmomNeRm2kFR", ""],
  ["5rWb6R9bC5LZ6RuGQXLdLhxWW6F2418nrSMUnSduUHPr", ""],
  ["5pNokKBsf5EaAVrFbKPuhoYiCu7awsiGsmYqnKwpjvxr", ""],
  ["3DisadCQ4Tn4FoNkYHB6ZngVSxqomVmhAzCfxEVmrkj6", ""],
  ["AeUazJsjGVrxKWkTi5PQ4S4JxWXQ3mYHNS1mURD9GeNg", ""],
  ["AMRC14FwwWkT5TG2ibXdLTUnVrnd2N4YsTifzCeRR22X", ""], // Chicken Tribe test
  ["oW5X5C9wrnchcd4oucv8RG7t1uQLRKyevgy3GPMDTst", ""], // Succeed.Finance test
  ["3BHrYe5SV2VqHqpEyxYYLbNeNGEnKBjYG4kt6pF5Xu5K", ""], // Woof DAO test
  ["9Xe5qW76XPhyohKaz8joecybGnKrgT4N6JNEuM5ZZwa9", ""], // 1SOL test
  ["2mDwFhax7XcudkVzoV85pxo3B5aRqCt3diavVydjkBJC", ""], // 1SOL test
  ["DkSvNgykZPPFczhJVh8HDkhz25ByrDoPcB32q75AYu9k", ""], // UXDProtocolDAO test
  ["CvAD2XnHuJCzTyqRRHZtqRigVw11i9CDH8ACRGQpxhuf", ""], // Savana Sins Club
  ["AxuK6ZGEQS2vrLXwJeK5pZFBAAPamEUyQXptfEEnCHuD", ""],
  ["24pZ9VkpRGTH6wHqjSsySYHpxAKbQL1Tczb6b7zytomZ", ""],
]);
