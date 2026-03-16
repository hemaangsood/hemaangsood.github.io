import type React from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleSphere({
	parentRef,
}: {
	parentRef: React.RefObject<HTMLDivElement | null>;
}): React.JSX.Element {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!parentRef.current) {
			console.warn("Parent reference is not available for ParticleSphere");
			return;
		}
		const localMountRef = mountRef.current;
		const localParentRef = parentRef.current;
		if (!localMountRef) {
			return;
		}

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			(localParentRef?.offsetWidth || window.innerWidth) /
				(localParentRef?.offsetHeight || window.innerHeight),
			0.1,
			1000,
		);
		camera.position.z = 4;

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: "high-performance",
		});
		renderer.setClearColor(0x000000, 0);
		renderer.setSize(
			localParentRef?.offsetWidth || window.innerWidth,
			localParentRef?.offsetHeight || window.innerHeight,
		);
		localMountRef.appendChild(renderer.domElement);

		// Make sphere geometry
		const particleCount = 2500;
		const radius = 1.5;

		const geometry = new THREE.BufferGeometry();

		const positions = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount; i++) {
			const phi = Math.acos(1 - 2 * Math.random());
			const theta = 2 * Math.PI * Math.random();
			const x = radius * Math.sin(phi) * Math.cos(theta);
			const y = radius * Math.sin(phi) * Math.sin(theta);
			const z = radius * Math.cos(phi);
			positions.set([x, y, z], i * 3);
		}

		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3),
		);

		const material = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 0.02,
			transparent: true,
			opacity: 0.8,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
		});
		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let mouseX = 0;
		let mouseY = 0;

		let targetX = 0;
		let targetY = 0;

		let currentX = 0;
		let currentY = 0;

		function handleMouseMove(event: MouseEvent) {
			if (!localParentRef) {
				console.warn(
					"Parent reference is not available for mouse move handling",
				);
				return;
			}

			const rect = localParentRef.getBoundingClientRect();

			const x = (event.clientX - rect.left) / rect.width;
			const y = (event.clientY - rect.top) / rect.height;

			mouseX = x * 2 - 1;
			mouseY = y * 2 - 1;

			targetY = mouseX * 0.8;
			targetX = mouseY * 0.4;
		}

		localParentRef.addEventListener("mousemove", handleMouseMove);
		const startTime = performance.now();
		let animationFrameId = 0;

		function animate() {
			animationFrameId = requestAnimationFrame(animate);
			const time = (performance.now() - startTime) * 0.001;
			points.scale.setScalar(1 + Math.sin(time * 1.5) * 0.01);

			currentX += (targetX - currentX) * 0.06;
			currentY += (targetY - currentY) * 0.06;

			points.rotation.x = currentX;
			points.rotation.y = currentY + time * 0.15;

			renderer.render(scene, camera);
		}

		animate();

		function handleResize() {
			camera.aspect =
				(localParentRef?.offsetWidth || window.innerWidth) /
				(localParentRef?.offsetHeight || window.innerHeight);
			camera.updateProjectionMatrix();
			renderer.setSize(
				localParentRef?.offsetWidth || window.innerWidth,
				localParentRef?.offsetHeight || window.innerHeight,
			);
		}
		window.addEventListener("resize", handleResize);

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", handleResize);
			localParentRef.removeEventListener("mousemove", handleMouseMove);

			if (localMountRef.contains(renderer.domElement)) {
				localMountRef.removeChild(renderer.domElement);
			}

			geometry.dispose();
			material.dispose();
			renderer.dispose();
		};
	}, [parentRef]);

	return <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>;
}
