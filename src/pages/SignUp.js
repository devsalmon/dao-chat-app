import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import Toggle from "../components/Toggle";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const SignUp = ({ gun, user }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [loading, setLoading] = useState(false);
  const [hideAddress, setHideAddress] = useState(false);

  const myWallet = useWallet();

  useEffect(() => {
    if (myWallet.connected) {
      setWalletAddress(myWallet.publicKey.toString());
    } else {
      setWalletAddress("");
    }
  }, [myWallet]);

  const signIn = async () => {
    setLoading(true);
    user.auth(username, password, ({ err }) => {
      if (!err) console.log("SIGNED IN");
      if (walletAddress != null && walletAddress?.trim() !== "") {
        user.put({ wallet: walletAddress });
      }
      user.put({ hideAddress: hideAddress });
      setLoading(false);
      if (err) toast.error(err);
    });
  };

  // Create user
  const signUp = async () => {
    setLoading(true);
    if (!walletAddress || walletAddress.trim() === "") {
      toast.error("Connect a wallet to sign up");
      setLoading(false);
    } else {
      user.create(username, password, ({ err }) => {
        if (err) {
          toast.error(err);
          setLoading(false);
        } else {
          signIn();
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full gradient p-8 text-center text-white">
      <div className="text-4xl text-black flex flex-col gap-4 items-center">
        <img src="dao-chat-logo6.png" className="w-28 h-28" alt="logo" />
        <div>DAO CHAT</div>
      </div>
      <div className="bg-gray-700 rounded-xl shadow-xl shadow-gray-600 px-4 py-8 flex flex-col gap-4 mx-auto md:w-[50vw]">
        <div className="text-2xl">Welcome To Dao Chat!</div>
        <div className="mx-auto w-fit">
          <WalletMultiButton />
        </div>
        <div>
          <Toggle
            enabled={hideAddress}
            setEnabled={setHideAddress}
            text={"Hide Address"}
          />
        </div>
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
          {loading ? (
            <div className="h-6">
              <Loading />
            </div>
          ) : (
            "Sign Up"
          )}
        </Button>
        <div>
          Already have an account?{" "}
          <a
            className="underline cursor-pointer hover:opacity-75"
            href="/sign-in"
            rel="noreferrer"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
