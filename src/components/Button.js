export default function Button({ onClick, colour, ...props }) {
  return (
    <button
      onClick={onClick}
      className={`bg-cyan-500 px-4 py-2 hover:opacity-75 bg-${colour} rounded-full`}
    >
      {props.children}
    </button>
  );
}
