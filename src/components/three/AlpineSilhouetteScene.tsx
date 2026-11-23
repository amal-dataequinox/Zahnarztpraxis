'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Group } from 'three'
import * as THREE from 'three'

import { AlpineDetails } from './AlpineDetails'
import { ALPINE_SCENE, ALPINE_SKY } from './alpinePalette'
import { RidgeLayer } from './RidgeLayer'
import {
  RIDGE_DISTANT,
  RIDGE_FAR,
  RIDGE_MEADOW,
  RIDGE_MID,
  RIDGE_NEAR,
} from './ridgeProfiles'

type Pointer = { x: number; y: number }

function SoftSky() {
  const geo = useMemo(() => new THREE.PlaneGeometry(30, 16), [])
  const mat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(ALPINE_SKY.top) },
        midColor: { value: new THREE.Color(ALPINE_SKY.mid) },
        horizonColor: { value: new THREE.Color(ALPINE_SKY.horizon) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 horizonColor;
        varying vec2 vUv;
        void main() {
          float t = clamp(vUv.y, 0.0, 1.0);
          vec3 col = mix(horizonColor, midColor, smoothstep(0.0, 0.5, t));
          col = mix(col, topColor, smoothstep(0.45, 1.0, t));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      depthWrite: false,
    })
  }, [])

  return <mesh position={[0, 1.35, -7.2]} geometry={geo} material={mat} frustumCulled={false} />
}

function SceneContent({
  pointer,
  enableParallax,
  compact,
}: {
  pointer: Pointer
  enableParallax: boolean
  compact: boolean
}) {
  const group = useRef<Group>(null)
  const mist = useRef<THREE.Mesh>(null)
  const target = useRef({ x: 0, y: 0 })
  const { camera } = useThree()

  useEffect(() => {
    if (compact) {
      camera.position.set(0, 0.05, 5.4)
      camera.lookAt(0, -0.12, 0)
    } else {
      camera.position.set(0, 0.22, 6.0)
      camera.lookAt(0, 0.0, 0)
    }
    camera.updateProjectionMatrix()
  }, [camera, compact])

  useFrame((state, delta) => {
    if (!group.current) return

    if (enableParallax) {
      target.current.x = THREE.MathUtils.lerp(target.current.x, pointer.x * 0.12, 1 - Math.exp(-2.2 * delta))
      target.current.y = THREE.MathUtils.lerp(target.current.y, pointer.y * 0.04, 1 - Math.exp(-2.2 * delta))
      group.current.position.x = target.current.x
      group.current.position.y = target.current.y
    }

    if (mist.current) {
      mist.current.position.x = Math.sin(state.clock.elapsedTime * 0.028) * 0.08
      const mat = mist.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.09 + Math.sin(state.clock.elapsedTime * 0.045) * 0.012
    }
  })

  const farParallax = enableParallax ? pointer.x * -0.03 : 0
  const midParallax = enableParallax ? pointer.x * -0.06 : 0
  const nearParallax = enableParallax ? pointer.x * -0.1 : 0
  const meadowParallax = enableParallax ? pointer.x * -0.14 : 0

  return (
    <>
      <color attach="background" args={[ALPINE_SKY.mid]} />
      <fog attach="fog" args={[ALPINE_SCENE.mist, 8, 22]} />
      <ambientLight intensity={0.92} color={ALPINE_SCENE.chalk} />
      <directionalLight position={[-3.2, 5.2, 3.2]} intensity={0.42} color="#F6F8F7" castShadow={false} />
      <hemisphereLight args={[ALPINE_SKY.top, ALPINE_SCENE.meadow, 0.42]} />

      <SoftSky />

      <group ref={group} position={[0, compact ? -0.28 : -0.4, 0]}>
        <RidgeLayer
          points={RIDGE_DISTANT}
          color={ALPINE_SCENE.distant}
          z={-4.8}
          y={0.48}
          scaleX={7.5}
          scaleY={2.35}
          parallax={farParallax * 0.45}
          opacity={0.95}
          smooth={false}
        />
        <RidgeLayer
          points={RIDGE_FAR}
          color={ALPINE_SCENE.far}
          z={-3.6}
          y={0.3}
          scaleX={7.1}
          scaleY={2.2}
          parallax={farParallax}
          smooth={false}
        />
        <RidgeLayer
          points={RIDGE_MID}
          color={ALPINE_SCENE.mid}
          z={-2.35}
          y={0.1}
          scaleX={6.8}
          scaleY={2.05}
          parallax={midParallax}
        />
        {/* Soft atmospheric haze between mid and near */}
        <mesh position={[0, 0.2, -1.7]}>
          <planeGeometry args={[16, 2.2]} />
          <meshBasicMaterial color={ALPINE_SCENE.mist} transparent opacity={0.14} depthWrite={false} />
        </mesh>
        <RidgeLayer
          points={RIDGE_NEAR}
          color={ALPINE_SCENE.near}
          z={-1.2}
          y={-0.05}
          scaleX={6.6}
          scaleY={1.85}
          parallax={nearParallax}
        />
        <RidgeLayer
          points={RIDGE_MEADOW}
          color={ALPINE_SCENE.meadow}
          z={-0.5}
          y={-0.22}
          scaleX={6.7}
          scaleY={1.35}
          parallax={meadowParallax}
        />
        <RidgeLayer
          points={RIDGE_MEADOW}
          color={ALPINE_SCENE.meadowDeep}
          z={-0.15}
          y={-0.38}
          scaleX={6.8}
          scaleY={0.95}
          parallax={meadowParallax * 1.1}
          opacity={0.88}
        />

        <AlpineDetails dense={!compact} />

        <mesh ref={mist} position={[0, 0.42, -2.0]}>
          <planeGeometry args={[18, 3.0]} />
          <meshBasicMaterial color={ALPINE_SCENE.mist} transparent opacity={0.09} depthWrite={false} />
        </mesh>
      </group>
    </>
  )
}

type AlpineSilhouetteSceneProps = {
  enableParallax: boolean
  className?: string
}

export function AlpineSilhouetteScene({ enableParallax, className }: AlpineSilhouetteSceneProps) {
  const [pointer, setPointer] = useState<Pointer>({ x: 0, y: 0 })
  const compact = useMemo(() => typeof window !== 'undefined' && window.innerWidth < 768, [])

  useEffect(() => {
    if (!enableParallax || compact) return

    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = (event.clientY / window.innerHeight) * 2 - 1
      setPointer({ x, y: -y })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enableParallax, compact])

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={compact ? [1, 1.2] : [1, 1.6]}
        camera={{ position: [0, 0.22, 6.0], fov: compact ? 40 : 42, near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: compact ? 'low-power' : 'high-performance',
          stencil: false,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <SceneContent
          pointer={pointer}
          enableParallax={enableParallax && !compact}
          compact={compact}
        />
      </Canvas>
    </div>
  )
}
