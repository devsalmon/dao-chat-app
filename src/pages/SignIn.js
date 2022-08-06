import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import toast from "react-hot-toast";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const SignIn = ({ gun, user }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [walletAddress, setWalletAddress] = useState();

  const myWallet = useWallet();

  useEffect(() => {
    if (myWallet.connected) {
      setWalletAddress(myWallet.publicKey.toString());
    } else {
      setWalletAddress("");
    }
  }, [myWallet]);

  // const getProvider = () => {
  //   if ("solana" in window) {
  //     const provider = window.solana;
  //     if (provider.isPhantom) {
  //       return provider;
  //     }
  //   } else if ("solflare" in window) {
  //     const provider = window.solflare;
  //     if (provider.isSolflare) {
  //       return provider;
  //     }
  //   }
  // };

  // const connectWallet = () => {
  //   getProvider()
  //     .connect()
  //     .then((publicKey) => {
  //       const pubKey = JSON.parse(JSON.stringify(publicKey)).publicKey;
  //       console.log("connected", pubKey.toString());
  //       setWalletAddress(pubKey);
  //     })
  //     .catch((err) => console.log(err.message));
  // };

  //Disconnects phantom wallet from site.
  // const disconnectWallet = () => {
  //   if ("solana" in window) {
  //     window.solana.disconnect();
  //     window.solana.on("disconnect", () => setWalletAddress(""));
  //   } else if ("solflare" in window) {
  //     window.solflare.disconnect();
  //     window.solana.on("disconnect", () => setWalletAddress(""));
  //   }
  // };

  const signIn = () => {
    user.auth(username, password, ({ err }) => {
      if (!err) console.log("SIGNED IN");
      if (walletAddress != null && walletAddress?.trim() !== "") {
        user.put({ wallet: walletAddress });
      }
      if (err) toast.error(err);
    });
  };

  // Create user
  const signUp = () => {
    if (!walletAddress || walletAddress.trim() === "") {
      toast.error("Connect a wallet to sign up");
    } else {
      user.create(username, password, ({ err }) => {
        if (err) {
          toast.error(err);
        } else {
          signIn();
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full h-full bg-gray-800 p-8 text-center">
      <div className="text-2xl text-white">Welcome To Dao Chat!</div>
      <div className="bg-white rounded-xl shadow-xl px-4 py-8 flex flex-col gap-4 mx-auto md:w-[50vw]">
        {/* <div
                className="wallet-adapter-button-trigger wallet-adapter-button flex justify-center"
                onClick={connectWallet}
              >
                <div className=" truncate break-all">
                  {walletAddress ? walletAddress : "CONNECT"}
                </div>
              </div> */}
        <div className="mx-auto w-fit">
          <WalletMultiButton />
        </div>
        {/* <h1>{myWallet ? myWallet : "not connected"}</h1> */}
        {/* {walletAddress && (
          <div
            className="wallet-adapter-button-trigger wallet-adapter-button flex justify-center"
            onClick={disconnectWallet}
          >
            DISCONNECT
          </div>
        )} */}
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
  );
};

export default SignIn;
