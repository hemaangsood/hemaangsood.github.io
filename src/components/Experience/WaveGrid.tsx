import type React from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const MAX_WAVES = 16;
const COLOR_BINS = 32;

function generateColorBins(stops: string[], bins: number) {
	const colors = stops.map((c) => new THREE.Color(c));
	const result: THREE.Color[] = [];

	for (let i = 0; i < bins; i++) {
		const t = i / (bins - 1);

		const seg = (colors.length - 1) * t;
		const idx = Math.floor(seg);
		const frac = seg - idx;

		const c1 = colors[idx];
		const c2 = colors[Math.min(idx + 1, colors.length - 1)];

		const c = c1.clone().lerp(c2, frac);

		result.push(c);
	}

	return result;
}

export default function WaveGrid({
	parentRef,
	shape = [70, 70],
	spacing = 0.3,
	colorStops = ["#5227FF", "#fcba03", "#7cff67","#fff"],
	maxAmplitude = 0.4,
}: {
	parentRef: React.RefObject<HTMLDivElement | null>;
	shape?: number[];
	spacing?: number;
	colorStops?: string[];
	maxAmplitude?: number;
}): React.JSX.Element {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = parentRef.current;
		const mount = mountRef.current;
		if (!container || !mount) return;

		// Scene
		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(
			60,
			container.offsetWidth / container.offsetHeight,
			0.1,
			1000,
		);
		camera.position.set(-shape[0]*spacing / 4, -shape[1]*spacing / 3, 4);
		camera.up.set(0, 0, 1);
		camera.lookAt(0, 0, -10);

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
		});

		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
		renderer.setSize(container.offsetWidth, container.offsetHeight);

		mount.appendChild(renderer.domElement);

		// Geometry
		const [cols, rows] = shape;

		const positions = new Float32Array(cols * rows * 3);

		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				const idx = (i * rows + j) * 3;

				positions[idx] = i * spacing - (cols * spacing) / 2;
				positions[idx + 1] = j * spacing - (rows * spacing) / 2;
				positions[idx + 2] = 0;
			}
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3),
		);

		// Gradient color bins
		const gradientBins = generateColorBins(colorStops, COLOR_BINS);

		// Vertex Shader
		const vertexShader = `
#define MAX_WAVES ${MAX_WAVES}

uniform float time;
uniform int waveCount;

uniform vec2 waveCenter[MAX_WAVES];
uniform float waveAmplitude[MAX_WAVES];
uniform float waveWavelength[MAX_WAVES];
uniform float waveSpeed[MAX_WAVES];
uniform float waveDecay[MAX_WAVES];
uniform float waveStart[MAX_WAVES];

uniform float maxAmplitude;

varying float vHeight;

void main(){

	vec3 pos = position;

	float z = 0.0;

	for(int i=0;i<MAX_WAVES;i++){

		if(i >= waveCount) break;

		float age = time - waveStart[i];
		if(age < 0.0) continue;

		float r = distance(pos.xy, waveCenter[i]);

		z += waveAmplitude[i] *
			 exp(-waveDecay[i]*r) *
			sin(r*waveWavelength[i] - age*waveSpeed[i]);
	}

	pos.z += z;

	vHeight = z;

	gl_Position =
		projectionMatrix *
		modelViewMatrix *
		vec4(pos,1.0);

	gl_PointSize = 5.0;
}
`;

		// Fragment Shader
		const fragmentShader = `
#define COLOR_BINS ${COLOR_BINS}

uniform vec3 colorBins[COLOR_BINS];
uniform float maxAmplitude;

varying float vHeight;

void main(){

	float norm = clamp((vHeight + maxAmplitude)/(2.0*maxAmplitude),0.0,1.0);

	int idx = int(floor(norm * float(COLOR_BINS-1)));

	vec3 color = colorBins[idx];

	gl_FragColor = vec4(color,1.0);
}
`;

		// Shader Material
		const material = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 },

				waveCount: { value: 1 },

				waveCenter: {
					value: Array.from(
						{ length: MAX_WAVES },
						() => new THREE.Vector2(),
					),
				},

				waveAmplitude: { value: new Float32Array(MAX_WAVES) },
				waveWavelength: { value: new Float32Array(MAX_WAVES) },
				waveSpeed: { value: new Float32Array(MAX_WAVES) },
				waveDecay: { value: new Float32Array(MAX_WAVES) },
				waveStart: { value: new Float32Array(MAX_WAVES) },

				colorBins: {
					value: gradientBins.map(
						(c) => new THREE.Vector3(c.r, c.g, c.b),
					),
				},

				maxAmplitude: { value: maxAmplitude },
			},

			vertexShader,
			fragmentShader,
			transparent: true,
		});

		const points = new THREE.Points(geometry, material);

		// points.rotation.x = -Math.PI / 3;
		// points.rotation.z = Math.PI/4;

		scene.add(points);

		// Waves
		const waves = [
			{
				x: (-shape[0] * spacing) / 2,
				y: (-shape[1] * spacing) / 2,
				start: 0,
				amplitude: 0.3,
				wavelength: 2,
				speed: 2,
				decay: -0.008,
			},
		];

		const clock = new THREE.Clock();
		let rafId: number;
		let isVisible = true;

		const io = new IntersectionObserver(
			([entry]) => {
				isVisible = entry.isIntersecting;
			},
			{ threshold: 0.01 },
		);

		io.observe(container);

		const animate = () => {
			rafId = requestAnimationFrame(animate);
			if (!isVisible) return;

			const time = clock.getElapsedTime();

			material.uniforms.time.value = time;
			material.uniforms.waveCount.value = waves.length;

			for (let i = 0; i < waves.length; i++) {
				material.uniforms.waveCenter.value[i].set(
					waves[i].x,
					waves[i].y,
				);

				material.uniforms.waveAmplitude.value[i] = waves[i].amplitude;
				material.uniforms.waveWavelength.value[i] = waves[i].wavelength;
				material.uniforms.waveSpeed.value[i] = waves[i].speed;
				material.uniforms.waveDecay.value[i] = waves[i].decay;
				material.uniforms.waveStart.value[i] = waves[i].start;
			}

			renderer.render(scene, camera);
		};

		animate();

		// Resize
		const ro = new ResizeObserver(() => {
			const w = container.offsetWidth;
			const h = container.offsetHeight;

			camera.aspect = w / h;
			camera.updateProjectionMatrix();

			renderer.setSize(w, h);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
		});

		ro.observe(container);

		// Cleanup
		return () => {
			cancelAnimationFrame(rafId);
			io.disconnect();
			ro.disconnect();

			if (mount.contains(renderer.domElement)) {
				mount.removeChild(renderer.domElement);
			}

			geometry.dispose();
			material.dispose();
			renderer.dispose();
		};
	}, [parentRef, colorStops]);

	return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
