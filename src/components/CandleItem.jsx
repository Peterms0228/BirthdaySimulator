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
      src="./assets/candle-lit.jpg"
      alt="candle"
      className={`w-10 h-10 cursor-move ${isDragging ? ' opacity-50' : ''}`}
    />
  )
}
