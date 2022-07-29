import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Gun from "gun";
import "gun/sea";
import SignIn from "./pages/SignIn";
import { getAllTokenOwnerRecords, getRealms } from "@solana/spl-governance";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Realm from "./pages/Realm";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

import mainnetBetaRealms from "./realms/mainnet-beta.json";
import devnetRealms from "./realms/devnet.json";
import { fetchCouncilMembersWithTokensOutsideRealm } from "./governance-functions/Members";

const MAINNET_REALMS = parseCertifiedRealms(mainnetBetaRealms);
const DEVNET_REALMS = parseCertifiedRealms(devnetRealms);

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

const root = createRoot(document.getElementById("root"));

// initialize gun locally
// sync with as many peers as you would like by passing in an array of network uris
const gun = Gun({
  peers: ["https://dao-chat-server.herokuapp.com/gun"],
});
const gunUser = gun.user().recall({ sessionStorage: true });

function Main() {
  const [user, setUser] = useState(gunUser?.is);
  const [devnetRealms, setDevnetRealms] = useState(DEVNET_REALMS);
  const [mainnetRealms, setMainnetRealms] = useState(MAINNET_REALMS);

  const DEVNET = clusterApiUrl("mainnet-beta");
  const MAINNET = clusterApiUrl("devnet");

  const devnet_connection = new Connection(DEVNET, "recent");
  const mainnet_connection = new Connection(MAINNET, "recent");
  const programId = new PublicKey(
    "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw"
  );

  const [network, setNetwork] = useState(
    localStorage.getItem("network") ?? "devnet"
  );

  const changeNetwork = () => {
    if (network == "devnet") {
      setNetwork("mainnet");
      localStorage.setItem("network", "mainnet");
    } else {
      setNetwork("devnet");
      localStorage.setItem("network", "devnet");
    }
    window.location.href = "/";
  };

  useEffect(() => {
    fetchDevnetRealms();
  }, []);

  async function fetchDevnetRealms() {
    console.log("FETCHING");
    const realms = await getRealms(devnet_connection, programId);
    console.log(realms);
    setDevnetRealms(realms);
  }

  async function fetchMainnetRealms() {
    console.log("FETCHING");
    const realms = await getRealms(mainnet_connection, programId);
    console.log(realms);
    setMainnetRealms(realms);
  }

  // async function getRealmMembers(realmPk) {
  //   const members = await getAllTokenOwnerRecords(
  //     connection,
  //     programId,
  //     realmPk
  //   );
  //   console.log("Realm members for ", realmPk.toString(), ": ", members);
  // }

  gun.on("auth", (ack) => {
    //console.log(gunUser.get("alias"), " authentication was successful: ", ack);
    setUser(gunUser?.is);
  });

  const signOut = () => {
    gunUser.leave((obj) => console.log(obj));
    setUser(gunUser?.is);
  };

  return user === undefined ? (
    <Router>
      <Routes>
        <Route
          path="sign-in"
          element={<SignIn gun={gun} user={gunUser} setUser={setUser} />}
        />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </Router>
  ) : (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <App
              gun={gun}
              network={network}
              changeNetwork={changeNetwork}
              signOut={signOut}
              devnetRealms={devnetRealms}
              mainnetRealms={mainnetRealms}
            />
          }
        >
          <Route path="/realms">
            <Route
              path=":realmId"
              element={
                <Realm
                  gun={gun}
                  network={network}
                  devnetRealms={devnetRealms}
                  mainnetRealms={mainnetRealms}
                />
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

root.render(<Main />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
