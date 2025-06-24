import { useRef, useState, useLayoutEffect } from "react";

interface TrophyCellProps {
  count: number;
  gap?: number; // px between each icon
  maxIconWidth?: number; // your default 16px
}

export function TrophyCell({
  count,
  gap = 4,
  maxIconWidth = 16,
}: TrophyCellProps) {
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [iconWidth, setIconWidth] = useState(maxIconWidth);

  useLayoutEffect(() => {
    function updateWidth() {
      if (!cellRef.current) return;
      //   const totalWidth = cellRef.current.clientWidth;
      const totalWidth = cellRef.current.getBoundingClientRect().width;

      // total gap space:
      const totalGap = gap * (count - 1);

      // available for icons:
      const avail = totalWidth - totalGap - 1;
      // compute width per icon, but never exceed maxIconWidth
      const perItem = Math.floor(avail / count);
      const w = Math.max(1, Math.min(maxIconWidth, perItem));
      setIconWidth(w);
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [count, gap, maxIconWidth]);

  return (
    <td ref={cellRef} className="trophy-table-cell">
      {Array.from({ length: count }).map((_, i) => (
        <img
          key={i}
          src="assets/trophy.png"
          alt="🏆"
          width={iconWidth}
          style={{ marginRight: i + 1 < count ? gap : 0 }}
        />
      ))}
    </td>
  );
}
