export default function LightOffEffect({ visible }) {
  return (
    <div
      className={`overlay-layer ${visible ? 'visible' : ''}`}
    />
  )
}