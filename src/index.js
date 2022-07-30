import React, { useEffect, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Gun from "gun";
import "gun/sea";
import SignIn from "./pages/SignIn";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Realm from "./pages/Realm";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import {
  getCertifiedRealmInfos,
  getUnchartedRealmInfos,
} from "./realms/Realms";

const root = createRoot(document.getElementById("root"));

// initialize gun locally
// sync with as many peers as you would like by passing in an array of network uris
const gun = Gun({
  peers: ["https://dao-chat-server.herokuapp.com/gun"],
});
const gunUser = gun.user().recall({ sessionStorage: true });

const programId = new PublicKey("GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw");

function Main() {
  const [user, setUser] = useState(gunUser?.is);
  const [network, setNetwork] = useState(
    localStorage.getItem("network") ?? "devnet"
  );
  const [connection, setConnection] = useState(
    new Connection(
      clusterApiUrl(localStorage.getItem("network") ?? "devnet"),
      "recent"
    )
  );
  const [realms, setRealms] = useState([]);
  const [loading, setLoading] = useState(true);

  // only fetch realms when connection changes (i.e. devnet to mainnet or vice versa)
  useMemo(async () => {
    setLoading(true);
    if (connection) {
      let certified;
      try {
        certified = await getCertifiedRealmInfos(
          connection.rpcEndpoint.includes("devnet") ? "devnet" : "mainnet"
        );
        const unchartered = await getUnchartedRealmInfos(connection);
        setRealms([...certified, ...unchartered]);
        setLoading(false);
      } catch (e) {
        if (certified) setRealms(certified);
        console.log(e);
        setLoading(false);
      }
    }
  }, [connection]);

  // change to devnet or vice versa
  const changeNetwork = () => {
    if (network == "devnet") {
      setNetwork("mainnet-beta");
      setConnection(new Connection(clusterApiUrl("mainnet-beta"), "recent"));
      localStorage.setItem("network", "mainnet-beta");
    } else {
      setNetwork("devnet");
      setConnection(new Connection(clusterApiUrl("devnet"), "recent"));
      localStorage.setItem("network", "devnet");
    }
    window.location.href = "/";
  };

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
              connection={connection}
              programId={programId}
              changeNetwork={changeNetwork}
              signOut={signOut}
              realms={realms}
              loading={loading}
            />
          }
        >
          <Route path="/realms">
            <Route
              path=":realmId"
              element={<Realm gun={gun} network={network} realms={realms} />}
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
