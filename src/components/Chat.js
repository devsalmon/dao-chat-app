import Input from "./Input";
import { BiSend } from "react-icons/bi";
import { useEffect, useReducer, useState, useRef } from "react";

const initialState = {
  allChats: {},
};

function reducer(state, collectionChats) {
  return { allChats: { collectionChats, ...state.allChats } };
}

const Message = ({ m }) => {
  return (
    <div className="bg-white rounded-lg p-2" key={m.createdAt}>
      {m.message}
    </div>
  );
};

export default function Chat({ gun, collectionId }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [message, setMessage] = useState("");

  const chatsRef = useRef();

  useEffect(() => {
    const collectionChats = gun.get(collectionId);
    let chats = state.allChats;
    if (!chats[collectionId]) {
      chats[collectionId] = [];
    }
    collectionChats.map().once((m) => {
      if (!chats[collectionId].find((c) => c.createdAt === m.createdAt)) {
        chats[collectionId].push({
          name: m.name,
          message: m.message,
          createdAt: m.createdAt,
        });
      }
    });
    dispatch(chats);
  }, [collectionId, gun]);

  useEffect(() => {
    chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
  });

  function onChange(e) {
    setMessage(e.target.value);
  }

  const sendMessage = () => {
    const newMessage = {
      message: message,
      createdAt: Date.now(),
    };
    const collectionChats = gun.get(collectionId);
    collectionChats.set(newMessage);
    let chats = state.allChats;
    chats[collectionId].push(newMessage);
    setMessage("");
    dispatch(chats);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div
        ref={chatsRef}
        className="flex flex-col w-full gap-4 overflow-y-auto py-2"
      >
        {state.allChats[collectionId] &&
          state.allChats[collectionId].map((m) => <Message m={m} />)}
      </div>
      <div className="relative w-full flex items-center justify-end shadow-lg pt-4">
        <Input
          onChange={onChange}
          placeholder="Send Message..."
          name="message"
          value={message}
        />
        <button
          onClick={sendMessage}
          className="absolute p-2 cursor-pointer hover:scale-110 transition-all duration-200"
        >
          <BiSend />
        </button>
      </div>
    </div>
  );
}
