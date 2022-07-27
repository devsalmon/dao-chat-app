import Input from "./Input";
import { BiSend } from "react-icons/bi";
import { BsPersonCircle } from "react-icons/bs";
import { useEffect, useReducer, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const initialState = {
  allChats: {},
};

function reducer(state, collectionChats) {
  return { allChats: { collectionChats, ...state.allChats } };
}

const Message = ({ m }) => {
  const formatDate = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth();
    return `${hours}:${minutes}, ${day}/${month}`;
  };

  return (
    <div className="flex items-center py-2 gap-2 border-t border-gray-600 text-sm text-gray-400">
      <div className="flex-none">
        <img
          src={"https://avatars.dicebear.com/api/male/" + m.name + ".svg"}
          className="w-10 h-10"
          alt="avatar"
        />
      </div>
      <div>
        <div className="flex gap-2 items-center">
          {m.name && (
            <span className="text-xs text-white" key={m.createdAt}>
              {m.name}
            </span>
          )}
          <span className="text-xs text-gray-600">
            {formatDate(new Date(m.createdAt))}
          </span>
        </div>
        <div>{m.message}</div>
      </div>
    </div>
  );
};

export default function Chat({ gun, collectionId }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [newChat, setNewChat] = useState(false);

  const chatsRef = useRef();

  // const collectionChats = gun.get(collectionId);
  // collectionChats.map().on((m) => {
  //   setNewChat(!newChat);
  // });

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
    <div className="h-full w-full flex flex-col justify-end">
      <ul ref={chatsRef} className="flex flex-col w-full overflow-y-auto py-2">
        {state.allChats[collectionId] &&
          state.allChats[collectionId].map((m) => (
            <li>
              <Message key={m.createdAt} m={m} />
            </li>
          ))}
      </ul>
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
