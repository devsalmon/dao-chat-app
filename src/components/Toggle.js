import { AiOutlineInfoCircle } from "react-icons/ai";

export default function Toggle({ enabled, setEnabled, text }) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="flex">
        <div
          className="inline-flex relative items-center mr-5 cursor-pointer"
          onClick={() => {
            setEnabled(!enabled);
          }}
        >
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            readOnly
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-cyan-500  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          <span className="ml-2 text-sm font-medium">{text}</span>
          <div className="ml-2 group">
            <AiOutlineInfoCircle />
            <div className="invisible group-hover:visible right-0 bottom-10 absolute w-fit p-2 transition-all duration-200 bg-gray-400 rounded-md text-xs text-black">
              Prevent other users from viewing your wallet address
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
