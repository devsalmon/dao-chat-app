import { BiSend } from "react-icons/bi";
import Input from "./Input";
import { useState } from "react";

export default function MessageInput({ gun, sendMessage, collectionId }) {
  const [message, setMessage] = useState("");

  function onChange(e) {
    setMessage(e.target.value);
  }
  return (
    <form className="relative w-full flex items-center justify-end shadow-lg">
      <Input onChange={onChange} placeholder="Send Message..." name="message" />
      <button
        onClick={() => sendMessage(message)}
        type="submit"
        className="absolute p-2 cursor-pointer hover:scale-110 transition-all duration-200"
      >
        <BiSend />
      </button>
    </form>
  );
}
