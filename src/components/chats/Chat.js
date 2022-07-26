import Input from "../Input";
import { useEffect, useReducer, useState, useRef, useMemo } from "react";
import { ChatCommands } from "../../api/ChatCommands";
import Gun from "gun";
import Message from "./Message";
import moment from "moment";

require("gun/sea");

const initialState = {
  chats: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "reset":
      return { chats: [] };
    default:
      return { chats: [action.payload, ...state.chats] };
  }
}

export default function Chat({
  gun,
  collectionId,
  realmId,
  connection,
  realmName,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [hideAddress, setHideAddress] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [limit, setLimit] = useState(10);
  const BOT_NAME = realmName + " bot";

  const chatsRef = useRef();

  // Encryption functions
  const SEA = Gun.SEA;
  async function encrypt(plaintext) {
    console.log("Encryption running");
    const key = process.env.REACT_APP_TEMP_GUN_KEY;
    const encryptedM = await SEA.encrypt(plaintext, key);
    return encryptedM;
  }

  async function decrypt(ciphertext) {
    const key = process.env.REACT_APP_TEMP_GUN_KEY;
    const decryptedM = await SEA.decrypt(ciphertext, key);
    return decryptedM;
  }

  useEffect(() => {
    gun
      .user()
      .get("alias")
      .once((name) => setUsername(name));
    gun
      .user()
      .get("wallet")
      .once((wallet) => setWalletAddress(wallet));
    gun
      .user()
      .get("hideAddress")
      .once((hide) => setHideAddress(hide));
  }, []);

  useEffect(() => {
    dispatch({ type: "reset" });
    gun
      .get(collectionId)
      .map()
      .on(async (m) => {
        const decrypted = await decrypt(m.message);
        dispatch({
          payload: {
            name: m.name,
            message: decrypted,
            createdAt: m?.createdAt,
            walletAddress: m.walletAddress,
            hideAddress: m.hideAddress ?? false,
            isBot: m.isBot ?? false,
          },
        });
      });
  }, [collectionId]);

  function compareTimestamp(a, b) {
    if (a.createdAt < b.createdAt) {
      return -1;
    }
    if (a.createdAt > b.createdAt) {
      return 1;
    }
    return 0;
  }

  // remove duplicate messages
  const newMessagesArray = useMemo(() => {
    const formattedMessages = state.chats.filter((value, index) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        state.chats.findIndex((obj) => {
          return JSON.stringify(obj) === _value;
        })
      );
    });

    return formattedMessages.sort(compareTimestamp).reverse().splice(0, limit);
  }, [state.chats, limit, collectionId]);

  useEffect(() => {
    chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
  }, [state.chats]);

  const onScroll = (e) => {
    if (
      e.target.scrollTop <=
      e.target.offsetHeight - e.target.scrollHeight + 50
    ) {
      console.log("REFRESH");
      setLimit(limit + 10);
    }
  };

  function onChange(e) {
    setMessage(e.target.value);
  }

  const sendMessage = async (m) => {
    // don't pass in event as argument
    let encrypted, newEncryptedMessage;
    if (m) {
      encrypted = await encrypt(m.message);
      newEncryptedMessage = { ...m, message: encrypted };
    } else {
      encrypted = await encrypt(message);
      newEncryptedMessage = {
        message: encrypted,
        name: username,
        walletAddress: walletAddress,
        hideAddress: hideAddress,
        createdAt: Date.now(),
      };
    }
    console.log(newEncryptedMessage);
    // newEncryptedMessage is pushed to gun
    const collectionChats = gun.get(collectionId);
    collectionChats.set(newEncryptedMessage);
    setMessage("");
    if (!m) ChatCommands(message, connection, realmId, sendMessage, BOT_NAME);
    chatsRef.current.scrollTop = chatsRef.current.scrollHeight + 50;
  };

  const submit = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const areSuccessive = (day1, day2) => {
    return moment(day2).add(1, "days").date() === moment(day1).date();
  };

  return (
    <div className="h-full w-full flex flex-col justify-end">
      <div
        id="scrollableDiv"
        className="flex flex-col-reverse w-full overflow-y-auto py-2"
        ref={chatsRef}
        onScroll={onScroll}
      >
        {newMessagesArray &&
          newMessagesArray.map((m, index) => (
            <div key={m?.createdAt}>
              {
                // if the current message is on a new day, add a breakpoint (line) before it
                areSuccessive(
                  new Date(m?.createdAt),
                  new Date(newMessagesArray[index + 1]?.createdAt)
                ) && (
                  <div
                    key={`hr-${index}`}
                    className="bg-white w-full h-0.5 rounded-full mt-1 mb-2"
                  />
                )
              }
              <Message m={m} isUsers={m?.name === username} />
            </div>
          ))}
      </div>
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
          <img src={"/dao-chat-logo2.png"} className="w-4 h-4" alt="" />
        </button>
      </div>
    </div>
  );
}
