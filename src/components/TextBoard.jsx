export default function TextBoard({
  visible = true,
  text = 'Happy Birthday',
  speed = 10, 
}) {
  if (!visible) return null;

  const copies = Array(3).fill(text);

  return (
    <div className="textboard-container ">
      <div
        className="textboard-content"
        style={{ animationDuration: `${speed}s` }}
      >
        {copies.map((t, idx) => (
          <span className="textboard-item" key={idx}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
