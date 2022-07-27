import React, { useEffect, useState } from "react";
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

const root = createRoot(document.getElementById("root"));

// initialize gun locally
// sync with as many peers as you would like by passing in an array of network uris
const gun = Gun({
  peers: ["http://localhost:3030/gun"],
});
const gunUser = gun.user(); //.recall({ sessionStorage: true });

function Main() {
  const [user, setUser] = useState(gunUser?.is);

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
        <Route path="/" element={<App gun={gun} signOut={signOut} />}>
          <Route path="/realms">
            <Route path=":realmId" element={<Realm gun={gun} />} />
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
