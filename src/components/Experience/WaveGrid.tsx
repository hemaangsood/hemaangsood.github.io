import type React from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { type WaveSource } from "./types";

function heightToColor(height: number, min = -0.3, max = 0.3) {
	const t = Math.max(0, Math.min(1, (height - min) / (max - min)));

	const hue = t * 0.5; // red -> cyan
	const color = new THREE.Color();
	color.setHSL(hue, 1.0, 0.45);

	return color;
}

export default function WaveGrid({
	parentRef,
	shape = [200, 100],
	spacing = 0.2,
}: {
	parentRef: React.RefObject<HTMLDivElement | null>;
	shape?: Array<number> | number;
	spacing?: number;
}): React.JSX.Element {
	const mountRef = useRef<HTMLDivElement>(null);

	const waves: WaveSource[] = [
		{
			x: 0,
			y: 0,
			startTime: 0,
			amplitude: 0.1,
			wavelength: 1,
			speed: 1,
			decay: 0.002,
			lifetime: null,
		},
	];

	useEffect(() => {
		if (!parentRef.current || !mountRef.current) return;

		const container = parentRef.current;

		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(
			75,
			container.offsetWidth / container.offsetHeight,
			0.1,
			1000,
		);

		camera.position.z = 8;

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: "high-performance",
		});

		renderer.setSize(container.offsetWidth, container.offsetHeight);
		renderer.setClearColor(0x000000, 0);

		mountRef.current.appendChild(renderer.domElement);

		const gridShape: number[] = Array.isArray(shape) ? shape : [shape];
		const particleCount = gridShape[0] * gridShape[1];

		const geometry = new THREE.BufferGeometry();

		const positions = new Float32Array(particleCount * 3);
		const baseMap = new Float32Array(particleCount * 3);
		const colors = new Float32Array(particleCount * 3);

		for (let i = 0; i < gridShape[0]; i++) {
			for (let j = 0; j < gridShape[1]; j++) {
				const index = i * gridShape[1] + j;
				const offset = index * 3;

				const x = i * spacing - (gridShape[0] * spacing) / 2;
				const y = j * spacing - (gridShape[1] * spacing) / 2;

				positions[offset] = x;
				positions[offset + 1] = y;
				positions[offset + 2] = 0;

				baseMap[offset] = x;
				baseMap[offset + 1] = y;
				baseMap[offset + 2] = 0;
			}
		}

		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3),
		);

		geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 0.04,
			vertexColors: true,
			transparent: true,
			opacity: 0.9,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
		});

		const points = new THREE.Points(geometry, material);

		points.rotation.x = -0.8;

		scene.add(points);

		const startTime = performance.now();

		let animationFrameId = 0;

		function animate() {
			animationFrameId = requestAnimationFrame(animate);

			const time = (performance.now() - startTime) * 0.001;

			for (let i = 0; i < gridShape[0]; i++) {
				for (let j = 0; j < gridShape[1]; j++) {
					const index = i * gridShape[1] + j;
					const offset = index * 3;

					const px = baseMap[offset];
					const py = baseMap[offset + 1];

					let z = 0;

					for (const wave of waves) {
						if (
							wave.lifetime &&
							time - wave.startTime > wave.lifetime
						) {
							continue;
						}

						const dx = px - wave.x;
						const dy = py - wave.y;

						const r = Math.sqrt(dx * dx + dy * dy);
						const age = time - wave.startTime;

						z +=
							wave.amplitude *
							Math.exp(-wave.decay * r) *
							Math.sin(r * wave.wavelength - age * wave.speed);
					}

					positions[offset + 2] = z;

					const c = heightToColor(z);

					colors[offset] = c.r;
					colors[offset + 1] = c.g;
					colors[offset + 2] = c.b;
				}
			}

			geometry.attributes.position.needsUpdate = true;
			geometry.attributes.color.needsUpdate = true;

			renderer.render(scene, camera);
		}

		animate();

		function handleResize() {
			camera.aspect = container.offsetWidth / container.offsetHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(container.offsetWidth, container.offsetHeight);
		}

		window.addEventListener("resize", handleResize);

		return () => {
			cancelAnimationFrame(animationFrameId);

			window.removeEventListener("resize", handleResize);

			if (mountRef.current?.contains(renderer.domElement)) {
				mountRef.current.removeChild(renderer.domElement);
			}

			geometry.dispose();
			material.dispose();
			renderer.dispose();
		};
	}, [parentRef]);

	return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
