import { useEffect, useReducer, useState } from "react";
import Gun from "gun";
import "./App.css";
import SideBar from "./components/SideBar";
import { getAllTokenOwnerRecords } from "@solana/spl-governance";
import mainnetBetaRealms from "./mainnet-beta.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

// initialize gun locally
// sync with as many peers as you would like by passing in an array of network uris
const gun = Gun({
  peers: ["http://localhost:3030/gun"],
});

// create the initial state to hold the messages
const initialState = {
  messages: [],
};

// Create a reducer that will update the messages array
function reducer(state, message) {
  return {
    messages: [message, ...state.messages],
  };
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

  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    name: "",
    message: "",
  });

  // initialize the reducer & state for holding the messages array
  const [state, dispatch] = useReducer(reducer, initialState);

  // when the app loads, fetch the current messages and load them into the state
  // this also subscribes to new data as it changes and updates the local state
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

  // set a new message in gun, update the local state to reset the form field
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
    setForm({
      name: "",
      message: "",
    });
  }

  // update the form state as the user types
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value });
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
    <div className="flex">
      <SideBar />
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
    </div>
  );
}
