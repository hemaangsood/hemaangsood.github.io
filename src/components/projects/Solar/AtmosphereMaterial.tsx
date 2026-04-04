import { shaderMaterial } from "@react-three/drei";
import type { ThreeElement } from "@react-three/fiber";
import { extend } from "@react-three/fiber";
import * as THREE from "three";
import { SUN_POINT } from "./constants";

const AtmosphereMaterial = shaderMaterial(
	{
		uSunPosition: new THREE.Vector3(...SUN_POINT),
		uAtmosphereColor: new THREE.Vector3(0.3, 0.6, 1.0),
		uIntensity: 2.0,
	},
	`
    varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);

    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
    `,
	`
precision highp float;

uniform vec3 uSunPosition;
uniform vec3 uAtmosphereColor;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vWorldPosition;

vec3 safeNormalize(vec3 v) {
    float len = length(v);
    return len > 0.0001 ? v / len : vec3(0.0, 0.0, 1.0);
}

void main() {
    vec3 normalDir = safeNormalize(vNormal);
    vec3 viewDir = safeNormalize(cameraPosition - vWorldPosition);

    // Fresnel (edge glow)
	float ndotv = dot(normalDir, viewDir);
	ndotv = clamp(ndotv, -1.0, 1.0);
	float fresnelBase = clamp(1.0 - ndotv, 0.0, 1.0);
    float fresnel = pow(fresnelBase, 3.0);

    // Light influence
    vec3 lightDir = safeNormalize(uSunPosition - vWorldPosition);
    float daylight = clamp(dot(normalDir, lightDir), 0.0, 1.0);

    // Combine
    float glow = clamp(fresnel * (0.3 + 0.7 * daylight), 0.0, 1.0);

    // FINAL COLOR (subtle)
    vec3 color = uAtmosphereColor * glow * min(uIntensity, 3.0);
    color = clamp(color, 0.0, 1.0);

    // IMPORTANT: alpha mostly from fresnel (edge only)
    float alpha = clamp(fresnel * 0.35, 0.05, 0.5);

    gl_FragColor = vec4(color, alpha);
}
    `,
);

extend({ AtmosphereMaterial });

declare module "@react-three/fiber" {
	interface ThreeElements {
		atmosphereMaterial: ThreeElement<typeof AtmosphereMaterial>;
	}
}

export { AtmosphereMaterial };
