import { useState } from "react";

export default function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{
            cursor: "pointer",
            fontSize: 20,
            color: (hover || value) >= n ? "var(--gold)" : "var(--line)",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
