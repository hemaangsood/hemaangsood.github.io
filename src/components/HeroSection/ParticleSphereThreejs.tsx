import type React from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

let globalRenderer: THREE.WebGLRenderer | null = null;

type ParticleSphereProps = {
	parentRef: React.RefObject<HTMLDivElement | null>;
	brightness?: number;
	contrast?: number;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function applyGamma(v: number, gamma = 0.8) {
	return Math.pow(v, gamma);
}

function applyBC(v: number, brightness: number, contrast: number) {
	const x = v * brightness;
	const c = (x - 0.5) * contrast + 0.5;
	return c / (1 + Math.abs(c));
}

function saturate(r: number, g: number, b: number, f = 1.3) {
	const gray = (r + g + b) / 3;
	return [
		clamp01(gray + (r - gray) * f),
		clamp01(gray + (g - gray) * f),
		clamp01(gray + (b - gray) * f),
	];
}

// RGB -> HSV (only hue needed mainly)
function rgbToHsv(r: number, g: number, b: number) {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const d = max - min;

	let h = 0;
	if (d !== 0) {
		switch (max) {
			case r:
				h = ((g - b) / d) % 6;
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
		if (h < 0) h += 1;
	}

	return { h, s: max === 0 ? 0 : d / max, v: max };
}

// Threshold + Hue hybrid classification
function isOcean(r: number, g: number, b: number) {
	const { h, s } = rgbToHsv(r, g, b);

	// blue hue range + saturation + dominance
	const isBlueHue = h > 0.5 && h < 0.75;
	const dominantBlue = b > r && b > g;

	return isBlueHue && dominantBlue && s > 0.2;
}

export default function ParticleSphere({
	parentRef,
	brightness = 1.4,
	contrast = 1.5,
}: ParticleSphereProps): React.JSX.Element {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!parentRef.current || !mountRef.current) return;

		const parent = parentRef.current;
		const mount = mountRef.current;

		const width = mount.clientWidth;
		const height = mount.clientHeight;
		if (width === 0 || height === 0) return;

		if (globalRenderer) {
			try {
				globalRenderer.forceContextLoss();
				globalRenderer.dispose();
			} catch (error) {
				console.warn('Failed to clean up global renderer context:', error);
			}
			globalRenderer = null;
		}

		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(
			75,
			width / height,
			0.1,
			1000,
		);
		camera.position.z = 4.4;

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: "high-performance",
		});

		renderer.setSize(width, height);
		renderer.setClearColor(0x000000, 0);
		renderer.setPixelRatio(1);
		renderer.outputColorSpace = THREE.SRGBColorSpace;

		mount.innerHTML = "";
		mount.appendChild(renderer.domElement);

		globalRenderer = renderer;

		const particleCount = 12000;
		const radius = 2.5;

		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(particleCount * 3);
		const colors = new Float32Array(particleCount * 3);

		const phi = Math.PI * (3 - Math.sqrt(5));
		for (let i = 0; i < particleCount; i++) {
			const y = 1 - (i / (particleCount - 1)) * 2;
			const r = Math.sqrt(1 - y * y);
			const theta = phi * i;

			const x = Math.cos(theta) * r * radius;
			const z = Math.sin(theta) * r * radius;

			positions.set([x, y * radius, z], i * 3);
		}

		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3),
		);

		const material = new THREE.PointsMaterial({
			size: 0.035,
			vertexColors: true,
			transparent: true,
			opacity: 0.9,
			blending: THREE.AdditiveBlending,
			depthWrite: true,
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		const loader = new THREE.TextureLoader();
		const texture = loader.load("/earth.jpg", (tex) => {
			const img = tex.image as HTMLImageElement;

			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);

			const imageData = ctx.getImageData(
				0,
				0,
				canvas.width,
				canvas.height,
			);

			for (let i = 0; i < particleCount; i++) {
				const x = positions[i * 3];
				const y = positions[i * 3 + 1];
				const z = positions[i * 3 + 2];

				const len = Math.sqrt(x * x + y * y + z * z);
				const nx = x / len;
				const ny = y / len;
				const nz = z / len;

				const u = 1.0 - (0.5 + Math.atan2(nz, nx) / (2 * Math.PI));
				const v = 0.5 - Math.asin(ny) / Math.PI;

				const px = Math.min(
					canvas.width - 1,
					Math.floor(u * canvas.width),
				);
				const py = Math.min(
					canvas.height - 1,
					Math.floor(v * canvas.height),
				);
				const idx = (py * canvas.width + px) * 4;

				let rCol = imageData.data[idx] / 255;
				let gCol = imageData.data[idx + 1] / 255;
				let bCol = imageData.data[idx + 2] / 255;

				// pipeline
				rCol = applyGamma(rCol);
				gCol = applyGamma(gCol);
				bCol = applyGamma(bCol);

				rCol = applyBC(rCol, brightness, contrast);
				gCol = applyBC(gCol, brightness, contrast);
				bCol = applyBC(bCol, brightness, contrast);

				[rCol, gCol, bCol] = saturate(rCol, gCol, bCol);

				// CLASSIFICATION
				if (isOcean(rCol, gCol, bCol)) {
					// ocean (darker, uniform blue)
					colors[i * 3] = 0.05;
					colors[i * 3 + 1] = 0.25;
					colors[i * 3 + 2] = 0.75;
				} else {
					// land (boosted contrast + warmth)
					colors[i * 3] = clamp01(rCol * 1.2 + 0.1);
					colors[i * 3 + 1] = clamp01(gCol * 1.3 + 0.1);
					colors[i * 3 + 2] = clamp01(bCol * 0.7);
				}
			}

			geometry.setAttribute(
				"color",
				new THREE.BufferAttribute(colors, 3),
			);
		});

		let targetX = 0;
		let targetY = 0;
		let currentX = 0;
		let currentY = 0;

		function handleMouseMove(e: MouseEvent) {
			const rect = parent.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width;
			const y = (e.clientY - rect.top) / rect.height;

			targetY = (x * 2 - 1) * 0.8;
			targetX = (y * 2 - 1) * 0.4;
		}

		parent.addEventListener("mousemove", handleMouseMove);

		let animationId = 0;
		let lastTime = performance.now();

		const pointsTilt = [Math.PI * 0.1, 0, 0];

		function animate() {
			animationId = requestAnimationFrame(animate);

			const now = performance.now();
			const delta = (now - lastTime) / 1000;
			lastTime = now;

			const lerp = 1 - Math.pow(0.001, delta);

			currentX += (targetX - currentX) * lerp;
			currentY += (targetY - currentY) * lerp;

			const time = now * 0.001;

			points.rotation.x = currentX + pointsTilt[0];
			points.rotation.y = currentY + time * 0.15;

			renderer.render(scene, camera);
		}

		animate();

		function handleResize() {
			const w = parent.offsetWidth;
			const h = parent.offsetHeight;
			if (w === 0 || h === 0) return;

			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h, false);
		}

		window.addEventListener("resize", handleResize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", handleResize);
			parent.removeEventListener("mousemove", handleMouseMove);

			geometry.dispose();
			material.dispose();
			texture.dispose();

			try {
				renderer.forceContextLoss();
				renderer.dispose();
			} catch (error) {
				console.warn('Failed to clean up renderer context:', error);
			}

			if (mount.contains(renderer.domElement)) {
				mount.removeChild(renderer.domElement);
			}

			if (globalRenderer === renderer) globalRenderer = null;
		};
	}, [parentRef, brightness, contrast]);

	return <div ref={mountRef} style={{ width: "100%", aspectRatio: "1/1" }} />;
}
