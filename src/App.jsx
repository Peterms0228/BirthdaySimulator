import { useState } from 'react'
import './App.css'
import Phase1 from './components/Phase1'
import Phase2 from './components/Phase2'
import Marquee from "react-fast-marquee";

function App() {
  const [phase, setPhase] = useState(1)

  return (
    <>
      {phase === 1 && <Phase1 onStart={() => setPhase(2)} />}
      {phase === 2 && <Phase2 />}
    </>
  )
}

export default App
