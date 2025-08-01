export default function LightOffEffect({ visible, animation }) {
  return (
    <div
      className={animation ? `overlay-layer ${visible ? 'visible' : ''}` : ''}
    />
  )
}