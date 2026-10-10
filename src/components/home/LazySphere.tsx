import { lazy, Suspense, useEffect, useState } from "react";

const NodeSphere = lazy(() => import("./NodeSphere"));

export function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const on = () => setR(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return r;
}

export function StaticNetwork({ className = "" }: { className?: string }) {
  const pts = Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2;
    const r = i % 2 ? 120 : 80;
    return [200 + Math.cos(a) * r, 200 + Math.sin(a) * r];
  });
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <g stroke="var(--lp-blue)" strokeOpacity="0.35" strokeWidth="1">
        {pts.map((p, i) => { const q = pts[(i + 3) % pts.length]; if(!q) return null; return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} />; })}
        {pts.map((p, i) => <line key={"c" + i} x1={200} y1={200} x2={p[0]} y2={p[1]} strokeOpacity="0.15" />)}
      </g>
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={4} fill="var(--lp-blue)" />)}
      <circle cx="200" cy="200" r="16" fill="var(--lp-blue)" fillOpacity="0.25" />
    </svg>
  );
}

export function LazySphere({ light = false }: { light?: boolean }) {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = "requestIdleCallback" in window ? (window as Window).requestIdleCallback(() => setReady(true)) : setTimeout(() => setReady(true), 300);
    return () => { if ("cancelIdleCallback" in window) (window as Window).cancelIdleCallback(id as number); };
  }, []);
  const fallback = <StaticNetwork className="h-full w-full" />;
  if (!ready || reduced) return fallback;
  return <Suspense fallback={fallback}><NodeSphere light={light} /></Suspense>;
}
