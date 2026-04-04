import React, { useMemo } from "react";
import * as THREE from "three";
import { randFloat } from "three/src/math/MathUtils.js";
import { SUN_POINT } from "./constants";

interface BackgroundStarsProps {
	count?: number;
	sunPosition?:THREE.Vector3;
}

export function BackgroundStars({ count = 300, sunPosition }: BackgroundStarsProps) {
	const minDist = 25;
	const maxDist = 50;

	const { positions, colors, sizes } = useMemo(() => {
		const positions = new Float32Array(count * 3);
		const colors = new Float32Array(count * 3);
		const sizes = new Float32Array(count);

		for (let i = 0; i < count; i++) {
			const theta = randFloat(0, 1) * 2 * Math.PI;
			const phi = Math.acos(2 * randFloat(0, 1) - 1);
			const r = minDist + randFloat(0, 1) * (maxDist - minDist);

			positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
			positions[i * 3 + 2] = r * Math.cos(phi);

			const warm = randFloat(0, 1) < 0.15;
			const c = new THREE.Color().setHSL(
				warm ? randFloat(0.05, 0.1) : randFloat(0.55, 0.65),
				warm ? randFloat(0.3, 0.6) : randFloat(0.0, 0.2),
				randFloat(0.85, 1.0),
			);
			colors[i * 3] = c.r;
			colors[i * 3 + 1] = c.g;
			colors[i * 3 + 2] = c.b;

			sizes[i] = randFloat(0.5, 2.5);
		}
		return { positions, colors, sizes };
	}, [count]);

	return (
		<points>
			<bufferGeometry>
				<bufferAttribute
					attach="attributes-position"
					args={[positions, 3]}
				/>
				<bufferAttribute attach="attributes-color" args={[colors, 3]} />
				<bufferAttribute attach="attributes-size" args={[sizes, 1]} />
			</bufferGeometry>

			<shaderMaterial
				transparent
				depthWrite={false}
				blending={THREE.AdditiveBlending}
				vertexShader={`
      attribute float size;
      attribute vec3 color;

      varying vec3 vColor;
      varying vec3 vWorldPosition;

      void main() {
        vColor = color;

        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;

        vec4 mvPosition = viewMatrix * worldPos;
        gl_Position = projectionMatrix * mvPosition;

        gl_PointSize = size;
      }
    `}
				fragmentShader={`
      uniform vec3 uSunPosition;
      uniform vec3 uCameraPosition;

      varying vec3 vColor;
      varying vec3 vWorldPosition;

      void main() {
        // circular star shape
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;

        // direction from camera
        vec3 viewDir = normalize(vWorldPosition - uCameraPosition);
        vec3 sunDir = normalize(uSunPosition - uCameraPosition);

        // alignment (1 = same direction)
        float alignment = dot(viewDir, sunDir);

        // fade near sun
        float fade = smoothstep(0.75, 0.98, alignment);

        float visibility = 1.0 - fade;

        gl_FragColor = vec4(vColor, visibility);
      }
    `}
				uniforms={{
					uSunPosition: { value: new THREE.Vector3(...SUN_POINT) },
					uCameraPosition: { value: new THREE.Vector3() },
				}}
			/>
		</points>
	);
}
