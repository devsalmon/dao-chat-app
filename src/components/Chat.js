import Input from "./Input";
import { BiSend } from "react-icons/bi";
import { useEffect, useReducer, useState, useRef } from "react";
import { getTreasuryBalance } from "../governance-functions/Data";
import moment from "moment";

const initialState = {
  allChats: {},
};

function reducer(state, collectionChats) {
  return { allChats: { collectionChats, ...state.allChats } };
}

const Message = ({ m, isUsers }) => {
  const getAvatar = (isBot) => {
    return !isBot
      ? "https://avatars.dicebear.com/api/male/" + m.name + ".svg"
      : "https://avatars.dicebear.com/api/bottts/" + m.name + ".svg";
  };

  const formatDate = (date) => {
    return moment(date).calendar();
  };

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
        <div className="flex-none">
          <img
            src={getAvatar(m.isBot || false)}
            className="w-10 h-10"
            alt="avatar"
          />
        </div>
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
};

export default function Chat({
  gun,
  collectionId,
  realmId,
  connection,
  realmName,
  channelName,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [newChat, setNewChat] = useState(false);
  const BOT_NAME = realmName + " bot";

  const chatsRef = useRef();

  useEffect(() => {
    gun
      .user()
      .get("alias")
      .once((name) => setUsername(name));
  }, []);

  useEffect(() => {
    const collectionChats = gun.get(collectionId);
    let chats = state.allChats;
    // if the realm doesn't already have a chat, create a new object in the chats collection with the realmId as the key
    if (!chats[collectionId]) {
      chats[collectionId] = [];
    }

    collectionChats.map().on((m) => {
      if (!chats[collectionId].find((c) => c.createdAt === m.createdAt)) {
        chats[collectionId].push({
          name: m.name,
          message: m.message,
          createdAt: m.createdAt,
        });
        dispatch(chats);
      }
    });
  }, [collectionId, newChat]);

  useEffect(() => {
    chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
  });

  function onChange(e) {
    setMessage(e.target.value);
  }

  const sendMessage = async (m) => {
    const newMessage = m || {
      message: message,
      name: username,
      createdAt: Date.now(),
    };
    const collectionChats = gun.get(collectionId);
    collectionChats.set(newMessage);
    let chats = state.allChats;
    chats[collectionId].push(newMessage);
    setMessage("");
    dispatch(chats);
    if (newMessage.message === "/treasury") {
      let treasuryBalance = await getTreasuryBalance(connection, realmId);
      treasuryBalance = treasuryBalance + " SOL";
      sendMessage({
        message: treasuryBalance,
        name: BOT_NAME,
        createdAt: Date.now(),
        isBot: true,
      });
    }
  };

  const submit = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const areSuccessive = (day1, day2) => {
    return moment(day1).add(1, "days").date() === moment(day2).date();
  };

  return (
    <div className="h-full w-full flex flex-col justify-end">
      <ul
        ref={chatsRef}
        className="flex flex-col gap-4 w-full overflow-y-auto py-2"
      >
        {state.allChats[collectionId] &&
          state.allChats[collectionId].map((m, index) => (
            <li key={m.createdAt}>
              {
                // if the current message is on a new day, add a breakpoint (line) before it
                areSuccessive(
                  new Date(state.allChats[collectionId][index - 1]?.createdAt),
                  new Date(m.createdAt)
                ) && (
                  <div
                    key={`hr-${index}`}
                    className="bg-white w-full h-0.5 rounded-full mb-4"
                  />
                )
              }
              <Message m={m} isUsers={m?.name === username} />
            </li>
          ))}
      </ul>
      <div className="relative w-full flex items-center justify-end shadow-lg pt-4">
        <Input
          onChange={onChange}
          placeholder="Send Message..."
          name="message"
          value={message}
          onKeyDown={submit}
        />
        <button
          onClick={() => sendMessage()}
          className="absolute p-2 cursor-pointer hover:scale-110 transition-all duration-200"
        >
          <BiSend />
        </button>
      </div>
    </div>
  );
}
