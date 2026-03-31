import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Mesh } from "three";
import * as THREE from "three";
import "./AtmosphereMaterial";
import type { PlanetProps } from "./types";

const textureLoader = new THREE.TextureLoader();

export function Planet({
	size = 1,
	color,
	textureMap,
	useAtmosphere = true,
	atmosphereColor,
	atmosphereIntensity = 1.2,
	onClick,
}: PlanetProps) {
	const meshRef = useRef<Mesh>(null);
	const [isHovered, setIsHovered] = useState(false);
	const [isSelected, setIsSelected] = useState(false);
	const map = useMemo(
		() => {
			if (!textureMap) return null;
			const texture = textureLoader.load(textureMap);
			texture.colorSpace = THREE.SRGBColorSpace;
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.ClampToEdgeWrapping;
			texture.repeat.set(0.9995, 1);
			texture.offset.set(0.00025, 0);
			texture.minFilter = THREE.LinearMipmapLinearFilter;
			texture.magFilter = THREE.LinearFilter;
			texture.generateMipmaps = true;
			texture.needsUpdate = true;
			return texture;
		},
		[textureMap],
	);
	const hasTexture = Boolean(map);

	const resolvedSurfaceColor = color ?? (hasTexture ? "white" : "blue");
	const resolvedEmissiveColor = hasTexture ? "#4c79c9" : resolvedSurfaceColor;
	const shouldRenderAtmosphere =
		useAtmosphere &&
		(!hasTexture || atmosphereColor !== undefined || color !== undefined || isHovered || isSelected);

	const resolvedAtmosphereColor =
		atmosphereColor ?? (color ?? (hasTexture ? "#9ac7ff" : "blue"));
	const emissiveIntensity = hasTexture
		? isHovered
			? 0.5
			: isSelected
				? 0.25
				: 0
		: isHovered
			? 7
			: isSelected
				? 2.5
				: 0.1;
	const atmosphereGlowIntensity =
		atmosphereIntensity * (isHovered ? 3.5 : isSelected ? 1.7 : 1);

	useEffect(() => {
		const body = typeof document !== "undefined" ? document.body : null;
		if (!body) return;

		body.style.cursor = isHovered ? "pointer" : "default";
		return () => {
			body.style.cursor = "default";
		};
	}, [isHovered]);

	return (
		<mesh
			ref={meshRef}
			onPointerOver={(event) => {
				event.stopPropagation();
				setIsHovered(true);
			}}
			onPointerOut={(event) => {
				event.stopPropagation();
				setIsHovered(false);
			}}
			onClick={(event) => {
				event.stopPropagation();
				setIsSelected((current) => !current);
				onClick?.();
			}}
		>
			<sphereGeometry args={[size, 32, 32]} />
			<meshStandardMaterial
				color={resolvedSurfaceColor}
				fog={false}
				roughness={0.7}
				metalness={0.0}
				emissive={resolvedEmissiveColor}
				emissiveIntensity={emissiveIntensity}
				toneMapped
				map={map}
			/>
			{shouldRenderAtmosphere && (
				<mesh scale={1.05}>
					<sphereGeometry args={[size, 64, 64]} />
					<atmosphereMaterial
						transparent
						depthWrite={false}
						fog={false}
						side={THREE.FrontSide}
						blending={THREE.AdditiveBlending}
						uAtmosphereColor={
							new THREE.Vector3(
								...new THREE.Color(
									resolvedAtmosphereColor,
								).toArray(),
							)
						}
						uIntensity={atmosphereGlowIntensity}
					/>
				</mesh>
			)}
		</mesh>
	);
}
