import { Line, shaderMaterial, useTexture } from "@react-three/drei";
import { extend, useThree } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import type { Mesh } from "three";
import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { randFloat } from "three/src/math/MathUtils.js";

interface SolarProps {
	size: number;
	centerAt?: [number, number, number];
	renderOrbit?: boolean;
	orbitRadius: number;
	color?:string;
	rotationSpeed?: number;
	rotation?: [number, number, number];
	orbitSegments?: number;
	eccentricity?: number;
	orbitOffsetPlaneRotationOffset?:number,
}

const Pi = Math.PI;
const radian = Math.PI / 180;
const sunPoint = [0, 0, 0] as [number, number, number];

function getOrbitPoint(
	major: number,
	minor: number,
	angle: number,
): THREE.Vector3 {
	return new THREE.Vector3(
		major * Math.sin(angle),
		0,
		minor * Math.cos(angle),
	);
}

const solarElements: SolarProps[] = [
	{
		size: 0.5,
		orbitRadius: 6,
		color: "green",
		rotationSpeed: -0.1,
		orbitOffsetPlaneRotationOffset: 15,
	},
	{
		size: 0.3,
		orbitRadius: 10,
		color: "red",
		rotationSpeed: 0.04,
		orbitOffsetPlaneRotationOffset: -5,
	},
	{
		size: 0.2,
		orbitRadius: 14,
		color: "cyan",
		rotationSpeed: 0.03,
		orbitSegments: 80,
		orbitOffsetPlaneRotationOffset: 0,
	},
	{
		size: 0.4,
		orbitRadius: 16,
		color: "blue",
		rotationSpeed: -0.02,
		orbitSegments: 96,
		eccentricity: -0.3,
		orbitOffsetPlaneRotationOffset: 5,
	},
	{
		size: 0.25,
		orbitRadius: 18,
		color: "yellow",
		rotationSpeed: 0.01,
		orbitSegments: 128,
		eccentricity: 0.2,
		orbitOffsetPlaneRotationOffset: 30,
	},
];

function getPosition(a: number, b: number, angle: number) {
	const v = getOrbitPoint(a, b, angle);
	return [v.x, v.y, v.z] as [number, number, number];
}

const AtmosphereMaterial = shaderMaterial(
	{
		uSunPosition: new THREE.Vector3(...sunPoint),
		uAtmosphereColor: new THREE.Vector3(0.3, 0.6, 1.0), // blue
		uIntensity: 2.0,
	},
	// vertex shader
	`
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
        vNormal = normalize(mat3(normalMatrix) * normal);
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
	// fragment shader
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

function OrbitEllipse({
	majorX,
	majorZ,
	segments = 128,
	lineWidth = 0.5,
}: {
	majorX: number;
	majorZ: number;
	segments?: number;
	lineWidth?: number;
}) {
	const points = Array.from({ length: segments + 1 }, (_, i) =>
		getOrbitPoint(majorX, majorZ, (i / segments) * 2 * Math.PI),
	);
	return (
		<Line
			points={points}
			color="white"
			lineWidth={lineWidth}
			opacity={0.1}
			transparent
		/>
	);
}

function SolarObject({
	size=1,
	centerAt=sunPoint,
	renderOrbit=true,
	color="blue",
	orbitRadius,
	rotationSpeed=0.01,
	rotation = [0, 0, 0],
	orbitSegments = 50,
	eccentricity = .5,
	orbitOffsetPlaneRotationOffset = 0,
}: SolarProps){
	if(eccentricity >= 1) eccentricity = 0.99;
	const absE = Math.abs(eccentricity);
	const a = orbitRadius;
	const b = a * Math.sqrt(1 - absE ** 2);

	// negative eccentricity = swapped axes
	const [majorX, majorZ] = eccentricity < 0 ? [a, b] : [b, a];
	const startAngle = randFloat(0, 2 * Pi);
	const planetStartPos: [number, number, number] = getPosition(majorX, majorZ, startAngle);
	const planetPosition = useRef({ majorX, majorZ, angle: startAngle });
	const planet = useRef<Mesh>(null);
	const orbitThickness = 0.5;
	useFrame((_, delta) => {
		planetPosition.current.angle += rotationSpeed * delta;
		const newPos = getPosition(planetPosition.current.majorX, planetPosition.current.majorZ, planetPosition.current.angle);
		if (planet.current) {
			planet.current.position.set(newPos[0], newPos[1], newPos[2]);
			planet.current.rotation.y += delta * 0.3;
		}
	});
	return (
		<mesh
			position={centerAt}
			rotation={
				// rotation.map((v) => v * radian) as [number, number, number]
				[(rotation[0]+orbitOffsetPlaneRotationOffset) * radian, rotation[1] * radian , rotation[2] * radian] as [number, number, number]
			}
		>
			{renderOrbit && <OrbitEllipse majorX={majorX} majorZ={majorZ}
				segments={orbitSegments}
				lineWidth={orbitThickness}
			/>}
			<mesh position={planetStartPos} ref={planet}>
				<sphereGeometry args={[size, 32, 32]} />
				<meshStandardMaterial color={color} fog={false} />
				<mesh scale={1.05}>
					<sphereGeometry args={[size, 64, 64]} />
					<atmosphereMaterial
						transparent
						depthWrite={false}
						fog={false}
						side={THREE.FrontSide}
						uAtmosphereColor={
							new THREE.Vector3(
								...new THREE.Color(color).toArray(),
							)
						}
						uIntensity={1.2}
					/>
				</mesh>
			</mesh>
		</mesh>
	);
}

function BackgroundStars({ count = 6000 }: { count?: number }) {
	const minDist = 25; 
	const maxDist = 80; 
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

			// Color — mostly white/blue-white, occasional warm star
			const warm = randFloat(0, 1) < 0.15;
			const c = new THREE.Color().setHSL(
				warm ? randFloat(0.05, 0.1) : randFloat(0.55, 0.65),
				warm ? randFloat(0.3, 0.6) : randFloat(0.0, 0.2),
				randFloat(0.85, 1.0),
			);
			colors[i * 3] = c.r;
			colors[i * 3 + 1] = c.g;
			colors[i * 3 + 2] = c.b;

			// Size variation
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
			<pointsMaterial
				vertexColors
				sizeAttenuation={false} // keeps stars same size regardless of zoom
				size={1.5}
				transparent
				opacity={0.9}
			/>
		</points>
	);
}

function Sun(){
	const sunTexture = useTexture("/projects/sun.png");
	return (
		<mesh position={sunPoint}>
			<sphereGeometry args={[3, 32, 32]} />
			<meshStandardMaterial
				color="yellow"
				emissive="gold"
				emissiveIntensity={2}
				emissiveMap={sunTexture}
			/>
		</mesh>
	)
}

function CameraSetup(){
	const { camera } = useThree();
	useEffect(() => {
		// camera.position.set(0, camScale, camScale);
		camera.lookAt(new THREE.Vector3(...sunPoint));
	}, [camera]);
	return <></>;
}

function NebulaRing() {
	const mesh = useRef<Mesh>(null);

	const material = useMemo(() => {
		return new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uGlowColor1: { value: new THREE.Color("#7b2fff") }, // purple
				uGlowColor2: { value: new THREE.Color("#00c8aa") }, // teal
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

	float coreK = 8.0;   // core sharpness
	float haloK = 5.0;   // halo spread
	float coreWeight = 0.7;
	float haloWeight = 0.3;

	float core = exp(-coreK * t * t);
	float halo = exp(-haloK * t * t);

	float density = core * coreWeight + halo * haloWeight;
	density *= smoothstep(0.5, 0.0, t);
	density *= exp(-1.5 * t);

	float angle = vUv.x * 6.2832;
	float band1 = sin(angle * 3.0 + uTime * 0.08) * 0.5 + 0.5;
	float band2 = sin(angle * 5.0 - uTime * 0.05 + 1.2) * 0.5 + 0.5;

	vec3 col = mix(uGlowColor1, uGlowColor2, band1 * 0.6 + band2 * 0.4);

	float n = noise(vUv * 8.0 + uTime * 0.02);
	col *= (0.85 + n * 0.3);

	vec3 finalColor = col * density * 1.5;
	finalColor = clamp(finalColor, 0.0, 1.0);

	float alpha = density * 0.6;
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
			// mesh.current.rotation.z += delta * 0.005; // very slow drift
		}
	});
	const radius = 100;
	const height = 100;
	return (
		<mesh
			ref={mesh}
			renderOrder={-1}
			position={[0, 0, 0]}
			material={material}
			rotation={[0*radian, 0*radian, 30*radian]}
		>
			{/* How to set inner radius??
				In order to set the inner radius, we would need to modify the torus geometry to have a larger tube radius and then use the shader to create a hollow effect. However, Three.js's built-in torus geometry does not support separate inner and outer radii directly.
				But what do the numbers do then
					The args for torusGeometry are [radius, tube, radialSegments, tubularSegments]. The 'radius' is the distance from the center of the torus to the center of the tube, and 'tube' is the radius of the tube itself. So by increasing the 'tube' value, we can make the ring thicker, which gives the appearance of a larger inner radius. However, this will also increase the overall size of the torus, so it's a bit of a balancing act to achieve the desired look.
			*/}
			{/* <torusGeometry args={[100, 40, 48, 128]} /> */}
			{/* The args for cylinderGeometry are [radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded] */}

			<cylinderGeometry args={[radius, radius, height, 128, 4, true]} />
			{/* <sphereGeometry args={[radius, 32, 32]} /> */}

		</mesh>
	);
}

export default function Solar(): React.JSX.Element {
	return (
		<Canvas
			style={{ background: "black", height: "100vh" }}
			camera={{ position: [20, 20, 0], fov: 80 }}
			dpr={[1, 1.5]}
			fallback={<div>Sorry no WebGL supported!</div>}
		>
			<CameraSetup />
			<ambientLight intensity={0.2} position={[0, 20, 0]} />
			<Sun />
			<pointLight
				color="#fff5e0"
				position={sunPoint}
				intensity={300}
				distance={200}
				decay={1}
			/>
			{solarElements.map((props, idx) => (
				<SolarObject key={idx} {...props} />
			))}
			<NebulaRing />
			<fogExp2 attach="fog" args={["#0d0825", 0.008]} />
			<BackgroundStars count={2000} />
			<EffectComposer>
				<Bloom
					intensity={1.0}
					luminanceThreshold={0.05}
					luminanceSmoothing={0.9}
					mipmapBlur
				/>
			</EffectComposer>
		</Canvas>
	);
}