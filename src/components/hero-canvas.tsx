"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function FloatingGadget() {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { pointer, clock } = state;
    const t = clock.getElapsedTime();

    // Gentle continuous floating rotation + light mouse parallax
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      Math.sin(t * 0.4) * 0.35 + pointer.x * 0.4,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      0.1 + Math.cos(t * 0.3) * 0.15 - pointer.y * 0.3,
      0.05
    );
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.12;
  });

  return (
    <group ref={groupRef} dispose={null} scale={1.2}>
      {/* Phone Titanium Outer Frame */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.0, 4.1, 0.16]} />
        <meshStandardMaterial
          color="#161822"
          metalness={0.92}
          roughness={0.18}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Front Glass Screen */}
      <mesh position={[0, 0, 0.088]}>
        <planeGeometry args={[1.9, 3.96]} />
        <meshStandardMaterial
          color="#05070d"
          metalness={0.9}
          roughness={0.1}
          emissive="#001824"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Vibrant OLED Screen Graphic (Cyan/Violet gradient illusion) */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[1.76, 3.78]} />
        <meshBasicMaterial color="#00f2fe" opacity={0.12} transparent />
      </mesh>

      {/* Dynamic Island / Pill Camera at Top */}
      <mesh position={[0, 1.62, 0.092]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Titanium Beveled Edge Ring (Electric Cyan highlight) */}
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.02, 4.12, 0.17)]} />
        <lineBasicMaterial color="#00f2fe" transparent opacity={0.4} />
      </lineSegments>

      {/* Back Triple Camera Module */}
      <group position={[-0.45, 1.25, -0.09]}>
        {/* Camera Plateau */}
        <mesh position={[0, 0, -0.04]}>
          <boxGeometry args={[0.95, 1.05, 0.08]} />
          <meshStandardMaterial color="#1a1c28" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Lens 1 */}
        <mesh position={[-0.22, 0.24, -0.09]}>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 32]} />
          <meshStandardMaterial color="#020305" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Lens 2 */}
        <mesh position={[-0.22, -0.24, -0.09]}>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 32]} />
          <meshStandardMaterial color="#020305" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Lens 3 */}
        <mesh position={[0.24, 0, -0.09]}>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 32]} />
          <meshStandardMaterial color="#020305" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* Orbiting Orbital Rings */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.5, 0.015, 16, 100]} />
        <meshBasicMaterial color="#7000ff" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00f2fe" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = React.useRef<THREE.Points>(null);

  const [positions] = React.useState(() => {
    const coords = new Float32Array(90 * 3);
    for (let i = 0; i < 90 * 3; i += 3) {
      coords[i] = (Math.random() - 0.5) * 12;
      coords[i + 1] = (Math.random() - 0.5) * 8;
      coords[i + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return coords;
  });

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    particlesRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00f2fe"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.8], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.8} />
      {/* Cyan Rim Key Light */}
      <directionalLight position={[4, 5, 4]} intensity={2.2} color="#00f2fe" />
      {/* Violet Fill Light */}
      <directionalLight position={[-4, -3, -3]} intensity={1.8} color="#9055ff" />
      <pointLight position={[0, 2, 2]} intensity={1.2} color="#ffffff" />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <FloatingGadget />
      </Float>

      <FloatingParticles />

      <ContactShadows
        position={[0, -2.6, 0]}
        opacity={0.4}
        scale={8}
        blur={2.4}
        far={4.5}
        color="#000000"
      />
    </Canvas>
  );
}

