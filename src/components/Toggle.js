export default function Toggle({ enabled, setEnabled, text }) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden">
      <div className="flex">
        <label className="inline-flex relative items-center mr-5 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            readOnly
          />
          <div
            onClick={() => {
              setEnabled(!enabled);
            }}
            className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-cyan-500  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"
          ></div>
          <span className="ml-2 text-sm font-medium">{text}</span>
        </label>
      </div>
    </div>
  );
}
