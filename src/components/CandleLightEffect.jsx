export default function CandleLightEffect({ positions, visible }) {
  if (!visible) return null

  return (
      <svg
        width="100%"
        height="100%"
        className="fixed top-0 left-0 pointer-events-none z-50"
      >
        <defs>
          <mask id="candle-mask">
            <rect width="100%" height="100%" fill="white" />
            {positions.map((c, i) => (
              <circle
                key={i}
                cx={c.cx}
                cy={c.cy - 22}
                r="50"
                fill="black"
              />
            ))}
          </mask>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.7)"
          mask="url(#candle-mask)"
        />
      </svg>
  )
}
