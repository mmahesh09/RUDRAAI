"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

// Keep in sync with STEPS in showcase-hero-visual.tsx (the 2D fallback)
const PIPELINE = ["#2997FF", "#A1A1A6", "#3B82F6", "#10B981", "#EC4899"];

const SPACING = 2.1;
const xOf = (i: number) => (i - (PIPELINE.length - 1) / 2) * SPACING;
const zOf = (i: number) => Math.sin(i * 1.3) * 0.6;

function Node({ index, color }: { index: number; color: string }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 1.2 + index) * 0.12;
    ref.current.rotation.y = Math.sin(t * 0.6 + index) * 0.25;
  });

  return (
    <mesh ref={ref} position={[xOf(index), 0, zOf(index)]}>
      <boxGeometry args={[1, 1, 0.35]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.45}
        roughness={0.35}
        metalness={0.2}
      />
    </mesh>
  );
}

function Edge({ index }: { index: number }) {
  const { position, length, angle } = useMemo(() => {
    const x1 = xOf(index), z1 = zOf(index);
    const x2 = xOf(index + 1), z2 = zOf(index + 1);
    const dx = x2 - x1, dz = z2 - z1;
    return {
      position: [(x1 + x2) / 2, 0, (z1 + z2) / 2] as [number, number, number],
      length: Math.hypot(dx, dz),
      angle: -Math.atan2(dz, dx),
    };
  }, [index]);

  return (
    <mesh position={position} rotation={[0, angle, 0]}>
      <boxGeometry args={[length, 0.03, 0.03]} />
      <meshBasicMaterial color="#3F3F46" />
    </mesh>
  );
}

// A data packet travelling the whole pipeline; offset staggers the pulses
function Pulse({ offset }: { offset: number }) {
  const ref = useRef<Mesh>(null);
  const segments = PIPELINE.length - 1;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = ((clock.getElapsedTime() * 0.25 + offset) % 1) * segments;
    const i = Math.floor(p);
    const f = p - i;
    ref.current.position.set(
      xOf(i) + (xOf(i + 1) - xOf(i)) * f,
      0,
      zOf(i) + (zOf(i + 1) - zOf(i)) * f
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshBasicMaterial color="#FFFFFF" />
    </mesh>
  );
}

function Pipeline() {
  const group = useRef<Group>(null);

  // Gentle sway plus a subtle tilt toward the pointer
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const g = group.current.rotation;
    g.y += (Math.sin(t * 0.3) * 0.25 + pointer.x * 0.2 - g.y) * 0.05;
    g.x += (0.35 - pointer.y * 0.1 - g.x) * 0.05;
  });

  return (
    <group ref={group}>
      {PIPELINE.map((color, i) => (
        <Node key={i} index={i} color={color} />
      ))}
      {PIPELINE.slice(0, -1).map((_, i) => (
        <Edge key={i} index={i} />
      ))}
      {[0, 0.33, 0.66].map((o) => (
        <Pulse key={o} offset={o} />
      ))}
    </group>
  );
}

export default function WorkflowScene3D({ active }: { active: boolean }) {
  return (
    <Canvas
      // Stop rendering entirely when the hero is scrolled out of view
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.2, 7.5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <pointLight position={[-4, -2, 3]} intensity={8} color="#2997FF" />
      <Pipeline />
    </Canvas>
  );
}
