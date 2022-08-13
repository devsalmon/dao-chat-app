import React, { useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import RealmInfo from "./components/RealmInfo";
import reportWebVitals from "./reportWebVitals";
import Gun from "gun";
import "gun/sea";
import SignIn from "./pages/SignIn";
import { programId } from "./constants.js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Realm from "./pages/Realm";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import {
  getCertifiedRealmInfos,
  getUnchartedRealmInfos,
} from "./realms/Realms";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  CoinbaseWalletAdapter,
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  createDefaultAuthorizationResultCache,
  SolanaMobileWalletAdapter,
} from "@solana-mobile/wallet-adapter-mobile";
import { Toaster } from "react-hot-toast";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const root = createRoot(document.getElementById("root"));

// initialize gun locally
// sync with as many peers as you would like by passing in an array of network uris
const gun = Gun({
  peers: ["https://dao-chat-server.herokuapp.com/gun"],
});
const gunUser = gun.user().recall({ sessionStorage: true });

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
  const [currentProposal, setCurrentProposal] = useState();
  const [showSidebar, setShowSidebar] = useState(true);

  gun.on("auth", (ack) => {
    //console.log(gunUser.get("alias"), " authentication was successful: ", ack);
    console.log("SIGNED IN");
    setUser(gunUser?.is);
  });

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

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
  };

  const signOut = () => {
    gunUser.leave((obj) => console.log(obj));
    setUser(gunUser?.is);
  };

  return user === undefined ? (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <Routes>
              <Route
                path="sign-in"
                element={<SignIn gun={gun} user={gunUser} setUser={setUser} />}
              />
              <Route path="*" element={<Navigate to="/sign-in" replace />} />
            </Routes>
          </Router>
          <Toaster />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
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
              currentProposal={currentProposal}
              setCurrentProposal={setCurrentProposal}
              showSidebar={showSidebar}
              setShowSidebar={setShowSidebar}
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
                  realms={realms}
                  currentProposal={currentProposal}
                  setCurrentProposal={setCurrentProposal}
                  showSidebar={showSidebar}
                  setShowSidebar={setShowSidebar}
                />
              }
            />
            <Route
              path=":realmId/info"
              element={
                <RealmInfo
                  gun={gun}
                  network={network}
                  realms={realms}
                  showSidebar={showSidebar}
                  setShowSidebar={setShowSidebar}
                />
              }
            />
            <Route
              path=":realmId/:channelId"
              element={
                <Realm
                  gun={gun}
                  network={network}
                  realms={realms}
                  currentProposal={currentProposal}
                  setCurrentProposal={setCurrentProposal}
                  showSidebar={showSidebar}
                  setShowSidebar={setShowSidebar}
                />
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

root.render(<Main />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
