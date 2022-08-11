export default function Logo() {
  return (
    <div className="text-6xl text-[#03E1FF] bg-black md:w-[50vw] p-4 rounded-xl mx-auto flex justify-center gap-6  items-center">
      <div className="flex items-center">
        <div>D</div>
        <img src="dao-chat-logoA.png" className="w-14 h-14" alt="logo" />
        <div>O</div>
      </div>
      <div className="flex items-center">
        <div>C</div>
        <div>H</div>
        <img src="dao-chat-logoA.png" className="w-14 h-14" alt="logo" />
        <div>T</div>
      </div>
    </div>
  );
}
