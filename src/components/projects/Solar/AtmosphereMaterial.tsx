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
    varying vec3 vPosition;
    void main() {
        vNormal = normalize(mat3(normalMatrix) * normal);
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
	`
    uniform vec3 uSunPosition;
    uniform vec3 uAtmosphereColor;
    uniform float uIntensity;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - dot(vNormal, viewDir), 2.0);

        vec3 lightDir = normalize(uSunPosition - vPosition);
        float daylight = clamp(dot(vNormal, lightDir), 0.0, 1.0);

        float atmosphere = fresnel * (0.3 + 0.7 * daylight);
        vec3 nightColor = vec3(0.0, 0.02, 0.05);
        vec3 dayColor = uAtmosphereColor * atmosphere * uIntensity;

        gl_FragColor = vec4(nightColor + dayColor, atmosphere + 0.1);
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
