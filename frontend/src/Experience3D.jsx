import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Float, Stars, Sparkles, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Dashboard from './Dashboard';

const Scene = () => {
  const scroll = useScroll();
  const group = useRef();
  const starsRef = useRef();

  useFrame((state, delta) => {
    if (!group.current || !starsRef.current) return;
    const offset = scroll.offset;
    
    // Immersive camera-like movement through space
    group.current.position.z = offset * 40;
    group.current.rotation.z = offset * 2;
    group.current.rotation.x = offset * 0.3;

    // Dynamic star rotation
    starsRef.current.rotation.y += delta * 0.03;
    starsRef.current.position.z = offset * 15;
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#0088ff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#818cf8" />
      
      {/* Immersive Background */}
      <Stars ref={starsRef} radius={100} depth={50} count={8000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={500} scale={25} size={1.8} speed={0.4} color="#0088ff" />

      {/* Floating 3D Geometric Nodes */}
      <group ref={group}>
        {[...Array(25)].map((_, i) => (
          <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
            <mesh position={[
              (Math.random() - 0.5) * 30,
              (Math.random() - 0.5) * 30,
              -i * 5
            ]}>
              <octahedronGeometry args={[0.5]} />
              <meshStandardMaterial 
                color="#0088ff" 
                emissive="#0088ff" 
                emissiveIntensity={3}
                wireframe 
                transparent 
                opacity={0.5} 
              />
            </mesh>
          </Float>
        ))}
      </group>

      {/* Dashboard Layer */}
      <Scroll html>
        <div style={{ width: '100vw' }}>
          <Dashboard />
        </div>
      </Scroll>
    </>
  );
};

const Experience3D = () => {
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0 }}>
      <Suspense fallback={<div style={{ color: 'white', padding: '2rem', background: '#000', height: '100vh' }}>Initializing Neural Core...</div>}>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: true }}>
          <ScrollControls pages={3} damping={0.2}>
            <Scene />
          </ScrollControls>
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Experience3D;
