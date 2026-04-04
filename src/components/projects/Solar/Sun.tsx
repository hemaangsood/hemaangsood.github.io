import { useTexture } from "@react-three/drei";
import React from "react";
import { SUN_POINT } from "./constants";
import * as THREE from "three";

type SunProps = {
	sunMeshRef?: React.Ref<THREE.Mesh>;
	sunLightRef?: React.Ref<THREE.PointLight>;
};

export function Sun({ sunMeshRef, sunLightRef }: SunProps) {
	const sunTexture = useTexture("/projects/sun.png");
	const SunSize = 2;
	const coronaMultiplier = 2.5;
	return (
		<>
			{/* Core sun */}
			<mesh ref={sunMeshRef} position={SUN_POINT}>
				<sphereGeometry args={[SunSize, 32, 32]} />
				<meshStandardMaterial
					color="#fff4cc"
					emissive="gold"
					emissiveIntensity={4.0}
					toneMapped={false}
					emissiveMap={sunTexture}
				/>
			</mesh>

			{/* Light */}
			<pointLight
				ref={sunLightRef}
				color="#fff5e0"
				position={SUN_POINT}
				intensity={1000}
				distance={80}
				decay={2}
			/>

			{/* Corona shell */}
			<mesh position={SUN_POINT}>
				<sphereGeometry args={[SunSize * coronaMultiplier, 64, 64]} />
				<shaderMaterial
					transparent
					depthWrite={false}
					blending={THREE.AdditiveBlending}
					uniforms={{
						uColor: { value: new THREE.Color("#ff8800") },
						uCenter: { value: new THREE.Vector3(...SUN_POINT) },
						uInnerRadius: { value: SunSize },
						uOuterRadius: { value: SunSize * coronaMultiplier },

						uRadialStrength: { value: 1.2 },
						uFresnelStrength: { value: 1.5 },
						uRadialPower: { value: 6.0 },
						uFresnelPower: { value: 2.5 },
						uIntensity: { value: 1.0 },
					}}
					vertexShader={`
        varying vec3 vNormal;
		varying vec3 vWorldPosition;

		void main() {
			vNormal = normalize(normalMatrix * normal);
			vec4 worldPos = modelMatrix * vec4(position, 1.0);
			vWorldPosition = worldPos.xyz;
			gl_Position = projectionMatrix * viewMatrix * worldPos;
		}
			`}
					fragmentShader={`
precision highp float;

uniform vec3 uColor;
uniform vec3 uCenter;
uniform float uInnerRadius;
uniform float uOuterRadius;

uniform float uRadialStrength;
uniform float uFresnelStrength;
uniform float uRadialPower;
uniform float uFresnelPower;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vWorldPosition;

// --------------------
// Noise (stable)
// --------------------
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
         (c - a) * u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}

void main() {
  vec3 toCenter = vWorldPosition - uCenter;
  float dist = length(toCenter);

  // avoid divide-by-zero
  vec3 dir = normalize(toCenter + vec3(1e-6));

  vec3 viewDir = normalize(cameraPosition - vWorldPosition);

  // --------------------
  // Radial falloff (tight)
  // --------------------
  float t = clamp(
    (dist - uInnerRadius) / (uOuterRadius - uInnerRadius),
    0.0,
    1.0
  );

  float radial = pow(1.0 - t, 6.0);

  // --------------------
  // Fresnel (edge glow)
  // --------------------
  float fresnel = pow(
    clamp(1.0 - dot(vNormal, viewDir), 0.0, 1.0),
    2.5
  );

  // --------------------
  // Angular rays (SAFE)
  // --------------------
  float angle = atan(dir.y, dir.x); // safe form

  float rays = sin(angle * 40.0);
  rays = abs(rays);                 // avoid negative
  rays = pow(rays, 8.0);           // sharp spikes

  // add slight randomness
  float n = noise(dir.xy * 3.0);
  n = clamp(n, 0.7, 1.0);

  float rayMask = rays * n;

  // --------------------
  // Combine
  // --------------------
  float intensity =
      radial * uRadialStrength +
      fresnel * uFresnelStrength +
      rayMask * 3.0;

  intensity = clamp(intensity, 0.0, 10.0);
  intensity = pow(intensity, 1.2);

  // kill outer fog
  float fade = 1.0 - smoothstep(0.3, 1.0, t);
  intensity *= fade;

  // final alpha
  float alpha = clamp(intensity * uIntensity, 0.0, 1.0);

  gl_FragColor = vec4(uColor, alpha);
}
          `}
				/>
			</mesh>
		</>
	);
}
