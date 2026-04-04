import React from "react";
import { useThree } from "@react-three/fiber";
import AsteroidBelt from "./AsteroidBelt";
import type { AsteroidBeltProps } from "./types";
import { SUN_POINT } from "./constants";
import { useMemo } from "react";
import * as THREE from "three";

interface AsteroidBeltLODProps extends AsteroidBeltProps {
	centerPosition?: [number, number, number];
}

/**
 * AsteroidBelt component with LOD (Level of Detail)
 * Automatically reduces asteroid count based on camera distance
 */
export function AsteroidBeltLOD({
	centerPosition = SUN_POINT,
	count = 1000,
	...props
}: AsteroidBeltLODProps) {
	const { camera } = useThree();

	const lodCount = useMemo(() => {
		const cameraPos = new THREE.Vector3(...camera.position);
		const beltCenter = new THREE.Vector3(...centerPosition);
		const distance = cameraPos.distanceTo(beltCenter);

		let multiplier = 1.0;
		if (distance > 50) {
			multiplier = 0.1;
		} else if (distance > 30) {
			multiplier = 0.3;
		} else if (distance > 15) {
			multiplier = 0.6;
		}

		return Math.max(1, Math.floor(count * multiplier));
	}, [camera.position, centerPosition, count]);

	return <AsteroidBelt {...props} count={lodCount} />;
}
