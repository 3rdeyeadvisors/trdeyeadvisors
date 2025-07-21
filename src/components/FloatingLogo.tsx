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
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.3}
      floatIntensity={1.2}
      floatingRange={[-0.2, 0.2]}
    >
      <Text
        ref={meshRef}
        font="https://fonts.gstatic.com/s/comfortaa/v30/1Ptqg8zYS_SKggPN4iEgvnHyvveLxVvao4CPNLA3.woff2"
        fontSize={0.6}
        color="#00d4ff"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
      >
        3EA
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#0099ff" 
          emissiveIntensity={0.4}
          metalness={0.3}
          roughness={0.1}
        />
      </Text>
    </Float>
  );
};

const RocketShip = () => {
  const rocketRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rocketRef.current) {
      // Rocket orbiting the logo in a smooth elliptical path
      const time = state.clock.elapsedTime * 0.4;
      rocketRef.current.position.x = Math.cos(time) * 2.5;
      rocketRef.current.position.z = Math.sin(time) * 2.5;
      rocketRef.current.position.y = Math.sin(time * 1.5) * 0.4;
      
      // Rocket points forward in its trajectory
      rocketRef.current.rotation.y = time + Math.PI / 2;
      rocketRef.current.rotation.z = Math.sin(time * 1.5) * 0.15;
    }
  });

  return (
    <group ref={rocketRef}>
      {/* Rocket Body */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.05, 0.25, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#0099ff" 
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Rocket Nose Cone */}
      <mesh position={[0.125, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.05, 0.1, 8]} />
        <meshStandardMaterial 
          color="#ff6b35" 
          emissive="#ff4500" 
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      
      {/* Rocket Fins */}
      <mesh position={[-0.1, 0.03, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.05, 0.02, 0.08]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#0066cc" 
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[-0.1, -0.03, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.05, 0.02, 0.08]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#0066cc" 
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Rocket Thruster Fire */}
      <mesh position={[-0.15, 0, 0]}>
        <coneGeometry args={[0.025, 0.08, 6]} />
        <meshStandardMaterial 
          color="#ffaa00" 
          emissive="#ff6600" 
          emissiveIntensity={1.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Particle Trail */}
      <mesh position={[-0.22, 0, 0]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffaa00" 
          emissiveIntensity={0.9}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

export const FloatingLogo = () => {
  console.log('FloatingLogo component rendered');
  
  return (
    <div 
      className="fixed bottom-8 left-8 w-56 h-56 z-30 pointer-events-none" 
      style={{ 
        border: '2px solid red', // Debug border to see if container is visible
        backgroundColor: 'rgba(255, 0, 0, 0.1)' // Debug background
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        onCreated={() => console.log('Canvas created successfully')}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#00d4ff" />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#ff6b35" />
        
        <Stars
          radius={80}
          depth={50}
          count={300}
          factor={3}
          saturation={0}
          speed={0.2}
        />
        
        <Logo3D />
        <RocketShip />
        
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