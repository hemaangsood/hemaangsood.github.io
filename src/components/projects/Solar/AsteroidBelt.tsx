import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { AsteroidBeltProps } from "./types";

type AsteroidTemplate = {
	geometry: THREE.BufferGeometry;
	material: THREE.Material;
};

function seededRandom(seed: number): number {
	const value = Math.sin(seed * 12.9898) * 43758.5453;
	return value - Math.floor(value);
}

export default function AsteroidBelt({
	count = 1000,
	orbitRadius = 11.0,
	eccentricity = 0,
	thickness = 1.6,
	height = 0.5,
	size = 0.06,
}: AsteroidBeltProps) {
	const { scene } = useGLTF("/projects/asteroidPack.glb");
	const groupRef = useRef<THREE.Group>(null);
	const instancedMeshRefs = useRef<Array<THREE.InstancedMesh | null>>([]);

	const asteroidTemplates = useMemo(() => {
		const templates: AsteroidTemplate[] = [];

		scene.traverse((child) => {
			if (!(child as THREE.Mesh).isMesh) return;

			const mesh = child as THREE.Mesh;
			if (!mesh.geometry) return;

			const sourceMaterial = Array.isArray(mesh.material)
				? mesh.material[0]
				: mesh.material;
			if (!sourceMaterial) return;

			const material = sourceMaterial.clone();
			const asStandardMaterial = material as THREE.MeshStandardMaterial;
			asStandardMaterial.metalness = 0.6;
			asStandardMaterial.roughness = 0.4;
			asStandardMaterial.envMapIntensity = 0.7;
			asStandardMaterial.needsUpdate = true;

			templates.push({
				geometry: mesh.geometry,
				material,
			});
		});

		return templates;
	}, [scene]);

	const matricesByTemplate = useMemo(() => {
		if (asteroidTemplates.length === 0 || count <= 0) {
			return [] as THREE.Matrix4[][];
		}

		const a = orbitRadius;
		const b = a * Math.sqrt(1 - eccentricity * eccentricity);
		const buckets = Array.from(
			{ length: asteroidTemplates.length },
			() => [] as THREE.Matrix4[],
		);
		const dummy = new THREE.Object3D();

		for (let i = 0; i < count; i++) {
			const baseSeed = i + count * 101 + a * 29 + b * 17;
			const templateIndex = Math.floor(
				seededRandom(baseSeed + 1) * asteroidTemplates.length,
			);
			const angle = seededRandom(baseSeed + 2) * Math.PI * 2;
			const radialOffset =
				(seededRandom(baseSeed + 3) - 0.5) *
				thickness *
				seededRandom(baseSeed + 4);

			const baseX = a * Math.cos(angle);
			const baseZ = b * Math.sin(angle);
			const direction = new THREE.Vector2(baseX, baseZ).normalize();

			dummy.position.set(
				baseX + direction.x * radialOffset,
				(seededRandom(baseSeed + 5) - 0.5) * height,
				baseZ + direction.y * radialOffset,
			);
			dummy.rotation.set(
				seededRandom(baseSeed + 6) * Math.PI,
				seededRandom(baseSeed + 7) * Math.PI,
				seededRandom(baseSeed + 8) * Math.PI,
			);
			dummy.scale.setScalar(size * (0.6 + seededRandom(baseSeed + 9) * 0.8));
			dummy.updateMatrix();

			buckets[templateIndex].push(dummy.matrix.clone());
		}

		return buckets;
	}, [asteroidTemplates.length, count, orbitRadius, eccentricity, thickness, height, size]);

	useEffect(() => {
		matricesByTemplate.forEach((matrices, templateIndex) => {
			const mesh = instancedMeshRefs.current[templateIndex];
			if (!mesh) return;

			for (let matrixIndex = 0; matrixIndex < matrices.length; matrixIndex++) {
				mesh.setMatrixAt(matrixIndex, matrices[matrixIndex]);
			}

			mesh.count = matrices.length;
			mesh.instanceMatrix.needsUpdate = true;
			mesh.castShadow = false;
			mesh.receiveShadow = true;
		});
	}, [matricesByTemplate]);

	useFrame(() => {
		if (!groupRef.current) return;
		groupRef.current.rotation.y += 0.0003;
	});

	return (
		<group ref={groupRef}>
			{asteroidTemplates.map((template, templateIndex) => {
				const templateCount = Math.max(matricesByTemplate[templateIndex]?.length ?? 0, 1);

				return (
					<instancedMesh
						key={`asteroid-instanced-${templateIndex}`}
						ref={(mesh) => {
							instancedMeshRefs.current[templateIndex] = mesh;
						}}
						args={[template.geometry, template.material, templateCount]}
					/>
				);
			})}
		</group>
	);
}

useGLTF.preload("/projects/asteroidPack.glb");
