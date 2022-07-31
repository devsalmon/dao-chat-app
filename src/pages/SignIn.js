import React, { useState, useMemo } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
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
  WalletConnectButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {
  createDefaultAuthorizationResultCache,
  SolanaMobileWalletAdapter,
} from "@solana-mobile/wallet-adapter-mobile";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const SignIn = ({ gun, user }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [walletAddress, setWalletAddress] = useState();

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

  const connectWallet = () => {
    getProvider()
      .connect()
      .then((publicKey) => {
        const pubKey = JSON.parse(JSON.stringify(publicKey)).publicKey;
        console.log("connected", pubKey.toString());
        setWalletAddress(pubKey);
      })
      .catch((err) => console.log(err.message));
  };

  //Disconnects phantom wallet from site.
  const disconnectWallet = () => {
    if ("solana" in window) {
      window.solana.disconnect();
      window.solana.on("disconnect", () => setWalletAddress(""));
    } else if ("solflare" in window) {
      window.solflare.disconnect();
      window.solana.on("disconnect", () => setWalletAddress(""));
    }
  };

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

  const signIn = () => {
    user.auth(username, password, ({ err }) => {
      if (!err) console.log("SIGNED IN");
      if (walletAddress != null && walletAddress?.trim() !== "") {
        user.put({ wallet: walletAddress });
      }
      if (err) alert(err);
    });
  };

  // Create user
  const signUp = () => {
    // if (!walletAddress || walletAddress.trim() === "") {
    //   alert("Connect a wallet to sign up");
    // } else {
    user.create(username, password, ({ err }) => {
      if (err) {
        alert(err);
      } else {
        signIn();
      }
    });
    // }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex flex-col gap-8 w-[400px] h-[600px] bg-gray-800 p-8 text-center">
            <div className="text-2xl text-white">Welcome To Dao Chat!</div>
            <div className="bg-white rounded-xl shadow-xl px-4 py-8 flex flex-col gap-4">
              <div
                className="wallet-adapter-button-trigger wallet-adapter-button flex justify-center"
                onClick={connectWallet}
              >
                <div className=" truncate break-all">
                  {walletAddress ? walletAddress : "CONNECT"}
                </div>
              </div>
              {walletAddress && (
                <div
                  className="wallet-adapter-button-trigger wallet-adapter-button flex justify-center"
                  onClick={disconnectWallet}
                >
                  DISCONNECT
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label>Username</label>
                <Input
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  name="name"
                  value={undefined}
                  type={undefined}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Password</label>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  name="message"
                  type="password"
                  value={undefined}
                />
              </div>
              <Button onClick={signUp} colour={undefined}>
                Create User
              </Button>
              <Button onClick={signIn} colour={undefined}>
                Sign In
              </Button>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SignIn;
