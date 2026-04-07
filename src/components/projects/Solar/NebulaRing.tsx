import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import type { Mesh } from "three";
import * as THREE from "three";
import { RADIAN } from "./constants";

export function NebulaRing() {
	const radius = 100;
	const height = 200;
	const mesh = useRef<Mesh>(null);

	const material = useMemo(
		() =>
			new THREE.ShaderMaterial({
				uniforms: {
					uTime: { value: 0 },
					uGlowColor1: { value: new THREE.Color("#9b7bff") },
					uGlowColor2: { value: new THREE.Color("#72e6d6") },
					height: { value: height },
				},

				vertexShader: `
varying vec3 vPos;
varying vec2 vUv;

void main() {
    vPos = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
    `,
				fragmentShader: `precision highp float;

uniform float uTime;
uniform vec3 uGlowColor1;
uniform vec3 uGlowColor2;
uniform float height;
varying vec3 vPos;

// assumes cylinder aligned along Y axis

void main() {
    // --- radial distance ---
float r = length(vPos.xz);

float ringCenter = 100.0;
float thickness = 25.0;

float d = abs(r - ringCenter) / thickness;
float radial = exp(-d * d * 2.0);

// --- vertical coordinate (correct normalization) ---
float y = (vPos.y + height * 0.5) / height;
float t = abs(y - 0.5);

// --- vertical density (restored original behavior) ---
float core = exp(-0.6 * t * t);
float halo = exp(-5.0 * t * t);

float vertical = core * 0.2 + halo * 0.3;
vertical *= smoothstep(0.5, 0.0, t);
vertical *= exp(-1.55 * t);

// --- combine masks (IMPORTANT: do this late) ---
float density = vertical * radial;

// --- angular-like variation (seam-free) ---
float a = uTime * 0.1;
vec2 dir = vec2(cos(a), sin(a));
vec2 normXZ = normalize(vPos.xz);

float swirl = dot(normXZ, dir);

float flow = sin(swirl * 6.0 + uTime * 0.4);
float pulse = 0.94 + 0.06 * sin(uTime * 0.9 + swirl * 2.8);

density *= (0.9 + 0.2 * flow) * pulse;

// --- color ---
float mixVal = sin(swirl * 4.0 + uTime * 0.2) * 0.5 + 0.5;
mixVal = pow(mixVal, 0.9);
vec3 col = mix(uGlowColor1, uGlowColor2, mixVal);

vec3 finalColor = clamp(col * density * 1.22, 0.0, 1.0);
float alpha = clamp(density * 0.85, 0.0, 0.65);

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


	return (
		<mesh
			ref={mesh}
			renderOrder={1}
			position={[0, 0, 0]}
			material={material}
			rotation={[0 * RADIAN, 0 * RADIAN, 15 * RADIAN]}
		>
			<cylinderGeometry args={[radius, radius, height, 128, 4, true]} />
		</mesh>
	);
}
