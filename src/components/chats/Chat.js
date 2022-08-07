import Input from "../Input";
import { BiSend } from "react-icons/bi";
import { useEffect, useReducer, useState, useRef, useMemo } from "react";
import { ChatCommands } from "../../api/ChatCommands";
import Gun from "gun";
import Message from "./Message";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";

require("gun/sea");

const initialState = {
  chats: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "reset":
      return { chats: [] };
    default:
      return { chats: [...state.chats, action.payload] };
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
    console.log("Decryption running");
    const key = process.env.REACT_APP_TEMP_GUN_KEY;
    const decryptedM = await SEA.decrypt(ciphertext, key);
    return decryptedM;
  }

  useEffect(() => {
    gun
      .user()
      .get("alias")
      .once((name) => setUsername(name));
  }, []);

  useEffect(() => {
    const collectionChats = gun.get(collectionId);
    dispatch({ type: "reset" });
    collectionChats.map().on(async (m) => {
      const decrypted = await decrypt(m.message);
      dispatch({
        payload: {
          name: m.name,
          message: decrypted,
          createdAt: m?.createdAt,
          walletAddress: m.walletAddress,
        },
      });
    });
  }, [collectionId]);

  useEffect(() => {
    chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
  });

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

    return formattedMessages.reverse();
  }, [state.chats, collectionId]);

  function onChange(e) {
    setMessage(e.target.value);
  }

  const sendMessage = async (m) => {
    let userWallet, encrypted, newEncryptedMessage;
    gun
      .user()
      .map()
      .once(async (data, key) => {
        if (key === "wallet") {
          userWallet = data;
        }
      });
    if (m) {
      encrypted = await encrypt(m.message);
      newEncryptedMessage = { ...m, message: encrypted };
    } else {
      encrypted = await encrypt(message);
      newEncryptedMessage = {
        message: encrypted,
        name: username,
        createdAt: Date.now(),
        walletAddress: userWallet,
      };
    }
    // newEncryptedMessage is pushed to gun
    const collectionChats = gun.get(collectionId);
    collectionChats.set(newEncryptedMessage);
    setMessage("");
    if (!m) ChatCommands(message, connection, realmId, sendMessage, BOT_NAME);
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
      <div
        className="gap-4 flex flex-col w-full overflow-y-auto py-2"
        ref={chatsRef}
      >
        {/*Put the scroll bar always on the bottom*/}
        <InfiniteScroll
          dataLength={newMessagesArray.length}
          next={() => null}
          style={{
            display: "flex",
            gap: "15px",
            overflowY: "auto",
            padding: "0 10px",
            flexDirection: "column-reverse",
          }} //To put endMessage and loader to the top.
          inverse={true}
          hasMore={true}
          loader={<Loading />}
          scrollableTarget="scrollableDiv"
        >
          {newMessagesArray.map((m, index) => (
            <div key={m?.createdAt}>
              {
                // if the current message is on a new day, add a breakpoint (line) before it
                areSuccessive(
                  new Date(state.chats[index - 1]?.createdAt),
                  new Date(m?.createdAt)
                ) && (
                  <div
                    key={`hr-${index}`}
                    className="bg-white w-full h-0.5 rounded-full mb-4"
                  />
                )
              }
              <Message m={m} isUsers={m?.name === username} />
            </div>
          ))}
        </InfiniteScroll>
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
          <BiSend />
        </button>
      </div>
    </div>
  );
}
