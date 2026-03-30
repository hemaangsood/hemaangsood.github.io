import React, { useMemo, useRef } from "react";
import type { Mesh } from "three";
import * as THREE from "three";
import "./AtmosphereMaterial";
import type { PlanetProps } from "./types";

const textureLoader = new THREE.TextureLoader();

export function Planet({
	size = 1,
	color = "blue",
	textureMap,
	useAtmosphere = true,
	atmosphereColor,
	atmosphereIntensity = 1.2,
}: PlanetProps) {
	const meshRef = useRef<Mesh>(null);
	const map = useMemo(
		() => (textureMap ? textureLoader.load(textureMap) : null),
		[textureMap],
	);

	const resolvedAtmosphereColor = atmosphereColor ?? color;

	return (
		<mesh ref={meshRef}>
			<sphereGeometry args={[size, 32, 32]} />
			<meshStandardMaterial
				color={color}
				fog={false}
				roughness={0.7}
				metalness={0.0}
				map={map}
			/>
			{useAtmosphere && (
				<mesh scale={1.05}>
					<sphereGeometry args={[size, 64, 64]} />
					<atmosphereMaterial
						transparent
						depthWrite={false}
						fog={false}
						side={THREE.FrontSide}
						uAtmosphereColor={
							new THREE.Vector3(
								...new THREE.Color(
									resolvedAtmosphereColor,
								).toArray(),
							)
						}
						uIntensity={atmosphereIntensity}
					/>
				</mesh>
			)}
		</mesh>
	);
}
