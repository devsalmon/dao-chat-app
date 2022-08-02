import React, { useEffect, useState } from "react";
import { getActiveProposals } from "../governance-functions/Proposals";
import { PublicKey } from "@solana/web3.js";
import { HiChevronDown } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Channels({ gun, realmId, connection, programId }) {
  const [proposalNames, setProposalNames] = useState([]);
  //const navigate = useNavigate();

  const goToRealm = (id) => {
    //setActiveRealm(id);
    //navigate(`/realms/${id}`);
  };

  useEffect(() => {
    console.log("running");

    setProposalNames([]);

    async function fetchProposals() {
      let proposals = await getActiveProposals(
        connection,
        programId,
        new PublicKey(realmId)
      );
      proposals[0].forEach((x) => {
        console.log("x:", x.account.name);
        setProposalNames((current) => [...current, x.account.name]);
      });
    }

    fetchProposals();
  }, [connection, programId, realmId]);

  return (
    <div className="w-max h-full py-2 text-sm">
      <ul className="px-2 py-3">
        <li className="text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900">
          <div className="flex items-center">
            <span className="text-xl">#</span>
            <button className="ml-2">welcome</button>
          </div>
        </li>
        <li className="text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900">
          <div className="flex items-center">
            <span className="text-xl">#</span>
            <button className="ml-2" onClick={goToRealm(realmId?.toString())}>
              main
            </button>
          </div>
        </li>
      </ul>

      <button className="flex items-center text-gray-500 hover:text-gray-200">
        <HiChevronDown />
        <h3 className="uppercase tracking-wide font-semibold text-xs">
          Proposals
        </h3>
      </button>

      <ul className="px-2 py-3">
        {proposalNames.map((x) => (
          <li className="text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900">
            <div className="flex items-center">
              <span className="text-xl">#</span>
              <button className="ml-2" title={x}>
                {x.substring(0, 10)}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
