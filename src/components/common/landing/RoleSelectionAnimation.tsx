"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface RoleSelectionAnimationProps {
  className?: string;
  role: "doctor" | "patient";
}

const RoleSelectionAnimation: React.FC<RoleSelectionAnimationProps> = ({
  className,
  role,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Create different geometries based on role
    let mainObject;

    if (role === "doctor") {
      // Create a stethoscope-like object for doctors
      const group = new THREE.Group();

      // Stethoscope head (circle)
      const headGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0x4285f4,
        metalness: 0.7,
        roughness: 0.3,
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      group.add(head);

      // Stethoscope tube (curved line)
      const curvePoints = [];
      for (let i = 0; i < 100; i++) {
        const t = i / 100;
        const x = 2 * Math.sin(t * Math.PI * 2);
        const y = -1 - t * 2;
        const z = 2 * Math.cos(t * Math.PI * 2);
        curvePoints.push(new THREE.Vector3(x, y, z));
      }

      const tubeGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(curvePoints),
        100,
        0.1,
        8,
        false
      );

      const tubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x4285f4,
        metalness: 0.5,
        roughness: 0.5,
      });

      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      group.add(tube);

      mainObject = group;
    } else {
      // Create a heart for patients
      const heartShape = new THREE.Shape();

      heartShape.moveTo(0, 0);
      heartShape.bezierCurveTo(0, -0.5, -1, -1, -2, 0);
      heartShape.bezierCurveTo(-3, 1, -3, 2, -2, 3);
      heartShape.bezierCurveTo(-1, 4, 0, 5, 0, 5);
      heartShape.bezierCurveTo(0, 5, 1, 4, 2, 3);
      heartShape.bezierCurveTo(3, 2, 3, 1, 2, 0);
      heartShape.bezierCurveTo(1, -1, 0, -0.5, 0, 0);

      const extrudeSettings = {
        depth: 1,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.2,
        bevelThickness: 0.2,
      };

      const heartGeometry = new THREE.ExtrudeGeometry(
        heartShape,
        extrudeSettings
      );
      heartGeometry.scale(0.4, 0.4, 0.4);
      heartGeometry.rotateZ(Math.PI);

      const heartMaterial = new THREE.MeshStandardMaterial({
        color: 0xea4335,
        metalness: 0.2,
        roughness: 0.8,
      });

      mainObject = new THREE.Mesh(heartGeometry, heartMaterial);
    }

    // Add floating particles (medical symbols)
    const particlesGroup = new THREE.Group();
    const particleGeometry = new THREE.SphereGeometry(0.08, 16, 16);

    for (let i = 0; i < 40; i++) {
      const particleMaterial = new THREE.MeshStandardMaterial({
        color: role === "doctor" ? 0x4285f4 : 0xea4335,
        emissive: role === "doctor" ? 0x4285f4 : 0xea4335,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7,
      });

      const particle = new THREE.Mesh(particleGeometry, particleMaterial);

      // Random positions in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 2 + Math.random() * 2;

      particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
      particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
      particle.position.z = radius * Math.cos(phi);

      // Store original position for animation
      particle.userData = {
        originalPosition: particle.position.clone(),
        speed: 0.005 + Math.random() * 0.01,
        offset: Math.random() * Math.PI * 2,
      };

      particlesGroup.add(particle);
    }

    scene.add(mainObject);
    scene.add(particlesGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.6);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate main object
      mainObject.rotation.x += 0.003;
      mainObject.rotation.y += 0.005;

      // Animate particles
      particlesGroup.children.forEach((particle: THREE.Mesh, i: number) => {
        const userData = particle.userData;
        const time = Date.now() * userData.speed;

        // Pulsing movement
        const scaleFactor = 1 + 0.05 * Math.sin(time + userData.offset);
        particle.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Circular movement around original position
        const originalPos = userData.originalPosition;
        particle.position.x = originalPos.x + 0.1 * Math.sin(time * 0.5);
        particle.position.y = originalPos.y + 0.1 * Math.cos(time * 0.3);
        particle.position.z = originalPos.z + 0.1 * Math.sin(time * 0.4);

        // Slowly rotate particles
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      currentMount.removeChild(renderer.domElement);

      // Dispose geometries and materials
      if (mainObject instanceof THREE.Group) {
        mainObject.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      } else if (mainObject instanceof THREE.Mesh) {
        mainObject.geometry.dispose();
        if (Array.isArray(mainObject.material)) {
          mainObject.material.forEach((mat) => mat.dispose());
        } else {
          mainObject.material.dispose();
        }
      }

      particlesGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, [role]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default RoleSelectionAnimation;
