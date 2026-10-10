import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const palette = () => {const css=getComputedStyle(document.documentElement);const read=(token:string)=>{const canvas=document.createElement("canvas");canvas.width=1;canvas.height=1;const ctx=canvas.getContext("2d");if(!ctx)return new THREE.Color();ctx.fillStyle=css.getPropertyValue(token);ctx.fillRect(0,0,1,1);const data=ctx.getImageData(0,0,1,1).data;return new THREE.Color((data[0]??0)/255,(data[1]??0)/255,(data[2]??0)/255);};return {BLUE:read("--lp-blue"),BLUE_SOFT:read("--lp-cyan")};};

function Sphere({ count, particles }: { count: number; particles: number }) {
  const {BLUE,BLUE_SOFT} = useMemo(palette,[]);
  const group = useRef<THREE.Group>(null);
  const flow = useRef<THREE.Points>(null);

  const { nodes, lineGeo, edges } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      nodes.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r).multiplyScalar(1.6));
    }
    const edges: [number, number][] = [];
    nodes.forEach((n, i) => {
      nodes.map((m, j) => ({ j, d: n.distanceTo(m) })).filter((x) => x.j > i).sort((a, b) => a.d - b.d).slice(0, 3).forEach((x) => edges.push([i, x.j]));
    });
    const pos = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], k) => { nodes[a]?.toArray(pos, k * 6); nodes[b]?.toArray(pos, k * 6 + 3); });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { nodes, lineGeo, edges };
  }, [count]);

  const nodeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nodes.flatMap((n) => n.toArray())), 3));
    return g;
  }, [nodes]);

  const flowData = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(particles * 3), 3));
    const meta = Array.from({ length: particles }, () => ({ e: Math.floor(Math.random() * edges.length), t: Math.random(), s: 0.2 + Math.random() * 0.4 }));
    return { g, meta };
  }, [particles, edges.length]);

  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.12;
    group.current.rotation.x += (state.pointer.y * 0.25 - group.current.rotation.x) * 0.05;
    group.current.position.x += (state.pointer.x * 0.15 - group.current.position.x) * 0.05;
    const attr = flowData.g.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    flowData.meta.forEach((p, i) => {
      p.t += dt * p.s;
      if (p.t > 1) { p.t = 0; p.e = Math.floor(Math.random() * edges.length); }
      const edge = edges[p.e]; if(!edge) return;
      const from = nodes[edge[0]], to = nodes[edge[1]]; if(!from || !to) return;
      const v = from.clone().lerp(to, p.t);
      arr[i * 3] = v.x; arr[i * 3 + 1] = v.y; arr[i * 3 + 2] = v.z;
    });
    attr.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo}><lineBasicMaterial color={BLUE} transparent opacity={0.35} /></lineSegments>
      <points geometry={nodeGeo}><pointsMaterial color={BLUE} size={0.09} sizeAttenuation /></points>
      <points ref={flow} geometry={flowData.g}><pointsMaterial color={BLUE_SOFT} size={0.05} sizeAttenuation transparent opacity={0.9} /></points>
      <mesh><sphereGeometry args={[0.28, 24, 24]} /><meshBasicMaterial color={BLUE} transparent opacity={0.18} /></mesh>
    </group>
  );
}

export default function NodeSphere({ light = false }: { light?: boolean }) {
  const small = typeof window !== "undefined" && window.innerWidth < 768;
  const count = light || small ? 28 : 54;
  const particles = light || small ? 20 : 60;
  return (
    <Canvas camera={{ position: [0, 0, 4.6], fov: 50 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} aria-hidden>
      <Sphere count={count} particles={particles} />
    </Canvas>
  );
}
