import React, { useState, useMemo, useEffect, useCallback } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { getAllTokenOwnerRecords } from "@solana/spl-governance";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  WalletContext,
  useConnection,
} from "@solana/wallet-adapter-react";
import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@solana/wallet-adapter-base";
import {
  CoinbaseWalletAdapter,
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  clusterApiUrl,
  Keypair,
  Connection,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createDefaultAuthorizationResultCache,
  SolanaMobileWalletAdapter,
} from "@solana-mobile/wallet-adapter-mobile";
import mainnetBetaRealms from "../realms/mainnet-beta.json";
import { PublicKey } from "@solana/web3.js";

const MAINNET_REALMS = parseCertifiedRealms(mainnetBetaRealms);

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

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

function SignIn({ gun, user }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  //const [walletAddress, setWalletAddress] = useState();

  const NETWORK = clusterApiUrl("mainnet-beta");
  const connection = new Connection(NETWORK);
  const { publicKey, sendTransaction } = useWallet();

  const getProvider = () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    } else if ("solflare" in window) {
      const provider = window.solflare;
      if (provider.isSolflare) {
        return provider;
      }
    }
  };

  async function getRealmMembers(pubKey) {
    const members = await getAllTokenOwnerRecords(
      connection,
      pubKey,
      MAINNET_REALMS[0].realmId
    );
    console.log(members);
  }

  useEffect(() => {
    console.log("running");
    if (getProvider().publicKey) {
      console.log("Public key:", publicKey);
      getRealmMembers(getProvider().publicKey);
    }
  });

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new SolanaMobileWalletAdapter({
        appIdentity: { name: "Solana Wallet Adapter App" },
        authorizationResultCache: createDefaultAuthorizationResultCache(),
      }),
      new CoinbaseWalletAdapter(),
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports: 1,
      })
    );

    const signature = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(signature, "processed");
  }, [publicKey, sendTransaction, connection]);

  const signIn = () => {
    user.auth(username, password, ({ err }) => {
      user.put({ wallet: "PUBLIC KEY" });
      if (err) alert(err);
    });
  };

  // Create user
  const signUp = () => {
    user.create(username, password, ({ err }) => {
      if (err) {
        alert(err);
      } else {
        signIn();
      }
    });
  };

  const testFunction = () => {
    if (publicKey) {
      console.log("public key", publicKey.toBase58());
    }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex flex-col gap-8 w-[400px] h-[600px] bg-gray-800 p-8 text-center">
            <div className="text-2xl text-white">Welcome To Dao Chat!</div>
            <WalletMultiButton />
            {/* <WalletDisconnectButton /> */}
            <div className="bg-white rounded-xl shadow-xl px-4 py-8 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label>Username</label>
                <Input
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  name="name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Password</label>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  name="message"
                  type="password"
                />
              </div>
              <Button onClick={signUp}>Create User</Button>
              <Button onClick={signIn}>Sign In</Button>
              <button onClick={() => testFunction()}>Test</button>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default SignIn;
