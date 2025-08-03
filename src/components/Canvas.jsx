import { useDrop } from 'react-dnd';
import { useState, useImperativeHandle, forwardRef } from 'react';

const Canvas = forwardRef((props, ref) => {
  const [items, setItems] = useState([]);

  const [, dropRef] = useDrop({
    accept: ['candle'],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = document.getElementById('canvas')?.getBoundingClientRect();
      if (!canvasRect || !offset) return;

      const x = offset.x - canvasRect.left;
      const y = offset.y - canvasRect.top;

      setItems(prev => [...prev, { ...item, x, y, type: 'candle', lit: false }]);
    }
  });
  
  useImperativeHandle(ref, () => ({
    getCandles: () => 
      items.filter(c => c.type === 'candle').map(c => ({ x: c.x + 15, y: c.y + 15 })),
    lightAll: () => {
      setItems(prev =>
        prev.map(item => 
          item.type === 'candle' ? { ...item, lit: true } : item
        )
      )
    },
    blowAll: () => {
      setItems(prev => 
        prev.map(item =>
          item.type === 'candle' ? { ...item, lit: false } : item
      ))
    }
  }), [])

  return (
    <div
      id="canvas"
      ref={dropRef}
      className="w-full h-full relative">

      {items.map((item, i) => (
        <img
          key={i}
          id={`candle-${i}`}
          src={item.lit ? './assets/candle-lit.gif' : './assets/candle.png'}
          className="absolute w-8 h-24 pointer-events-none"
          style={{ left: item.x, top: item.y }}
          alt="candle"
        />
      ))}
    </div>
  );
})

export default Canvas;
