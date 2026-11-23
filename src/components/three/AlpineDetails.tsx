'use client'

import { ALPINE_SCENE } from './alpinePalette'

type Vec3 = [number, number, number]

function FirTree({ position, scale = 1 }: { position: Vec3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.02, 0.028, 0.14, 5]} />
        <meshStandardMaterial color={ALPINE_SCENE.wood} roughness={1} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.14, 0.32, 7]} />
        <meshStandardMaterial color={ALPINE_SCENE.detail} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <coneGeometry args={[0.09, 0.22, 7]} />
        <meshStandardMaterial color={ALPINE_SCENE.near} roughness={0.95} />
      </mesh>
    </group>
  )
}

function Farmhouse({ position }: { position: Vec3 }) {
  return (
    <group position={position} scale={0.85}>
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.32, 0.18, 0.2]} />
        <meshStandardMaterial color={ALPINE_SCENE.chalk} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.22, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.24, 0.16, 4]} />
        <meshStandardMaterial color={ALPINE_SCENE.roof} roughness={0.92} />
      </mesh>
      <mesh position={[0.22, 0.06, 0.02]}>
        <boxGeometry args={[0.14, 0.12, 0.14]} />
        <meshStandardMaterial color={ALPINE_SCENE.wood} roughness={1} />
      </mesh>
    </group>
  )
}

function GrazingCow({ position, scale = 1 }: { position: Vec3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.09, 0.04, 0.032]} />
        <meshStandardMaterial color={ALPINE_SCENE.detail} roughness={1} />
      </mesh>
      <mesh position={[0.04, 0.052, 0]}>
        <boxGeometry args={[0.026, 0.026, 0.024]} />
        <meshStandardMaterial color={ALPINE_SCENE.detail} roughness={1} />
      </mesh>
      <mesh position={[-0.025, 0.015, 0.01]}>
        <boxGeometry args={[0.012, 0.024, 0.012]} />
        <meshStandardMaterial color={ALPINE_SCENE.detail} roughness={1} />
      </mesh>
      <mesh position={[0.025, 0.015, 0.01]}>
        <boxGeometry args={[0.012, 0.024, 0.012]} />
        <meshStandardMaterial color={ALPINE_SCENE.detail} roughness={1} />
      </mesh>
    </group>
  )
}

/** Sparse countryside accents — secondary to the ridge composition. */
export function AlpineDetails({ dense = false }: { dense?: boolean }) {
  return (
    <group>
      <Farmhouse position={[1.35, -0.28, -0.35]} />

      <FirTree position={[-1.7, -0.34, -0.55]} scale={1.15} />
      <FirTree position={[-1.45, -0.32, -0.4]} scale={1.35} />
      <FirTree position={[-1.15, -0.3, -0.5]} scale={0.95} />
      <FirTree position={[1.65, -0.32, -0.45]} scale={1.1} />
      <FirTree position={[1.9, -0.34, -0.6]} scale={0.85} />

      {dense ? (
        <>
          <FirTree position={[-0.95, -0.28, -0.75]} scale={0.7} />
          <FirTree position={[1.1, -0.3, -0.7]} scale={0.75} />
        </>
      ) : null}

      <GrazingCow position={[-0.4, -0.36, -0.15]} scale={1.1} />
      <GrazingCow position={[-0.15, -0.35, -0.22]} scale={0.95} />
      <GrazingCow position={[0.55, -0.36, -0.18]} scale={1.0} />
    </group>
  )
}
