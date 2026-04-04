import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { AsteroidBeltProps } from "./types";

export default function AsteroidBelt({
	count = 1000,
	orbitRadius = 11.0,
	eccentricity = 0,
	thickness = 1.6, // radial spread
	height = 0.5, // vertical spread
	size = 0.06,
}: AsteroidBeltProps) {
	const { scene } = useGLTF("/projects/asteroidPack.glb");
	const groupRef = useRef<THREE.Group>(null);

	// extract meshes once (optimized)
	const asteroidMeshes = useMemo(() => {
		const meshes: THREE.Mesh[] = [];

		scene.traverse((child) => {
			if ((child as THREE.Mesh).isMesh) {
				const mesh = child as THREE.Mesh;

				// clone material so we don't mutate original GLTF
				const mat = (
					mesh.material as THREE.MeshStandardMaterial
				).clone();

				mat.metalness = 0.6; // rocks are not metal
				mat.roughness = 0.4;
				mat.envMapIntensity = 0.7; // ignore environment reflections

				// optional: darken slightly (space rocks are dark)
				mat.color.multiplyScalar(1.0);

				mesh.material = mat;

				mesh.castShadow = false; // asteroids don't cast shadows for performance
				mesh.receiveShadow = true;

				meshes.push(mesh);
			}
		});

		return meshes;
	}, [scene]);

	// ellipse params
	const a = orbitRadius;
	const b = a * Math.sqrt(1 - eccentricity * eccentricity);

	useEffect(() => {
		if (!groupRef.current || asteroidMeshes.length === 0) return;

		const group = groupRef.current;
		group.clear();

		for (let i = 0; i < count; i++) {
			const base =
				asteroidMeshes[
					Math.floor(Math.random() * asteroidMeshes.length)
				];

			const asteroid = base.clone();

			// --- placement ---
			const angle = Math.random() * Math.PI * 2;

			const radialOffset =
				(Math.random() - 0.5) * thickness * Math.random();

			const baseX = a * Math.cos(angle);
			const baseZ = b * Math.sin(angle);

			const dir = new THREE.Vector2(baseX, baseZ).normalize();

			const x = baseX + dir.x * radialOffset;
			const z = baseZ + dir.y * radialOffset;
			const y = THREE.MathUtils.randFloatSpread(height);

			asteroid.position.set(x, y, z);

			// rotation
			asteroid.rotation.set(
				Math.random() * Math.PI,
				Math.random() * Math.PI,
				Math.random() * Math.PI,
			);

			// scale around average size
			const scale = size * THREE.MathUtils.randFloat(0.6, 1.4);
			asteroid.scale.setScalar(scale);

			// 🔥 performance critical
			asteroid.updateMatrix();
			asteroid.matrixAutoUpdate = false;

			group.add(asteroid);
		}
	}, [asteroidMeshes, count, a, b, thickness, height, size]);

	// orbit rotation
	useFrame(() => {
		if (!groupRef.current) return;
		groupRef.current.rotation.y += 0.0003;
	});

	return <group ref={groupRef} />;
}
