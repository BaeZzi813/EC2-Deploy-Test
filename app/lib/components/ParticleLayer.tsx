"use client";

const particles = Array.from({ length: 15 }, () => ({
  left: Math.random() * 100,
  width: 4 + Math.random() * 12,
  height: 4 + Math.random() * 12,
  duration: 6 + Math.random() * 8,
  delay: Math.random() * 8,
}));

export default function ParticleLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            left: `${p.left}%`,
            bottom: "-20px",
            width: `${p.width}px`,
            height: `${p.height}px`,
            animationName: "particle-rise",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );
}
