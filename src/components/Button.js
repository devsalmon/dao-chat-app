export default function Button({ onClick, colour, ...props }) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#03E1FF] px-4 py-2 hover:opacity-75 bg-${colour} text-black rounded-full`}
    >
      {props.children}
    </button>
  );
}
