'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

import type { RidgePoint } from './ridgeProfiles'

type RidgeLayerProps = {
  points: RidgePoint[]
  color: string
  z: number
  y: number
  scaleX?: number
  scaleY?: number
  parallax: number
  /** Soften silhouette edges with curve segments. */
  smooth?: boolean
  opacity?: number
}

function buildRidgeGeometry(
  points: RidgePoint[],
  scaleX: number,
  scaleY: number,
  smooth: boolean,
): THREE.ShapeGeometry {
  const shape = new THREE.Shape()
  const first = points[0]
  const ground = -0.75
  shape.moveTo(first[0] * scaleX, ground)
  shape.lineTo(first[0] * scaleX, first[1] * scaleY)

  if (smooth && points.length > 2) {
    for (let i = 1; i < points.length - 1; i += 1) {
      const curr = points[i]
      const next = points[i + 1]
      const cpx = curr[0] * scaleX
      const cpy = curr[1] * scaleY
      const x = ((curr[0] + next[0]) / 2) * scaleX
      const y = ((curr[1] + next[1]) / 2) * scaleY
      shape.quadraticCurveTo(cpx, cpy, x, y)
    }
    const last = points[points.length - 1]
    shape.lineTo(last[0] * scaleX, last[1] * scaleY)
  } else {
    for (let i = 1; i < points.length; i += 1) {
      const [x, y] = points[i]
      shape.lineTo(x * scaleX, y * scaleY)
    }
  }

  const last = points[points.length - 1]
  shape.lineTo(last[0] * scaleX, ground)
  shape.closePath()
  return new THREE.ShapeGeometry(shape, 48)
}

export function RidgeLayer({
  points,
  color,
  z,
  y,
  scaleX = 6.2,
  scaleY = 2.4,
  parallax,
  smooth = true,
  opacity = 1,
}: RidgeLayerProps) {
  const geometry = useMemo(
    () => buildRidgeGeometry(points, scaleX, scaleY, smooth),
    [points, scaleX, scaleY, smooth],
  )

  return (
    <mesh position={[parallax, y, z]} geometry={geometry} frustumCulled={false}>
      <meshStandardMaterial
        color={color}
        roughness={0.96}
        metalness={0}
        flatShading={false}
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity >= 1}
      />
    </mesh>
  )
}
