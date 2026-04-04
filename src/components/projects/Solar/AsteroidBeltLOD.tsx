import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import AsteroidBelt from "./AsteroidBelt";
import type { AsteroidBeltProps } from "./types";
import { SUN_POINT } from "./constants";
import { useEffect, useRef, useState } from "react";
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
 	const [lodCount, setLodCount] = useState(count);
 	const lodTierRef = useRef<number>(0);
 	const checkCooldownRef = useRef(0);
 	const centerRef = useRef(new THREE.Vector3(...centerPosition));

	useEffect(() => {
		centerRef.current.set(...centerPosition);
	}, [centerPosition]);

	useEffect(() => {
		setLodCount(count);
	}, [count]);

 	useFrame((_, delta) => {
		checkCooldownRef.current -= delta;
		if (checkCooldownRef.current > 0) return;
		checkCooldownRef.current = 0.25;

		const distance = camera.position.distanceTo(centerRef.current);
		const nextTier = distance > 50 ? 3 : distance > 30 ? 2 : distance > 15 ? 1 : 0;
		if (nextTier === lodTierRef.current) return;

		lodTierRef.current = nextTier;
		const multiplier = nextTier === 3 ? 0.1 : nextTier === 2 ? 0.3 : nextTier === 1 ? 0.6 : 1;
		setLodCount(Math.max(1, Math.floor(count * multiplier)));
	});

	return <AsteroidBelt {...props} count={lodCount} />;
}
