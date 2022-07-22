import { BiSend } from "react-icons/bi";

export default function MessageInput({ gun, formState, setForm }) {
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
    <div className="relative w-full flex items-center justify-end shadow-lg">
      <input
        className="w-full rounded-full p-2 pr-8"
        onChange={onChange}
        placeholder="Message"
        name="message"
        value={formState.message}
      />
      <div
        onClick={saveMessage}
        className="absolute p-2 cursor-pointer hover:scale-110 transition-all duration-200"
      >
        <BiSend />
      </div>
    </div>
  );
}
