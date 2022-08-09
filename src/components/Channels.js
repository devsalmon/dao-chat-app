import React, { useEffect, useState } from "react";
import { getProposals } from "../api/Proposals";
import { PublicKey } from "@solana/web3.js";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const ProposalList = ({
  proposals,
  show,
  currentProposal,
  loading,
  clickProposal,
}) => {
  return (
    <ul
      className={`px-2 transition-all duration-200 ease-in-out ${
        show ? `max-h-[500px] overflow-auto pb-2` : `max-h-0 overflow-hidden`
      }`}
    >
      {proposals.map((x) => (
        <li
          key={x.pubkey?.toString()}
          className={`cursor-pointer text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900 ${
            currentProposal?.pubkey?.toString() === x.pubkey?.toString() &&
            `bg-gray-900 text-gray-200`
          }`}
          onClick={() => clickProposal(x)}
        >
          <div className="flex w-full items-center">
            <span className="text-xl">#</span>
            <div className="ml-2" title={x.account.name}>
              {x.account?.name.substring(0, 10)}
            </div>
          </div>
        </li>
      ))}
      {loading &&
        Array.from(Array(10).keys()).map((x) => (
          <div
            key={x}
            className="w-full h-6 animate-pulse bg-gray-500 my-2 rounded-full"
          ></div>
        ))}
    </ul>
  );
};

export default function Channels({
  gun,
  realmId,
  connection,
  programId,
  currentProposal,
  setCurrentProposal,
  setShowChannel,
}) {
  const [activeProposals, setActiveProposals] = useState([]);
  const [pastProposals, setPastProposals] = useState([]);
  const [showActiveProposals, setShowActiveProposals] = useState(true);
  const [showPastProposals, setShowPastProposals] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParts = window.location.href.split("/");
    const currentProposalId = urlParts[urlParts.length - 1];
    let current = activeProposals.find(
      (p) => p.pubkey.toString() === currentProposalId
    );
    if (!current)
      current = pastProposals.find(
        (p) => p.pubkey.toString() === currentProposalId
      );
    setCurrentProposal(current);
  }, []);

  useEffect(() => {
    setActiveProposals([]);
    setPastProposals([]);
    setLoading(true);

    async function fetchProposals() {
      let proposals = await getProposals(
        connection,
        programId,
        new PublicKey(realmId)
      );
      proposals.forEach((x) => {
        if (x?.length > 0) {
          x.forEach((proposal) => {
            // state of 2 means proposal is active
            if (proposal.account.state === 2) {
              setActiveProposals((current) => [
                ...current.filter(
                  (p) => p?.pubkey.toString() !== proposal?.pubkey.toString()
                ),
                proposal,
              ]);
            } else {
              setPastProposals((current) => [
                ...current.filter(
                  (p) => p?.pubkey.toString() !== proposal?.pubkey.toString()
                ),
                proposal,
              ]);
            }
          });
        }
      });
      setLoading(false);
    }

    if (realmId && realmId !== "") fetchProposals();
  }, [connection, programId, realmId]);

  const clickProposal = (p) => {
    if (currentProposal === p) setShowChannel(false);
    setCurrentProposal(p);
    navigate(`/realms/${realmId.toString()}/${p.pubkey?.toString()}`);
  };

  return (
    <div className="w-max h-full overflow-auto py-2 text-sm">
      <ul className="px-2 py-3">
        <li
          className={`text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900 ${
            currentProposal === "info" && `bg-gray-900 text-gray-200`
          }`}
        >
          <div
            onClick={() => {
              setCurrentProposal("info");
              navigate(`/realms/${realmId.toString()}/info`);
            }}
            className="flex w-full cursor-pointer items-center"
          >
            <span className="text-xl">#</span>
            <div className="ml-2">info</div>
          </div>
        </li>
        <li
          className={` text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900 ${
            (currentProposal === "" || currentProposal === null) &&
            `bg-gray-900 text-gray-200`
          }`}
        >
          <div
            className="cursor-pointer flex w-full items-center"
            onClick={() => {
              setCurrentProposal("");
              navigate(`/realms/${realmId.toString()}`);
            }}
          >
            <span className="text-xl">#</span>
            <div className="ml-2">main</div>
          </div>
        </li>
      </ul>

      <button
        onClick={() => setShowActiveProposals(!showActiveProposals)}
        className="flex items-center text-gray-500 hover:text-gray-200 pb-2"
      >
        {showActiveProposals ? <HiChevronUp /> : <HiChevronDown />}
        <h3 className="uppercase tracking-wide font-semibold text-xs">
          Active Proposals
        </h3>
      </button>

      <ProposalList
        proposals={activeProposals}
        loading={loading}
        show={showActiveProposals}
        currentProposal={currentProposal}
        clickProposal={clickProposal}
      />

      <button
        onClick={() => setShowPastProposals(!showPastProposals)}
        className="flex items-center text-gray-500 hover:text-gray-200 pb-2"
      >
        {showPastProposals ? <HiChevronUp /> : <HiChevronDown />}
        <h3 className="uppercase tracking-wide font-semibold text-xs">
          Past Proposals
        </h3>
      </button>
      <ProposalList
        proposals={pastProposals}
        loading={loading}
        show={showPastProposals}
        currentProposal={currentProposal}
        clickProposal={clickProposal}
      />
    </div>
  );
}
