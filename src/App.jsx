import { useState } from 'react'
import './App.css'
import Phase1 from './components/Phase1'
import Phase2 from './components/Phase2'

function App() {
  const [phase, setPhase] = useState(1);
  const [userName, setUserName] = useState('');

  const handleStart = (name) => {
    setUserName(name);
    setPhase(2);
  };

  return (
    <>
      {phase === 1 && <Phase1 onStart={handleStart} />}
      {phase === 2 && <Phase2 userName={userName}/>}
    </>
  )
}

export default App
