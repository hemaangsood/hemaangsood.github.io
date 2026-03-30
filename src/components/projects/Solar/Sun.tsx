import { useTexture } from "@react-three/drei";
import React from "react";
import { SUN_POINT } from "./constants";

export function Sun() {
	const sunTexture = useTexture("/projects/sun.png");

	return (
		<mesh position={SUN_POINT}>
			<sphereGeometry args={[3, 32, 32]} />
			<meshStandardMaterial
				color="yellow"
				emissive="gold"
				emissiveIntensity={2}
				emissiveMap={sunTexture}
			/>
		</mesh>
	);
}
