import React, { useMemo } from "react";
import * as THREE from "three";
import { randFloat } from "three/src/math/MathUtils.js";

interface BackgroundStarsProps {
	count?: number;
}

export function BackgroundStars({ count = 6000 }: BackgroundStarsProps) {
	const minDist = 25;
	const maxDist = 80;

	const { positions, colors, sizes } = useMemo(() => {
		const positions = new Float32Array(count * 3);
		const colors = new Float32Array(count * 3);
		const sizes = new Float32Array(count);

		for (let i = 0; i < count; i++) {
			const theta = randFloat(0, 1) * 2 * Math.PI;
			const phi = Math.acos(2 * randFloat(0, 1) - 1);
			const r = minDist + randFloat(0, 1) * (maxDist - minDist);

			positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
			positions[i * 3 + 2] = r * Math.cos(phi);

			const warm = randFloat(0, 1) < 0.15;
			const c = new THREE.Color().setHSL(
				warm ? randFloat(0.05, 0.1) : randFloat(0.55, 0.65),
				warm ? randFloat(0.3, 0.6) : randFloat(0.0, 0.2),
				randFloat(0.85, 1.0),
			);
			colors[i * 3] = c.r;
			colors[i * 3 + 1] = c.g;
			colors[i * 3 + 2] = c.b;

			sizes[i] = randFloat(0.5, 2.5);
		}
		return { positions, colors, sizes };
	}, [count]);

	return (
		<points>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" args={[positions, 3]} />
				<bufferAttribute attach="attributes-color" args={[colors, 3]} />
				<bufferAttribute attach="attributes-size" args={[sizes, 1]} />
			</bufferGeometry>
			<pointsMaterial
				vertexColors
				sizeAttenuation={false}
				size={1.5}
				transparent
				opacity={0.9}
			/>
		</points>
	);
}
