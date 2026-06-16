export default function ChirpyPoster() {
  return (
    <div className="w-full bg-purple-950 shadow-xl h-30 flex justify-center items-center">
      <textarea
        className="h-20 shadow-xl ring-2 ring-purple-400 bg-white rounded-xl p-2"
        placeholder="What are you thinking?"
      ></textarea>
    </div>
  );
}
