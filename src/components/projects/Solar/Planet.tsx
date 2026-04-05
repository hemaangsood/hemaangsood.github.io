import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group, Mesh } from "three";
import * as THREE from "three";
import "./AtmosphereMaterial";
import { OrbitalObject } from "./OrbitingObject";
import { AsteroidBeltLOD } from "./AsteroidBeltLOD";
import type { PlanetProps } from "./types";

const textureLoader = new THREE.TextureLoader();

export function Planet({
	size = 1,
	color,
	textureMap,
	useAtmosphere = true,
	atmosphereColor,
	atmosphereIntensity = 1.2,
	selfRotationSpeed = 0.3,
	project,
	selectedProjectId,
	onProjectSelect,
	onProjectHover,
	onProjectPositionUpdate,
	onClick,
	moons,
	asteroidBelts,
}: PlanetProps) {
	const planetGroupRef = useRef<Group>(null);
	const planetMeshRef = useRef<Mesh>(null);
	const selectWorldPosRef = useRef(new THREE.Vector3());
	const worldPosRef = useRef(new THREE.Vector3());
	const lodTierRef = useRef<number>(1);
	const checkCooldownRef = useRef(0);
	const { camera } = useThree();
	const [isHovered, setIsHovered] = useState(false);
	const [atmosphereSegments, setAtmosphereSegments] = useState(32);
	const [labelScale, setLabelScale] = useState(1);
	const isSelectedProject = Boolean(project && selectedProjectId === project.id);

	useFrame((_, delta) => {
		if (planetMeshRef.current) {
			planetMeshRef.current.rotation.y += delta * selfRotationSpeed;
		}

		if (isSelectedProject && onProjectPositionUpdate && planetGroupRef.current && project) {
			planetGroupRef.current.getWorldPosition(worldPosRef.current);
			onProjectPositionUpdate(project.id, worldPosRef.current);
		}

		checkCooldownRef.current -= delta;
		if (checkCooldownRef.current > 0) return;
		checkCooldownRef.current = 0.2;

		if (!planetGroupRef.current) return;
		planetGroupRef.current.getWorldPosition(worldPosRef.current);
		const distance = camera.position.distanceTo(worldPosRef.current);

		if (project) {
			const nextLabelScale = THREE.MathUtils.clamp(0.9 + distance * 0.04, 1, 2.6);
			setLabelScale((current) =>
				Math.abs(current - nextLabelScale) < 0.04 ? current : nextLabelScale,
			);
		}

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
		(!hasTexture || atmosphereColor !== undefined || color !== undefined || isHovered || isSelectedProject);

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
			: isSelectedProject
				? 0.25
				: 0
		: isHovered
			? 7
			: isSelectedProject
				? 2.5
				: 0.1;
	const atmosphereGlowIntensity =
		atmosphereIntensity * (isHovered ? 3.5 : isSelectedProject ? 1.7 : 1);

	useEffect(() => {
		const body = typeof document !== "undefined" ? document.body : null;
		if (!body) return;

		body.style.cursor = isHovered ? "pointer" : "default";
		return () => {
			body.style.cursor = "default";
		};
	}, [isHovered]);

	return (
		<group ref={planetGroupRef}>
			<mesh
				ref={planetMeshRef}
				onPointerOver={(event) => {
					event.stopPropagation();
					setIsHovered(true);
					if (project) {
						onProjectHover?.(project);
					}
				}}
				onPointerOut={(event) => {
					event.stopPropagation();
					setIsHovered(false);
					if (project) {
						onProjectHover?.(null);
					}
				}}
				onClick={(event) => {
					event.stopPropagation();
					if (project && planetGroupRef.current) {
						planetGroupRef.current.getWorldPosition(selectWorldPosRef.current);
						onProjectSelect?.(project, selectWorldPosRef.current);
					}
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
						<sphereGeometry
							args={[
								size,
								atmosphereSegments,
								atmosphereSegments,
							]}
						/>
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
			</mesh>
			{project && (
				<Html
					position={[0, size + 0.5, 0]}
					center
					sprite
					distanceFactor={12}
				>
					<div
						className="pointer-events-none rounded border border-white/30 bg-black/60 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white shadow-lg backdrop-blur-sm"
						style={{ transform: `scale(${labelScale})`, transformOrigin: "center" }}
					>
						{project.name}
					</div>
				</Html>
			)}
			{moons?.map((moonConfig, moonIndex) => (
				<OrbitalObject
					key={`moon-${moonIndex}`}
					{...moonConfig.orbit}
				>
					<Planet
						{...moonConfig.planet}
						asteroidBelts={moonConfig.asteroidBelts}
						selectedProjectId={selectedProjectId}
						onProjectSelect={onProjectSelect}
						onProjectHover={onProjectHover}
						onProjectPositionUpdate={onProjectPositionUpdate}
						selfRotationSpeed={
							moonConfig.moonSelfRotationSpeed
							?? moonConfig.planet.selfRotationSpeed
						}
					/>
				</OrbitalObject>
			))}
			{asteroidBelts?.map((belt, beltIndex) => (
				<AsteroidBeltLOD key={`planet-belt-${beltIndex}`} {...belt} />
			))}
		</group>
	);
}
