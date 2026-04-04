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
    // Vertex shader
varying vec2 vUv;
varying vec2 vAngleVec;  // encode angle as a unit vector, not a scalar

void main() {
    vUv = uv;
    
    // Normalize position to get a unit vector in the XZ plane.
    // This interpolates smoothly across ALL triangles with no discontinuity.
    float len = length(position.xz);
    vAngleVec = position.xz / len;  // vec2(cos θ, sin θ)
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
    `,

				fragmentShader: `
  precision highp float;

uniform float uTime;
uniform vec3 uGlowColor1;
uniform vec3 uGlowColor2;

varying vec2 vUv;
varying float vAngle;
varying vec2 vAngleVec;

void main() {
	float baseAngle = atan(vAngleVec.y, vAngleVec.x) + 3.14159265359;
    float angle = baseAngle + uTime * 0.18;

    // --- Vertical coordinate (centered band) ---
    float y = vUv.y;

    // Flow distortion (now angle-based, seamless)
    y += sin(angle + uTime * 0.5) * 0.022;

    float t = abs(y - 0.5);

    // --- Density profile ---
    float core = exp(-1.5 * t * t);
    float halo = exp(-4.2 * t * t);

    float density = core * 0.18 + halo * 0.24;
    density *= smoothstep(0.5, 0.0, t);
    density *= exp(-1.55 * t);

    // --- Angular banding (fully periodic now) ---
    float band1 = sin(angle * 5.0 + uTime * 0.2) * 0.5 + 0.5;
    float band2 = sin(angle * 7.0 - uTime * 0.16 + 1.2) * 0.5 + 0.5;

    float pulse = 0.94 + 0.06 * sin(uTime * 0.9 + angle * 2.8);

    vec3 col = mix(uGlowColor1, uGlowColor2, band1 * 0.55 + band2 * 0.45);
	// vec3 col = uGlowColor1;
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
				depthTest: false,
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
