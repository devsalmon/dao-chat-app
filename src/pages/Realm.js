import Chat from "../components/Chat";
import { useEffect, useState } from "react";
import { useParams, Outlet } from "react-router-dom";
import "gun/lib/unset.js";
import Input from "../components/Input";

export default function Realm({ gun }) {
  let { realmId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [chats, setChats] = useState([]);
  const styles = {
    tabActive:
      "bg-gray-600 px-8 py-2 cursor-pointer rounded-lg shadow-sm shadow-black",
    tabInactive:
      "bg-gray-900 px-8 py-2 cursor-pointer rounded-lg shadow-inner shadow-black",
  };

  useEffect(() => {
    const savedChats = gun.get(realmId).get("chats");
    setChats([]);
    let CHATS = [];
    if (savedChats) {
      savedChats.map().on(function (c) {
        CHATS = CHATS.filter((item) => item?.timestamp !== c.timestamp);
        CHATS.push(c);
        setChats(CHATS);
      });
    }
    console.log(CHATS);
  }, [realmId]);

  const sendMessage = () => {
    const newChat = { message: "hello", user: "user", timestamp: Date.now() };
    gun.get(realmId).get("chats").set(newChat);
    setChats([...chats, newChat]);
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 relative">
      <h1 className="text-center text-white text-2xl">
        {realmId.substring(0, 10)}...
      </h1>
      <div className="flex flex-nowrap mx-auto w-max rounded-lg bg-black items-center justify-center text-gray-400">
        <div
          onClick={() => setActiveTab(0)}
          className={activeTab === 0 ? styles.tabActive : styles.tabInactive}
        >
          Chat
        </div>
        <div
          onClick={() => setActiveTab(1)}
          className={activeTab === 1 ? styles.tabActive : styles.tabInactive}
        >
          Voting
        </div>
      </div>
      {activeTab === 0 && (
        <div id="chat" className="text-white">
          {chats &&
            chats.map((c) => (
              <div key={c.timestamp}>
                {c.message}
                {c.timestamp}
              </div>
            ))}
          <div className="absolute bottom-0 backdrop-blur w-full">
            <Input placeholder="Send Message..." />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      {activeTab === 1 && <div id="voting" className=""></div>}
    </div>
  );
}
