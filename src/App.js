import { useEffect, useReducer, useState } from "react";
import Gun from "gun";
import "./App.css";
import { getAllTokenOwnerRecords } from "@solana/spl-governance";
import mainnetBetaRealms from "./mainnet-beta.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
const gun = Gun({
  peers: ["https://localhost:3030/gun"],
});

const initialState = {
  messages: [],
};

function reducer(state, message) {
  return { messages: [message, ...state.messages] };
}

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

export default function App() {
  const NETWORK = clusterApiUrl("mainnet-beta");
  const connection = new Connection(NETWORK);

  const [formState, setForm] = useState({
    name: "",
    message: "",
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log(MAINNET_REALMS);
    const messages = gun.get("messages");
    messages.map().on((m) => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt,
      });
    });
  }, []);

  // async function getRealmMembers() {
  //   const members = await getAllTokenOwnerRecords(
  //     connection,
  //     getProvider().publicKey,
  //     MAINNET_REALMS[0].realmId
  //   );
  //   console.log(members);
  // }

  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value });
  }

  function saveMessage() {
    const messages = gun.get("messages");
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: Date.now(),
    });
    setForm({ name: "", message: "" });
  }

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

  return (
    <div className="App">
      hello
      <input
        onChange={onChange}
        placeholder="Name"
        name="name"
        value={formState.name}
      />
      <input
        onChange={onChange}
        placeholder="Message"
        name="message"
        value={formState.message}
      />
      <button onClick={saveMessage}>Send message</button>
      {state.messages.map((message) => (
        <div key={message.createdAt}>
          <div>{message.message}</div>
          <div>From: {message.name}</div>
          <div>Date: {message.createdAt}</div>
        </div>
      ))}
    </div>
  );
}
