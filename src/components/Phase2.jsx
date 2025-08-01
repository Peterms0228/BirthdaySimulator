import Canvas from './Canvas'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useRef, useState, useEffect } from 'react'
import CandleItem from './CandleItem'
import LightOffEffect from './LightOffEffect'
import CandleLightEffect from './CandleLightEffect' 
import confetti from 'canvas-confetti';

export default function Phase2() {
  const canvasRef = useRef()
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [spotVisible, setSpotVisible] = useState(false)
  const [positions, setPositions] = useState([])
  const [animation, setAnimation] = useState(true)
  const [clickCount, setClickCount] = useState(0)
  const [meterValue, setMeterValue] = useState(0)
  const [listening, setListening] = useState(false)
  const audioCtxRef = useRef()
  const analyserRef = useRef()


  const lightOff = () => {
    setAnimation(true);
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
      playBgm();
    }, 500)
    document.getElementById('lightOffBtn').style.display = 'none';
    document.getElementById('candleItem').style.display = 'none';
    document.getElementById('lightOnBtn').style.display = 'block';
  }

  const lightOn = () => {
    stopBgm()
    setOverlayVisible(false);
    setAnimation(true);
    setTimeout(() => {
      setSpotVisible(false);
    }, 500)
    document.getElementById('lightOffBtn').style.display = 'block';
    document.getElementById('candleItem').style.display = 'block';
    document.getElementById('lightOnBtn').style.display = 'none';
  }

  function playBgm() {
    const audio = document.getElementById('bgm');
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(err => console.warn('Play failed:', err));
  }

  function stopBgm() {
    const audio = document.getElementById('bgm');
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0; 
  }

  const rickRollClick = () => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 17) {
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      }
      return next;
    });
  };
  
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const micSource = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 1024
      micSource.connect(analyser)

      audioCtxRef.current = audioCtx
      analyserRef.current = analyser
      setListening(true)
    } catch {
      alert('Microphone access required')
    }
  }

  useEffect(() => {
    if (!listening) return
    const buffer = new Float32Array(analyserRef.current.fftSize)
    const loop = () => {
      analyserRef.current.getFloatTimeDomainData(buffer)
      let sumSquares = 0
      for (let i = 0; i < buffer.length; i++) {
        sumSquares += buffer[i] * buffer[i]
      }
      const volume = Math.sqrt(sumSquares / buffer.length)
      setMeterValue(volume)

      if (volume > 0.2) {  
        stopMic()
        blowAllCandles()
        return
      }
      requestAnimationFrame(loop)
    }
    loop()
  }, [listening])

  const stopMic = () => {
    setListening(false)
    audioCtxRef.current?.close()
  }
  
  function blowAllCandles() {
    stopBgm()
    setSpotVisible(false)
    setOverlayVisible(false)
    setAnimation(false)
    canvasRef.current?.blowAll()
    document.getElementById('lightOnBtn').style.display = 'none';
    triggerParty();
  }

  function popEffect(angle, px) {
    confetti({
      particleCount: 300,
      angle,
      spread: 100,
      origin: { y: 0.6, x:px }
    });
  }

  function triggerParty() {
    popEffect(45, 0.25);

    setTimeout(() => {
      popEffect(135, 0.75);
    }, 500)

    setTimeout(() => {
      popEffect(90, 0.5);
    }, 1000)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen w-screen bg-white overflow-y-hidden relative flex flex-col">

        {/* Mic volume handler */}
        {listening && (
        <div style={{
          position: 'fixed', bottom: 20, left: 40,
          width: 200, height: 20, background: '#444'
        }}>
          <div style={{
            width: `${Math.min(meterValue * 400, 200)}px`,
            height: '100%', background: 'lime'
          }} />
        </div>
        )}

        {/* Candles light effect */}
        {spotVisible && <CandleLightEffect positions={positions} visible={spotVisible}/>}

        {/* Light off & on effect */}
        <LightOffEffect visible={overlayVisible} animation={animation} />

        {/* Bgm Audio */}
        <audio id="bgm" src="./assets/bgm.mp3" preload="auto" />

        {/* Body */}
        <div className="flex h-full">

          {/* Light off button */}
          <button id="lightOffBtn" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 text-white bg-black bg-opacity-50 rounded-full p-2"
            onClick={lightOff}>
            ▼
          </button>

          {/* Mic button */}
          <button 
            onClick={startMic}
            style={{ position: 'fixed', bottom: 20, right: '0%', transform: 'translateX(-50%)', zIndex: 1000 }}>
            🎤 Hold & Blow
          </button>

          {/* Center: Canvas */}
          <div className="flex-1 relative bg-[url('./cake.png')] h-screen w-screen bg-contain bg-center bg-no-repeat" onClick={rickRollClick}>
            <Canvas ref={canvasRef}/>
          </div>
                  
          {/* Candle */}
          <div id="candleItem" className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-20 text-white bg-opacity-50 rounded-full p-2">
            <CandleItem />
          </div>

          {/* Light on button */}
          <button id="lightOnBtn" className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-20 text-white bg-black bg-opacity-50 rounded-full p-2" style={{ display: 'none' }}
            onClick={lightOn}>
            ▲
          </button>
        </div>

      </div>
    </DndProvider>
  )
}
