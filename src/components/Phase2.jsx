import Canvas from './Canvas'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useRef, useState, useEffect } from 'react'
import CandleItem from './CandleItem'
import LightOffEffect from './LightOffEffect'
import CandleLightEffect from './CandleLightEffect' 
import TextBoard from './TextBoard'
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
  const [showBanner, setShowBanner] = useState(true);
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
      setAnimation(false);
      setOverlayVisible(false);
    }, 500)
    document.getElementById('lightOffBtn').style.display = 'none';
    document.getElementById('candleItem').style.display = 'none';
    document.getElementById('micBtn').style.display = 'block';
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

      if (volume > 0.4) {  
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
          <div className='volume-meter-vertical'>
          <div className='volume-level'
          style={{
            height: `${Math.min(meterValue * 600, 200)}px`, 
          }} />
        </div>
        )}

        {/* Candles light effect */}
        {spotVisible && <CandleLightEffect positions={positions} visible={spotVisible}/>}

        {/* Light off & on effect */}
        <LightOffEffect visible={overlayVisible} animation={animation} />

         {/* Textboard for wish */}
        <TextBoard
          visible={showBanner}
          text="生日快樂 橘子子子 🎈🎂🎉"
          speed={5}>
        </TextBoard>

        {/* Bgm Audio */}
        <audio id="bgm" src="./assets/bgm.mp3" preload="auto" />

        {/* Body */}
        <div className="flex h-full">

          {/* Light off button */}
          <button id="lightOffBtn" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 text-white bg-black bg-opacity-50 rounded-full p-2"
            onClick={lightOff}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
            </svg>
          </button>

          {/* Center: Canvas */}
          <div className="flex-1 relative bg-[url('./cake.png')] h-screen w-screen bg-contain bg-center bg-no-repeat" onClick={rickRollClick}>
            <Canvas ref={canvasRef}/>
          </div>
                  
          {/* Candle */}
          <div id="candleItem" className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-20 text-white bg-opacity-50 rounded-full p-2">
            <CandleItem />
          </div>

          {/* Mic button */}
          <button id='micBtn'
            className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-20 text-white bg-black bg-opacity-50 rounded-full p-2 animate-pulse" style={{ display: 'none' }}
            onClick={startMic}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic" viewBox="0 0 16 16">
              <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
              <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
            </svg>
          </button>
        </div>

      </div>
    </DndProvider>
  )
}
