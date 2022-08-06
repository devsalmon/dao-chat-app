export default function Loading() {
  return (
    <div className="h-full w-full flex items-center justify-center gap-2">
      <div className="bg-white rounded-full h-2 w-2 animate-pulse"></div>
      <div className="bg-white rounded-full h-2 w-2 animate-pulse delay-50"></div>
      <div className=" bg-white rounded-full h-2 w-2 animate-pulse delay-75"></div>
    </div>
  );
}
