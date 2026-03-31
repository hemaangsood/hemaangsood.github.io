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
    precision highp float;

uniform vec3 uSunPosition;
uniform vec3 uAtmosphereColor;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = vec3(modelMatrix * vec4(position, 1.0));
    gl_Position = projectionMatrix * viewMatrix * vec4(vPosition, 1.0);
}
    `,
    `
    precision highp float;

uniform vec3 uSunPosition;
uniform vec3 uAtmosphereColor;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 normalDir = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vPosition);

    // Fresnel (edge glow)
    float fresnelBase = clamp(1.0 - dot(normalDir, viewDir), 0.0, 1.0);
    float fresnel = pow(fresnelBase, 3.0);

    // Light influence
    vec3 lightDir = normalize(uSunPosition - vPosition);
    float daylight = clamp(dot(normalDir, lightDir), 0.0, 1.0);

    // Combine
    float glow = clamp(fresnel * (0.3 + 0.7 * daylight), 0.0, 1.0);

    // FINAL COLOR (subtle)
    vec3 color = uAtmosphereColor * glow * min(uIntensity, 3.0);
    color = clamp(color, 0.0, 1.0);

    // IMPORTANT: alpha mostly from fresnel (edge only)
    float alpha = clamp(fresnel * 0.35, 0.0, 0.35);

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
