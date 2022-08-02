import React, { useEffect, useState } from "react";
import { getActiveProposals } from "../governance-functions/Proposals";
import { PublicKey } from "@solana/web3.js";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Channels({ gun, realmId, connection, programId }) {
  const [proposals, setProposals] = useState([]);
  const [showProposals, setShowProposals] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setProposals([]);
    setLoading(true);

    async function fetchProposals() {
      let proposals = await getActiveProposals(
        connection,
        programId,
        new PublicKey(realmId)
      );
      proposals.forEach((x) => {
        if (x?.length > 0) {
          x.forEach((proposal) => {
            setProposals((current) => [...current, proposal]);
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
        <li className="text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900">
          <div
            onClick={() => navigate(`/realms/${realmId.toString()}/welcome`)}
            className="flex w-full cursor-pointer items-center"
          >
            <span className="text-xl">#</span>
            <div className="ml-2">welcome</div>
          </div>
        </li>
        <li className="text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900">
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
        onClick={() => setShowProposals(!showProposals)}
        className="flex items-center text-gray-500 hover:text-gray-200 pb-2"
      >
        {showProposals ? <HiChevronUp /> : <HiChevronDown />}
        <h3 className="uppercase tracking-wide font-semibold text-xs">
          Proposals
        </h3>
      </button>

      <ul
        className={`px-2 transition-all duration-200 ease-in-out ${
          showProposals
            ? `max-h-[500px] overflow-auto pb-20`
            : `max-h-0 overflow-hidden`
        }`}
      >
        {proposals.map((x) => (
          <li
            key={x.pubkey?.toString()}
            className="cursor-pointer text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900"
            onClick={() =>
              navigate(`/realms/${realmId.toString()}/${x.pubkey?.toString()}`)
            }
          >
            <div className="flex w-full items-center">
              <span className="text-xl">#</span>
              <div className="ml-2" title={x}>
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
