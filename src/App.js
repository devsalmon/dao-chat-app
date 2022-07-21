import { useEffect, useReducer, useState } from "react";
import Gun from "gun";
import "./App.css";

const gun = Gun({
  peers: ["https://localhost:3030/gun"],
});

const initialState = {
  messages: [],
};

function reducer(state, message) {
  return { messages: [message, ...state.messages] };
}

export default function App() {
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

  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value });
  }

  function saveMessage() {
    const messages = gun.get("messages");
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: Date.now(),
    });
    setForm({ name: "", message: "" });
  }

  return (
    <div className="App">
      <input
        onChange={onChange}
        placeholder="Name"
        name="name"
        value={formState.name}
      />
      <input
        onChange={onChange}
        placeholder="Message"
        name="message"
        value={formState.message}
      />
      <button onClick={saveMessage}>Send message</button>
      {state.messages.map((message) => (
        <div key={message.createdAt}>
          <div>{message.message}</div>
          <div>From: {message.name}</div>
          <div>Date: {message.createdAt}</div>
        </div>
      ))}
    </div>
  );
}
