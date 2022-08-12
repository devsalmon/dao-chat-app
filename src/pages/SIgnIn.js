import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import Toggle from "../components/Toggle";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const SignIn = ({ gun, user }) => {
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

  return (
    <div className="flex flex-col gap-6 w-full h-full gradient p-8 text-center text-white">
      <div className="flex flex-col md:gap-8 gap-4 mx-auto md:w-[50vw]">
        {/* <Logo /> */}
        <div className="lg:text-6xl text-2xl w-full rounded-xl mx-auto flex justify-center gap-6 items-center">
          <img src="dao-chat-logo2.png" className="w-14 h-14" alt="logo" />
          <span className="text-black">Dao Chat</span>
        </div>
        <div className="bg-gray-700 rounded-xl shadow-xl md:!text-lg text-sm shadow-gray-600 px-4 py-8 flex flex-col gap-6">
          <div className="text-2xl">Sign In</div>
          <div>
            <Toggle
              enabled={hideAddress}
              setEnabled={setHideAddress}
              text={"Hide Address"}
            />
          </div>
          <Input
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            name="name"
            value={undefined}
            type={undefined}
          />
          <Input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            name="message"
            type="password"
            value={undefined}
          />
          <Button onClick={signIn} colour={undefined}>
            {loading ? (
              <div className="h-6">
                <Loading />
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
          <div>
            Don't have an account?{" "}
            <a
              className="underline cursor-pointer hover:opacity-75"
              href="/sign-up"
              rel="noreferrer"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
