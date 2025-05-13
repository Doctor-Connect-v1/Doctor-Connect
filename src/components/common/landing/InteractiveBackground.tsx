"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Text3D,
  Center,
  useTexture,
  Environment,
} from "@react-three/drei";
import { Vector3, Color, MeshStandardMaterial, Mesh, Group } from "three";
import { gsap } from "gsap";

// 3D Medical Symbols
const MedicalSymbols = () => {
  const groupRef = useRef<Group>(null);
  const { viewport, mouse } = useThree();

  // Track mouse movement for interactive effect
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
      groupRef.current.rotation.z =
        Math.cos(clock.getElapsedTime() * 0.1) * 0.05;

      // Follow mouse with subtle movement
      const targetX = (mouse.x * viewport.width) / 2;
      const targetY = (mouse.y * viewport.height) / 2;

      groupRef.current.position.x +=
        (targetX - groupRef.current.position.x) * 0.01;
      groupRef.current.position.y +=
        (targetY - groupRef.current.position.y) * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <CrossSymbol position={[3, 1, -2]} scale={0.5} color="#4285f4" />
      </Float>

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
        <PillSymbol position={[-3, -2, -5]} scale={0.6} color="#1dcd9f" />
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.4}>
        <HeartSymbol position={[-4, 3, -3]} scale={0.4} color="#ea4335" />
      </Float>

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
        <DnaSymbol position={[4, -3, -4]} scale={0.7} color="#fbbb05" />
      </Float>

      <Float speed={1.7} rotationIntensity={0.3} floatIntensity={0.5}>
        <CrossSymbol position={[0, 4, -6]} scale={0.3} color="#34a853" />
      </Float>
    </group>
  );
};

// Medical Cross Symbol
const CrossSymbol = ({
  position = [0, 0, 0],
  scale = 1,
  color = "#4285f4",
}) => {
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      // Random initial rotation
      meshRef.current.rotation.x = Math.random() * Math.PI;
      meshRef.current.rotation.y = Math.random() * Math.PI;

      // Animate in
      gsap.from(meshRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)",
        delay: Math.random(),
      });
    }
  }, []);

  return (
    <group position={new Vector3(...position)} scale={scale}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 2.5, 0.4]} />
        <boxGeometry args={[2.5, 0.8, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Heart Symbol
const HeartSymbol = ({
  position = [0, 0, 0],
  scale = 1,
  color = "#ea4335",
}) => {
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      gsap.from(meshRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
        delay: Math.random() * 0.3,
      });
    }
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Pulsing effect
      const pulseFactor = Math.sin(clock.getElapsedTime() * 2) * 0.03 + 1;
      meshRef.current.scale.set(
        scale * pulseFactor,
        scale * pulseFactor,
        scale * pulseFactor
      );
    }
  });

  return (
    <group position={new Vector3(...position)}>
      <Center>
        <Text3D
          ref={meshRef}
          font="/fonts/heart.json"
          size={2}
          height={0.5}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.02}
          bevelSegments={5}
        >
          ♥
          <meshStandardMaterial color={color} metalness={0.1} roughness={0.3} />
        </Text3D>
      </Center>
    </group>
  );
};

// Pill Symbol
const PillSymbol = ({ position = [0, 0, 0], scale = 1, color = "#1dcd9f" }) => {
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      gsap.from(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 1.3,
        ease: "power3.out",
        delay: Math.random() * 0.5,
      });
    }
  }, []);

  return (
    <group
      position={new Vector3(...position)}
      rotation={[Math.PI / 4, 0, Math.PI / 6]}
      scale={scale}
    >
      <mesh ref={meshRef}>
        <capsuleGeometry args={[0.7, 2, 16, 32]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Pill separator line */}
      <mesh position={[0, 0, 0.72]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.72, 0.72, 0.05, 32]} />
        <meshStandardMaterial color="white" metalness={0.1} roughness={0.1} />
      </mesh>
    </group>
  );
};

// DNA Symbol
const DnaSymbol = ({ position = [0, 0, 0], scale = 1, color = "#fbbb05" }) => {
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      gsap.from(groupRef.current.position, {
        y: position[1] - 10,
        duration: 1.2,
        ease: "power3.out",
        delay: Math.random() * 0.5,
      });
    }
  }, [position]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  // Create the DNA spiral
  const strands = [];
  const count = 8;
  const radius = 0.8;
  const strandColors = [color, "#ffffff"];

  for (let s = 0; s < 2; s++) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const offset = s === 0 ? 0 : Math.PI;
      const y = (i - count / 2) * 0.4;

      const x = Math.cos(angle + offset) * radius;
      const z = Math.sin(angle + offset) * radius;

      strands.push(
        <mesh key={`strand-${s}-${i}`} position={[x, y, z]} scale={0.15}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={strandColors[s]}
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>
      );

      // Add connecting lines between the opposite strands
      if (s === 0) {
        strands.push(
          <mesh key={`connector-${i}`} position={[0, y, 0]}>
            <cylinderGeometry args={[0.05, 0.05, radius * 2, 8]} />
            <meshStandardMaterial
              color="#cccccc"
              metalness={0.1}
              roughness={0.3}
            />
            <group rotation={[0, angle + Math.PI / 2, 0]} />
          </mesh>
        );
      }
    }
  }

  return (
    <group ref={groupRef} position={new Vector3(...position)} scale={scale}>
      {strands}
    </group>
  );
};

// Main Background Component
const InteractiveBackground: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`fixed inset-0 -z-10 w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#f8fcfa"]} />
        <fog attach="fog" args={["#f8fcfa", 15, 30]} />

        {/* Ambient light for overall scene brightness */}
        <ambientLight intensity={0.8} />

        {/* Directional light to create shadows */}
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />

        {/* Soft light from multiple directions */}
        <pointLight
          position={[-10, -10, -10]}
          color="#1dcd9f"
          intensity={0.2}
        />
        <pointLight position={[10, 10, 10]} color="#4285f4" intensity={0.2} />

        {/* Medical symbols */}
        <MedicalSymbols />

        {/* Environment lighting */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default InteractiveBackground;
