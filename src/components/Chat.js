import MessageInput from "./MessageInput";
import { useEffect, useReducer, useState } from "react";

const initialState = {
  messages: [],
};

function reducer(state, message) {
  return { messages: [message, ...state.messages] };
}

export default function Chat({ gun }) {
  const [formState, setForm] = useState({
    name: "",
    message: "",
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const messages = gun.get("messages");
    messages.map().on((m) => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt,
      });
    });
  }, []);

  return (
    <div className="flex flex-col justify-between h-full w-full gap-4">
      <div>Chat </div>
      <MessageInput gun={gun} formState={formState} setForm={setForm} />
    </div>
  );
}
