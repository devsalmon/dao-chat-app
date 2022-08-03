import React, { useEffect, useState } from "react";
import { getProposals } from "../governance-functions/Proposals";
import { PublicKey } from "@solana/web3.js";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Channels({ gun, realmId, connection, programId }) {
  const [activeProposals, setActiveProposals] = useState([]);
  const [pastProposals, setPastProposals] = useState([]);
  const [showActiveProposals, setShowActiveProposals] = useState(true);
  const [showPastProposals, setShowPastProposals] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeChannel, setActiveChannel] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParts = window.location.href.split("/");
    setActiveChannel(urlParts[urlParts.length - 1]);
    console.log(urlParts[urlParts.length - 1]);
  });

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
              setActiveProposals((current) => [...current, proposal]);
            } else {
              setPastProposals((current) => [...current, proposal]);
            }
          });
        }
      });
      setLoading(false);
    }

    fetchProposals();
  }, [connection, programId, realmId]);

  return (
    <div className="w-max h-full py-2 text-sm">
      <ul className="px-2 py-3">
        <li
          className={`text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900 ${
            activeChannel === "welcome" && `bg-gray-900 text-gray-200`
          }`}
        >
          <div
            onClick={() => navigate(`/realms/${realmId.toString()}/welcome`)}
            className="flex w-full cursor-pointer items-center"
          >
            <span className="text-xl">#</span>
            <div className="ml-2">welcome</div>
          </div>
        </li>
        <li
          className={` text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900 ${
            activeChannel === realmId.toString() && `bg-gray-900 text-gray-200`
          }`}
        >
          <div
            className="cursor-pointer flex w-full items-center"
            onClick={() => navigate(`/realms/${realmId.toString()}`)}
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

      <ul
        className={`px-2 transition-all duration-200 ease-in-out ${
          showActiveProposals
            ? `max-h-[500px] overflow-auto pb-2`
            : `max-h-0 overflow-hidden`
        }`}
      >
        {activeProposals.map((x) => (
          <li
            key={x.pubkey?.toString()}
            className={`cursor-pointer text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900 ${
              activeChannel === x.pubkey?.toString() &&
              `bg-gray-900 text-gray-200`
            }`}
            onClick={() =>
              navigate(`/realms/${realmId.toString()}/${x.pubkey?.toString()}`)
            }
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

      <button
        onClick={() => setShowPastProposals(!showPastProposals)}
        className="flex items-center text-gray-500 hover:text-gray-200 pb-2"
      >
        {showPastProposals ? <HiChevronUp /> : <HiChevronDown />}
        <h3 className="uppercase tracking-wide font-semibold text-xs">
          Past Proposals
        </h3>
      </button>

      <ul
        className={`px-2 transition-all duration-200 ease-in-out ${
          showPastProposals
            ? `max-h-[500px] overflow-auto pb-2`
            : `max-h-0 overflow-hidden`
        }`}
      >
        {pastProposals.map((x) => (
          <li
            key={x.pubkey?.toString()}
            className={`cursor-pointer text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900 ${
              activeChannel === x.pubkey?.toString() &&
              `bg-gray-900 text-gray-200`
            }`}
            onClick={() =>
              navigate(`/realms/${realmId.toString()}/${x.pubkey?.toString()}`)
            }
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
    </div>
  );
}
