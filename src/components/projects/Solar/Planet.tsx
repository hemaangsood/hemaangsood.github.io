import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Mesh } from "three";
import * as THREE from "three";
import "./AtmosphereMaterial";
import type { PlanetProps } from "./types";
import { OrbitalObject } from "./OrbitingObject";

const textureLoader = new THREE.TextureLoader();

export function Planet({
	size = 1,
	color,
	textureMap,
	useAtmosphere = true,
	atmosphereColor,
	atmosphereIntensity = 1.2,
	onClick,
	moons = [],
}: PlanetProps) {
	const meshRef = useRef<Mesh>(null);
	const worldPosRef = useRef(new THREE.Vector3());
	const lodTierRef = useRef<number>(1);
	const checkCooldownRef = useRef(0);
	const { camera } = useThree();
	const [isHovered, setIsHovered] = useState(false);
	const [isSelected, setIsSelected] = useState(false);
	const [atmosphereSegments, setAtmosphereSegments] = useState(32);

	useFrame((_, delta) => {
		checkCooldownRef.current -= delta;
		if (checkCooldownRef.current > 0) return;
		checkCooldownRef.current = 0.2;

		if (!meshRef.current) return;
		meshRef.current.getWorldPosition(worldPosRef.current);
		const distance = camera.position.distanceTo(worldPosRef.current);

		const nextTier = distance > 32 ? 2 : distance > 16 ? 1 : 0;
		if (nextTier === lodTierRef.current) return;
		lodTierRef.current = nextTier;

		const nextSegments = nextTier === 2 ? 16 : nextTier === 1 ? 32 : 64;
		if (nextSegments !== atmosphereSegments) {
			setAtmosphereSegments(nextSegments);
		}
	});

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
	
	// Pre-compute atmosphere color vector to avoid creating in JSX
	const atmosphereColorVector = useMemo(
		() => new THREE.Vector3(...new THREE.Color(resolvedAtmosphereColor).toArray()),
		[resolvedAtmosphereColor],
	);

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
				// castShadow={true}
				map={map}
			/>
			{shouldRenderAtmosphere && (
				<mesh scale={1.05}>
					<sphereGeometry args={[size, atmosphereSegments, atmosphereSegments]} />
					<atmosphereMaterial
						transparent
						depthWrite={false}
						fog={false}
						side={THREE.FrontSide}
						blending={THREE.AdditiveBlending}
						uAtmosphereColor={atmosphereColorVector}
						uIntensity={atmosphereGlowIntensity}
					/>
				</mesh>
			)}
			{moons.map((moonConfig, index) => (
				<OrbitalObject key={index} {...moonConfig.orbit}>
					<Planet {...moonConfig.planet} />
				</OrbitalObject>
			))}
		</mesh>
	);
}
