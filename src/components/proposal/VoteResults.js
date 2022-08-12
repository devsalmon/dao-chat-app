import { useState, useEffect, useMemo } from "react";
import BN from "bn.js";
import VoteResultsBar from "./VoteResultsBar";

export default function VoteResults({ proposal, governance }) {
  const [totalVoteCount, setTotalVoteCount] = useState(0);
  const [yesVotes, setYesVotes] = useState(0);
  const [noVotes, setNoVotes] = useState(0);

  const relativeYesVotes = useMemo(() => {
    return totalVoteCount === 0 ? 0 : (yesVotes / totalVoteCount) * 100;
  }, [totalVoteCount, yesVotes]);
  const relativeNoVotes = useMemo(() => {
    return totalVoteCount === 0 ? 0 : (noVotes / totalVoteCount) * 100;
  }, [totalVoteCount, noVotes]);

  useEffect(() => {
    const y = getTokenAmount(proposal.getYesVoteCount());
    const n = getTokenAmount(proposal.getNoVoteCount());
    setYesVotes(y);
    setNoVotes(n);
    setTotalVoteCount(y + n);
  }, [proposal]);

  function getTokenAmount(c, decimals) {
    if (c.bitLength() > 53) return c?.div(new BN(10000)).toNumber() || 0;
    return c.toNumber();
  }

  return (
    <div className="flex items-center space-x-4">
      {proposal ? (
        <div
          className={`bg-gray-900 text-gray-300 shadow-lg p-3 rounded-lg w-full`}
        >
          <div className="flex">
            <div className="w-1/2">
              <p>Yes Votes</p>
              <p className={`font-bold text-fgd-1`}>
                {yesVotes.toLocaleString()}
              </p>
              <div className="text-sm text-fgd-1">
                {relativeYesVotes?.toFixed(1)}%
              </div>
            </div>
            <div className="w-1/2 text-right">
              <p>No Votes</p>
              <p className={`font-bold text-fgd-1`}>
                {noVotes.toLocaleString()}
              </p>
              <div className="text-sm text-fgd-1">
                {relativeNoVotes?.toFixed(1)}%
              </div>
            </div>
          </div>
          <VoteResultsBar
            approveVotePercentage={relativeYesVotes}
            denyVotePercentage={relativeNoVotes}
          />
        </div>
      ) : (
        <>
          <div className="w-full h-12 rounded animate-pulse bg-bkg-3" />
        </>
      )}
    </div>
  );
}
