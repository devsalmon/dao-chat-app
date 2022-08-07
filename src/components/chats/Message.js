import moment from "moment";

export default function Message({ m, isUsers }) {
  const getAvatar = (isBot) => {
    return !isBot
      ? "https://avatars.dicebear.com/api/male/" + m.name + ".svg"
      : "https://avatars.dicebear.com/api/bottts/" + m.name + ".svg";
  };

  const formatDate = (date) => {
    return moment(date).calendar();
  };

  const link = `https://explorer.solana.com/address/${m.walletAddress ?? ""}`;

  return (
    <div className={`flex flex-col gap-1 ${isUsers ? `items-end` : ``}`}>
      <div className="text-xxs text-white">
        {formatDate(new Date(m.createdAt))}
      </div>
      <div
        className={`flex relative mr-auto max-w-[90%] py-2 gap-2 px-2 shadow-lg bg-gray-600 rounded-lg text-sm text-gray-400 ${
          isUsers && ` ml-auto !mr-0 bg-gray-500`
        }`}
      >
        <a className="flex-none" href={link} target="_blank" rel="noreferrer">
          <img
            src={getAvatar(m.isBot || false)}
            className="w-10 h-10 hover:animate-bounce"
            alt="avatar"
          />
        </a>
        <div className="w-full relative break-words overflow-auto">
          {m.name && (
            <span className="text-xs text-white" key={m.createdAt}>
              {m.name}
            </span>
          )}
          <div>{m.message}</div>
        </div>
      </div>
    </div>
  );
}
