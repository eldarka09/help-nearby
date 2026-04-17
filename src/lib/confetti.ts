// Heart-confetti burst at a screen point. No deps.
const COLORS = ["#E57373", "#F8BBD0", "#FFB6C1", "#81C784", "#64B5F6", "#FFD54F"];

function heartSvg(color: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${color}'><path d='M12 21s-7.5-4.6-9.5-9.1C1 8.6 3 5 6.5 5c2 0 3.4 1.1 4.3 2.4C11.7 6.1 13.1 5 15.1 5 18.6 5 20.6 8.6 19.1 11.9 17.1 16.4 12 21 12 21z'/></svg>`
  )}`;
}

export function heartBurst(x: number, y: number, count = 22) {
  const layer = document.createElement("div");
  layer.style.cssText = `position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;`;
  document.body.appendChild(layer);

  for (let i = 0; i < count; i++) {
    const img = document.createElement("img");
    const color = COLORS[i % COLORS.length];
    img.src = heartSvg(color);
    const size = 14 + Math.random() * 18;
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 160;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 40;
    img.style.cssText = `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;will-change:transform,opacity;`;
    layer.appendChild(img);
    const anim = img.animate(
      [
        { transform: "translate(0,0) scale(0.4) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) scale(1) rotate(${(Math.random() - 0.5) * 180}deg)`, opacity: 1, offset: 0.7 },
        { transform: `translate(${dx * 1.1}px,${dy + 200}px) scale(0.8) rotate(${(Math.random() - 0.5) * 360}deg)`, opacity: 0 },
      ],
      { duration: 1100 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" }
    );
    anim.onfinish = () => img.remove();
  }
  setTimeout(() => layer.remove(), 2200);
}

export function heartBurstFromEvent(e: { clientX: number; clientY: number } | React.MouseEvent) {
  heartBurst((e as MouseEvent).clientX, (e as MouseEvent).clientY);
}
