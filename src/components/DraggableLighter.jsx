import { useDrag } from 'react-dnd'

export default function DraggableLigther() {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'lighter',
    item: {},
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  return (
    <img
      ref={dragRef}
      src="/assets/lighter.png"
      alt="lighter"
      id="lighter-img"
      className={`w-10 h-10 cursor-move ${isDragging ? 'opacity-50' : ''}`}
    />
  )
}