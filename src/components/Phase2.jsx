import Canvas from './Canvas'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import CandleItem from './CandleItem'
import LightOffEffect from './LightOffEffect'
import CandleLightEffect from './CandleLightEffect' 
import { useRef, useState } from 'react'

export default function Phase2() {
  const canvasRef = useRef()
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [spotVisible, setSpotVisible] = useState(false);
  const [positions, setPositions] = useState([]);
  const [clickCount, setClickCount] = useState(0);

  const lightOff = () => {
    setOverlayVisible(true);
    setTimeout(() => {
      canvasRef.current?.lightAll()
      const candleEls = Array.from(document.querySelectorAll('[id^="candle-"]'));
      const pos = Array.from(candleEls).map(el => {
        const r = el.getBoundingClientRect();
        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      });
      setPositions(pos);
      setSpotVisible(true);
    }, 500)
    document.getElementById('lightOffBtn').style.display = 'none';
    document.getElementById('candleItem').style.display = 'none';
    document.getElementById('lightOnBtn').style.display = 'block';
  }

  const lightOn = () => {
    setOverlayVisible(false);
    setTimeout(() => {
      setSpotVisible(false);
    }, 500)
    document.getElementById('lightOffBtn').style.display = 'block';
    document.getElementById('candleItem').style.display = 'block';
    document.getElementById('lightOnBtn').style.display = 'none';
  }

const rickRollClick = () => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 18) {
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      }
      return next;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
        <div className="h-screen w-screen bg-white overflow-y-hidden relative flex flex-col">
          {/* 🔝 Scroll-down arrow */}
          <button id="lightOffBtn" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 text-white bg-black bg-opacity-50 rounded-full p-2"
            onClick={lightOff}>
            ▼
          </button>

          {/* Candles light effect */}
          {spotVisible && <CandleLightEffect positions={positions} visible={spotVisible}/>}

          {/* Light off effect */}
          <LightOffEffect visible={overlayVisible} />

          {/* Body */}
           <div className="flex h-full">

            {/* Center: Canvas */}
            <div className="flex-1 relative bg-[url('./assets/cake.jpeg')] h-screen w-screen bg-contain bg-center bg-no-repeat" onClick={rickRollClick}>
              <Canvas ref={canvasRef}/>
            </div>
                    
            {/* Left: Candle */}
            <div id="candleItem" className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-20 text-white bg-opacity-50 rounded-full p-2">
              <CandleItem />
            </div>
            <button id="lightOnBtn" className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-20 text-white bg-black bg-opacity-50 rounded-full p-2" style={{ display: 'none' }}
              onClick={lightOn}>
              A
            </button>
          </div>

        </div>
    </DndProvider>
  )
}
