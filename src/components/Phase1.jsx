export default function Phase1({ onStart }) {
  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <button
        className="text-white text-xl bg-pink-600 px-6 py-3 rounded-xl hover:bg-pink-500 transition animate-bounce"
        onClick={onStart}
      >
        Start
      </button>
    </div>
  )
}