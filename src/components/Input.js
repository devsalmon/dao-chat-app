export default function Input({
  placeholder,
  onKeyDown,
  onChange,
  name,
  value,
  type,
}) {
  return (
    <input
      className="w-full border border-gray-800 rounded-full px-4 py-2 pr-8 text-black placeholder:text-gray-500"
      placeholder={placeholder}
      onChange={onChange}
      name={name}
      value={value}
      type={type}
      onKeyDown={onKeyDown}
    />
  );
}
