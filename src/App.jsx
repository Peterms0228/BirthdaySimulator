import { useState } from 'react'
import './App.css'
import Phase1 from './components/Phase1'
import Phase2 from './components/Phase2'
import Phase3 from './components/LightOffEffect'

function App() {
  const [phase, setPhase] = useState(2)

  return (
    <>
      {/* {phase === 1 && <Phase1 onStart={() => setPhase(2)} />} */}
      {phase === 2 && <Phase2 />}
    </>
  )
}

export default App
