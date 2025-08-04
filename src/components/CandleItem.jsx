import { useDrag } from 'react-dnd'

export default function DraggableCandle() {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'candle',
    item: {},
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
  })

  return (
    <img
      ref={dragRef}
      src="./assets/candle-lit.png"
      alt="candle"
      className={`w-4 h-12 cursor-move ${isDragging ? ' opacity-50' : ''}`}
    />
  )
}
