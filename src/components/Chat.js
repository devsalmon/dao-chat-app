import Input from "./Input";
import { BiSend } from "react-icons/bi";
import { BsPersonCircle } from "react-icons/bs";
import { useEffect, useReducer, useState, useRef } from "react";

const initialState = {
  allChats: {},
};

function reducer(state, collectionChats) {
  return { allChats: { collectionChats, ...state.allChats } };
}

const Message = ({ m }) => {
  return (
    <div className="text-sm text-gray-400 overflow-y-auto">
      <div className="flex py-2 border-t border-gray-600">
        <div className="flex-none">
          {/* <BsPersonCircle className="w-10 h-10" /> */}
          <img
            // src={"https://ui-avatars.com/api/?name=" + m.name}
            src={"https://avatars.dicebear.com/api/male/" + m.name + ".svg"}
            className="w-10 h-10"
            alt="avatar"
          />
        </div>
        <div className="ml-5">
          <div>
            <span className="text-xs text-white" key={m.createdAt}>
              {m.name}
            </span>
            <span className="text-xs text-gray-600 ml-2">
              {new Date(m.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>{m.message}</div>
        </div>
      </div>
    </div>
  );
};

{
  /* <div className="bg-white rounded-lg p-2" key={m.createdAt}>
        {m.message}
      </div> */
}

export default function Chat({ gun, collectionId }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

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
      name: username,
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
    <div className="h-full w-full flex-1 flex flex-col justify-between">
      <div
        ref={chatsRef}
        //className="flex flex-col w-full gap-4 overflow-y-auto py-2"
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
