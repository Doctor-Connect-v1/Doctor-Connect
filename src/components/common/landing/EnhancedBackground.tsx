"use client";

import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Sphere,
  GradientTexture,
  MeshDistortMaterial,
  Float,
  useAspect,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

// Modern professional medical color palette
const COLORS = {
  primary: "#1C51CD", // Deep medical blue
  secondary: "#569ECD", // Soft blue
  accent: "#4C9757", // Healing green
  highlight: "#D13015", // Alert red (used sparingly)
  lightBg: "#EBF1F8", // Light background blue
  neutral: "#A8ADB7", // Neutral gray
  white: "#FFFFFF", // White
  darkAccent: "#194546", // Dark teal
};

// GradientBackground - creates a smooth professional gradient background
const GradientBackground = () => {
  const scale = useAspect(window.innerWidth, window.innerHeight, 1);

  return (
    <mesh position={[0, 0, -5]} scale={scale}>
      <planeGeometry />
      <meshBasicMaterial>
        <GradientTexture
          stops={[0, 0.4, 1]}
          colors={[COLORS.lightBg, "#FFFFFF", COLORS.lightBg]}
          size={1024}
        />
      </meshBasicMaterial>
    </mesh>
  );
};

// Professional Floating Orb
const FloatingOrb = ({
  position = [0, 0, 0],
  scale = 1,
  color = COLORS.secondary,
  distort = 0.3,
  speed = 1,
}) => {
  const mesh = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (mesh.current) {
      // Initial random rotation
      mesh.current.rotation.x = Math.random() * Math.PI;
      mesh.current.rotation.y = Math.random() * Math.PI;

      // Animate in
      gsap.from(mesh.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        delay: Math.random() * 0.5,
      });
    }
  }, []);

  return (
    <Float
      speed={1.2 * speed}
      rotationIntensity={0.15 * speed}
      floatIntensity={0.2 * speed}
      position={new THREE.Vector3(...position)}
    >
      <Sphere args={[1, 32, 32]} scale={scale} ref={mesh}>
        <MeshDistortMaterial
          color={color}
          envMapIntensity={0.6}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
          metalness={0.1}
          roughness={0.2}
          distort={distort}
          speed={1.2}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
};

// Medical Symbol - creates a clean plus shape
const MedicalSymbol = ({
  position = [0, 0, 0],
  scale = 1,
  color = COLORS.primary,
  rotation = [0, 0, 0],
}) => {
  const mesh = useRef<THREE.Group>(null);

  useEffect(() => {
    if (mesh.current) {
      // Animate in
      gsap.from(mesh.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.2,
        ease: "back.out(1.5)",
        delay: Math.random() * 0.3,
      });

      mesh.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  }, [rotation]);

  return (
    <Float
      speed={0.8}
      rotationIntensity={0.1}
      floatIntensity={0.1}
      position={new THREE.Vector3(...position)}
    >
      <group ref={mesh} scale={scale}>
        {/* Horizontal bar */}
        <RoundedBox args={[1, 0.25, 0.15]} radius={0.08}>
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.3} />
        </RoundedBox>

        {/* Vertical bar */}
        <RoundedBox args={[0.25, 1, 0.15]} radius={0.08}>
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.3} />
        </RoundedBox>
      </group>
    </Float>
  );
};

// Main Background Component
const EnhancedBackground: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`fixed inset-0 -z-10 w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        {/* Base gradient background */}
        <GradientBackground />

        {/* Subtle floating orbs with professional colors */}
        <FloatingOrb
          position={[-5, 2, -6]}
          scale={2.5}
          color={COLORS.secondary}
          distort={0.1}
          speed={0.4}
        />
        <FloatingOrb
          position={[6, -3, -8]}
          scale={3.0}
          color={COLORS.primary}
          distort={0.08}
          speed={0.3}
        />
        <FloatingOrb
          position={[-7, -4, -10]}
          scale={4.0}
          color={COLORS.accent}
          distort={0.05}
          speed={0.2}
        />

        {/* Smaller orbs for detail */}
        <FloatingOrb
          position={[2, 3, -3]}
          scale={0.8}
          color={COLORS.secondary}
          distort={0.2}
          speed={0.7}
        />
        <FloatingOrb
          position={[-3, -1, -4]}
          scale={1.2}
          color={COLORS.primary}
          distort={0.15}
          speed={0.6}
        />
        <FloatingOrb
          position={[4, 2, -5]}
          scale={1.5}
          color={COLORS.accent}
          distort={0.1}
          speed={0.5}
        />

        {/* Medical symbols */}
        <MedicalSymbol
          position={[-2, 2, -2]}
          scale={0.3}
          color={COLORS.primary}
          rotation={[0.2, 0.3, 0.1]}
        />
        <MedicalSymbol
          position={[3, -1, -3]}
          scale={0.2}
          color={COLORS.secondary}
          rotation={[0.1, 0.2, 0.3]}
        />
        <MedicalSymbol
          position={[0, 3, -4]}
          scale={0.25}
          color={COLORS.accent}
          rotation={[0.3, 0.1, 0.2]}
        />

        {/* Ambient light */}
        <ambientLight intensity={0.6} />

        {/* Directional light for subtle shadows */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          color={COLORS.white}
        />
        <directionalLight
          position={[-10, -10, 5]}
          intensity={0.4}
          color={COLORS.secondary}
        />

        {/* Environment for reflections */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default EnhancedBackground;
