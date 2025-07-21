import { Canvas } from '@react-three/fiber';
import { Float, Text, Stars, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Logo3D = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating movement
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.8}
      floatingRange={[-0.3, 0.3]}
    >
      <Text
        ref={meshRef}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        fontSize={0.5}
        color="#00d4ff"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
      >
        3EA
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#0066cc" 
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </Text>
    </Float>
  );
};

const Ship3D = () => {
  const shipRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (shipRef.current) {
      // Ship flying around the logo
      const time = state.clock.elapsedTime * 0.3;
      shipRef.current.position.x = Math.cos(time) * 2;
      shipRef.current.position.z = Math.sin(time) * 2;
      shipRef.current.position.y = Math.sin(time * 2) * 0.3;
      shipRef.current.rotation.y = time + Math.PI / 2;
      shipRef.current.rotation.z = Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <group ref={shipRef}>
      {/* Simple ship geometry */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.08, 0.2, 6]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#0066cc" 
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Ship trail */}
      <mesh position={[-0.15, 0, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

export const FloatingLogo = () => {
  return (
    <div className="fixed top-4 right-4 w-40 h-40 z-30 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00d4ff" />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#8b5cf6" />
        
        <Stars
          radius={50}
          depth={30}
          count={500}
          factor={2}
          saturation={0}
          speed={0.3}
        />
        
        <Logo3D />
        <Ship3D />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default FloatingLogo;