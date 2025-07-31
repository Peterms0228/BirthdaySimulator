import { useDraggable } from '@dnd-kit/core'

export default function ScrollArrow({ onDragDown }) {
  const {attributes, listeners, setNodeRef, delta, isDragging} = useDraggable({
    id: 'arrow',
  })

  /* When dragged down sufficiently, call onNextPhase */
  if (delta && delta.y > 150) {
    onDragDown()
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 cursor-grab"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="w-8 h-8 border-b-4 border-r-4 border-white rotate-45 transform" />
    </div>
  )
}
