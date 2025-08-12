import { useState } from 'react'

export default function Phase1({ onStart }) {
  const [userName, setUserName] = useState('');

  const handleStart = () => {
    onStart(userName.trim()); 
  };
  return (
    <div className="h-screen w-screen bg-grey flex items-center justify-center">
      <div class="grid grid-flow-col grid-rows-2">
        <div className="flex flex-col-1 items-center justify-center">
          <input type="text"
            placeholder="Enter name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="text-white text-xl px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 mb-4">
          </input>
        </div>
        <div className="flex flex-col-1 items-center justify-center">
          <button
            className="text-white text-xl bg-pink-600 px-6 py-3 rounded-xl transition animate-bounce"
            onClick={handleStart}>
            Start
          </button>
        </div>
      </div>
      
    </div>
  )
}