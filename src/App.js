import React, { useEffect, useReducer, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Gun from "gun";
import "./App.css";
import SideBar from "./components/SideBar";
import { getAllTokenOwnerRecords } from "@solana/spl-governance";
import mainnetBetaRealms from "./mainnet-beta.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import SignIn from "./pages/SignIn";
import Chat from "./pages/Chat";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
