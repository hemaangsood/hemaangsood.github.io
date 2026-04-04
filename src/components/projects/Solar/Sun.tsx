import { useTexture } from "@react-three/drei";
import { Bloom, EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import React, { useState } from "react";
import { SUN_POINT } from "./constants";
import * as THREE from "three";
import { BackgroundStars } from "./BackgroundStars";
import AsteroidBelt from "./AsteroidBelt";
import { Planet } from "./Planet";
import { solarElements } from "./solarData";
import { SolarObject } from "./SolarObject";

type SunProps = {
	shouldMountHeavyEffects?: boolean;
};

export function Sun({
	shouldMountHeavyEffects = false,
}: SunProps) {
	const sunTexture = useTexture("/projects/sun.png");
	const [sunMesh, setSunMesh] = useState<THREE.Mesh | null>(null);
	const [sunLight, setSunLight] = useState<THREE.PointLight | null>(null);
	const SunSize = 2;
	const coronaMultiplier = 1.01;
	return (
		<>
			{/* Core sun */}
			<mesh ref={setSunMesh} position={SUN_POINT}>
				<sphereGeometry args={[SunSize, 32, 32]} />
				<meshStandardMaterial
					color="#fff4cc"
					emissive="gold"
					emissiveIntensity={5.0}
					toneMapped={false}
					emissiveMap={sunTexture}
				/>
			</mesh>

      {shouldMountHeavyEffects && (
				<>
					{/* Light */}
					<pointLight
						ref={setSunLight}
						color="#fff5e0"
						position={SUN_POINT}
						intensity={1000}
						distance={80}
						decay={2}
						castShadow
						shadow-mapSize-width={2048}
						shadow-mapSize-height={2048}
						shadow-camera-near={0.1}
						shadow-camera-far={200}
						shadow-bias={-0.001}
					/>

					<mesh position={SUN_POINT}>
						<sphereGeometry args={[SunSize * coronaMultiplier, 64, 64]} />
						<shaderMaterial
							transparent
							depthWrite={false}
							blending={THREE.AdditiveBlending}
							uniforms={{
								uCenter: { value: new THREE.Vector3(...SUN_POINT) },
								uIntensity: { value: 1.5 },
							}}
							vertexShader={`
      varying vec3 vWorldPosition;

      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `}
					fragmentShader={`
      precision highp float;

uniform vec3 uCenter;
uniform float uIntensity;

varying vec3 vWorldPosition;

// --------------------
// simple noise (stable)
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
  // view-space direction (KEY FIX)
  vec3 viewDir = normalize(vWorldPosition - cameraPosition);

  // project to 2D plane
  vec2 uv = normalize(viewDir.xy + vec2(1e-6));

  // radial angle
  float angle = atan(uv.y, uv.x);

  // create many rays
  float rays = sin(angle * 40.0);

  // make positive + sharp
  rays = abs(rays);
  rays = pow(rays, 10.0);

  // add slight randomness (break perfection)
  float n = noise(uv * 4.0);
  n = clamp(n, 0.8, 1.0);

  rays *= n;

  // keep only strongest spikes (CRITICAL)
  rays = step(0.85, rays) * rays;

  // final alpha
  float alpha = clamp(rays * uIntensity, 0.0, 1.0);

  gl_FragColor = vec4(vec3(1.0, 0.6, 0.1), alpha);
}
    `}
						/>
					</mesh>

					<AsteroidBelt orbitRadius={10.0} count={1000} />
					<AsteroidBelt
						orbitRadius={22.0}
						count={1500}
						height={1.0}
						size={0.15}
						thickness={0.3}
					/>

					{solarElements.map((element, idx) => {
						const orbitConfig = Array.isArray(element.orbit)
							? element.orbit[0]
							: element.orbit;

						return (
							<SolarObject key={idx} {...orbitConfig}>
								<Planet {...element.planet} useAtmosphere={true} />
								{element.asteroidBelts?.map((belt, beltIndex) => (
									<AsteroidBelt
										key={`belt-${idx}-${beltIndex}`}
										{...belt}
									/>
								))}
							</SolarObject>
						);
					})}
					<BackgroundStars count={320} />
					<EffectComposer>
						<Bloom
							intensity={1.2}
							luminanceThreshold={0.2}
							luminanceSmoothing={0.9}
							mipmapBlur
						/>
						{sunMesh && sunLight ? (
							<SelectiveBloom
								selection={[sunMesh]}
								lights={[sunLight]}
								intensity={2.5}
								luminanceThreshold={0.5}
								luminanceSmoothing={0.2}
								mipmapBlur
							/>
						) : (
							<></>
						)}
					</EffectComposer>
				</>
			)}
		</>
	);
}
