export default function Logo() {
  return (
    <div className="lg:text-6xl text-2xl text-[#03E1FF] bg-black w-full p-4 rounded-xl mx-auto flex justify-center gap-6  items-center">
      <div className="flex items-center">
        <div>D</div>
        <img
          src="dao-chat-logoA.png"
          className="lg:w-14 lg:h-14 w-6 h-6"
          alt="logo"
        />
        <div>O</div>
      </div>
      <div className="flex items-center">
        <div>C</div>
        <div>H</div>
        <img
          src="dao-chat-logoA.png"
          className="lg:w-14 lg:h-14 w-6 h-6"
          alt="logo"
        />
        <div>T</div>
      </div>
    </div>
  );
}
