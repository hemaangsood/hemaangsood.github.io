import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import type { Mesh } from "three";
import * as THREE from "three";
import { RADIAN } from "./constants";

export function NebulaRing() {
	const mesh = useRef<Mesh>(null);

	const material = useMemo(() => {
		return new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uGlowColor1: { value: new THREE.Color("#7b2fff") },
				uGlowColor2: { value: new THREE.Color("#00c8aa") },
			},

			vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

			fragmentShader: `
  precision highp float;

uniform float uTime;
uniform vec3 uGlowColor1;
uniform vec3 uGlowColor2;

varying vec2 vUv;

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {

	float t = abs(vUv.y - 0.5);

	float coreK = 2.0;
	float haloK = 6.0;
	float coreWeight = 0.2;
	float haloWeight = 0.2;

	float core = exp(-coreK * t * t);
	float halo = exp(-haloK * t * t);

	float density = core * coreWeight + halo * haloWeight;
	density *= smoothstep(0.5, 0.0, t);
	density *= exp(-2.0 * t);

	float angle = vUv.x * 6.2832;
	float band1 = sin(angle * 3.0 + uTime * 0.08) * 0.5 + 0.5;
	float band2 = sin(angle * 5.0 - uTime * 0.05 + 1.2) * 0.5 + 0.5;

	vec3 col = mix(uGlowColor1, uGlowColor2, band1 * 0.6 + band2 * 0.4);

	float n = noise(vUv * 8.0 + uTime * 0.02);
	col *= (0.85 + n * 0.3);

	vec3 finalColor = col * density * 1.5;
	finalColor = clamp(finalColor, 0.0, 1.0);

	float alpha = density * 1.1;
	alpha = clamp(alpha, 0.0, 0.6);

	gl_FragColor = vec4(finalColor, alpha);
}
`,
			toneMapped: false,
			transparent: true,
			depthWrite: false,
			depthTest: true,
			blending: THREE.AdditiveBlending,
			side: THREE.BackSide,
		});
	}, []);

	useFrame((_, delta) => {
		if (mesh.current) {
			// eslint-disable-next-line react-hooks/immutability
			material.uniforms.uTime.value += delta;
		}
	});

	const radius = 100;
	const height = 150;

	return (
		<mesh
			ref={mesh}
			renderOrder={-1}
			position={[0, 0, 0]}
			material={material}
			rotation={[0 * RADIAN, 0 * RADIAN, 30 * RADIAN]}
		>
			<cylinderGeometry args={[radius, radius, height, 128, 4, true]} />
		</mesh>
	);
}
