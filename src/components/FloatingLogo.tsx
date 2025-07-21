import { Canvas } from '@react-three/fiber';
import { Float, Text3D, useMatcapTexture, Stars, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Logo3D = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [matcap] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);

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
      <Text3D
        ref={meshRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.5}
        height={0.1}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
        position={[-0.8, 0, 0]}
      >
        3EA
        <meshMatcapMaterial matcap={matcap} />
      </Text3D>
    </Float>
  );
};

const Ship3D = () => {
  const shipRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (shipRef.current) {
      // Ship flying around the logo
      const time = state.clock.elapsedTime * 0.3;
      shipRef.current.position.x = Math.cos(time) * 3;
      shipRef.current.position.z = Math.sin(time) * 3;
      shipRef.current.position.y = Math.sin(time * 2) * 0.5;
      shipRef.current.rotation.y = time + Math.PI / 2;
      shipRef.current.rotation.z = Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <group ref={shipRef}>
      {/* Simple ship geometry */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.1, 0.3, 6]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#0066cc" 
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Ship trail */}
      <mesh position={[-0.2, 0, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

export const FloatingLogo = () => {
  return (
    <div className="fixed top-4 right-4 w-48 h-48 z-30 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        
        <Stars
          radius={100}
          depth={50}
          count={1000}
          factor={4}
          saturation={0}
          speed={0.5}
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