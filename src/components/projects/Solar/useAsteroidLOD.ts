import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

interface LODConfig {
	basePosition: [number, number, number];
	baseCount: number;
	orbitRadius: number;
}

/**
 * Calculate asteroid LOD based on camera distance
 * Returns reduced asteroid count for performance optimization
 *
 * Distance ranges (from camera to belt center):
 * - 0-15: HIGH detail (100% count)
 * - 15-30: MEDIUM detail (60% count)
 * - 30-50: LOW detail (30% count)
 * - 50+: MINIMAL detail (10% count)
 */
export function useAsteroidLOD({
	basePosition,
	baseCount,
	orbitRadius,
}: LODConfig): number {
	const { camera } = useThree();

	const lodCount = useMemo(() => {
		const cameraPos = new THREE.Vector3(...camera.position);
		const beltCenter = new THREE.Vector3(...basePosition);
		const distance = cameraPos.distanceTo(beltCenter);

		// Determine LOD multiplier based on distance
		let lodMultiplier = 1.0;

		if (distance > 50) {
			lodMultiplier = 0.1; // 10% - MINIMAL
		} else if (distance > 30) {
			lodMultiplier = 0.3; // 30% - LOW
		} else if (distance > 15) {
			lodMultiplier = 0.6; // 60% - MEDIUM
		}
		// else: 100% - HIGH (distance <= 15)

		// Ensure at least 1 asteroid even at lowest LOD
		const newCount = Math.max(1, Math.floor(baseCount * lodMultiplier));

		return newCount;
	}, [camera.position, basePosition, baseCount]);

	return lodCount;
}
