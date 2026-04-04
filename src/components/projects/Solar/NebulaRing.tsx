import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import type { Mesh } from "three";
import * as THREE from "three";
import { RADIAN } from "./constants";

export function NebulaRing() {
	const mesh = useRef<Mesh>(null);

	const material = useMemo(
		() =>
			new THREE.ShaderMaterial({
				uniforms: {
					uTime: { value: 0 },
					uGlowColor1: { value: new THREE.Color("#9b7bff") },
					uGlowColor2: { value: new THREE.Color("#72e6d6") },
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
	vec2 flowUv = vUv;
	flowUv.x += uTime * 0.018;
	flowUv.y += sin(vUv.x * 6.2832 + uTime * 0.5) * 0.022;

	float t = abs(flowUv.y - 0.5);

	float coreK = 1.5;
	float haloK = 4.2;
	float coreWeight = 0.18;
	float haloWeight = 0.24;

	float core = exp(-coreK * t * t);
	float halo = exp(-haloK * t * t);

	float density = core * coreWeight + halo * haloWeight;
	density *= smoothstep(0.5, 0.0, t);
	density *= exp(-1.55 * t);

	float angle = flowUv.x * 6.2832;
	float band1 = sin(angle * 4.5 + uTime * 0.2) * 0.5 + 0.5;
	float band2 = sin(angle * 7.2 - uTime * 0.16 + 1.2) * 0.5 + 0.5;
	float pulse = 0.94 + 0.06 * sin(uTime * 0.9 + angle * 2.8);

	vec3 col = mix(uGlowColor1, uGlowColor2, band1 * 0.55 + band2 * 0.45);

	float n = noise(flowUv * 12.0 + vec2(uTime * 0.09, -uTime * 0.08));
	col *= (0.9 + n * 0.2);

	density *= pulse;
	vec3 finalColor = col * density * 1.22;
	finalColor = clamp(finalColor, 0.0, 1.0);

	float alpha = density * 0.85;
	alpha = clamp(alpha, 0.0, 0.65);

	gl_FragColor = vec4(finalColor, alpha);
}
`,
				toneMapped: false,
				transparent: true,
				depthWrite: false,
				depthTest: true,
				blending: THREE.AdditiveBlending,
				side: THREE.BackSide,
			}),
		[],
	);

	useEffect(() => {
		const shaderMaterial = material;
		return () => shaderMaterial.dispose();
	}, [material]);

	useFrame((state) => {
		const elapsed = state.clock.getElapsedTime();

		if (mesh.current) {
			if (mesh.current.material instanceof THREE.ShaderMaterial) {
				mesh.current.material.uniforms.uTime.value = elapsed;
			}
			mesh.current.rotation.x = Math.sin(elapsed * 0.32) * 0.04;
			mesh.current.rotation.y = Math.cos(elapsed * 0.27) * 0.03;
			// mesh.current.rotation.z = 15 * RADIAN + elapsed * 0.04;
			mesh.current.position.y = Math.sin(elapsed * 0.36) * 0.75;
		}
	});

	const radius = 100;
	const height = 200;

	return (
		<mesh
			ref={mesh}
			renderOrder={-1}
			position={[0, 0, 0]}
			material={material}
			rotation={[0 * RADIAN, 0 * RADIAN, 15 * RADIAN]}
		>
			<cylinderGeometry args={[radius, radius, height, 128, 4, true]} />
		</mesh>
	);
}
