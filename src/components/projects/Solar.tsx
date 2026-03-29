import { Line, shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";
import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { rand } from "three/src/nodes/math/MathNode.js";
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
const camScale = 30;
const sunPoint = [0, 5, 0] as [number, number, number];

function getOrbitPoint(a: number, b: number, angle: number): THREE.Vector3 {
	return new THREE.Vector3(b * Math.sin(angle), 0, a * Math.cos(angle));
}

function getPosition(a: number, b: number, angle: number) {
	const v = getOrbitPoint(a, b, angle);
	return [v.x, v.y, v.z] as [number, number, number];
}



// 1. Create the material
const AtmosphereMaterial = shaderMaterial(
	// uniforms (default values)
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

// 2. Register it with R3F so you can use it as JSX
extend({ AtmosphereMaterial });

// 3. TypeScript declaration
declare module "@react-three/fiber" {
	interface ThreeElements {
		atmosphereMaterial: ThreeElement<typeof AtmosphereMaterial>;
	}
}

function OrbitEllipse({
	a,
	b,
	segments = 128,
	lineWidth = 0.5,
}: {
	a: number;
	b: number;
	segments?: number;
	lineWidth?: number;
}) {
	const points = Array.from({ length: segments + 1 }, (_, i) =>
		getOrbitPoint(a, b, (i / segments) * 2 * Math.PI),
	);
	return (
		<Line
			points={points}
			color="white"
			lineWidth={lineWidth}
			opacity={0.3}
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
	rotation = [30, 60, 30],
	orbitSegments = 50,
	eccentricity = .5,
	orbitOffsetPlaneRotationOffset = 0,
}: SolarProps){
	if(eccentricity >= 1) eccentricity = 0.99;
	const a = orbitRadius;
	const b = a * Math.sqrt(1 - eccentricity ** 2); // standard orbital mechanics formula
	const startAngle = randFloat(0, 2 * Pi);
	const planetStartPos: [number, number, number] = getPosition(a, b, startAngle);
	const planetPosition = useRef({ a, b, angle: startAngle });
	const planet = useRef<Mesh>(null);
	const orbitThickness = 0.5;
	useFrame((_, delta) => {
		planetPosition.current.angle += rotationSpeed * delta;
		const newPos = getPosition(planetPosition.current.a, planetPosition.current.b, planetPosition.current.angle);
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
				[rotation[0] * radian, rotation[1] * radian + orbitOffsetPlaneRotationOffset*radian, rotation[2] * radian] as [number, number, number]
			}
		>
			{renderOrbit && <OrbitEllipse a={a} b={b}
				segments={orbitSegments}
				lineWidth={orbitThickness}
			/>}
			<mesh position={planetStartPos} ref={planet}>
				<sphereGeometry args={[size, 32, 32]} />
				<meshStandardMaterial color={color} />
				<mesh scale={1.05}>
					<sphereGeometry args={[size, 64, 64]} />
					<atmosphereMaterial
						transparent
						depthWrite={false}
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

const solarElements:SolarProps[] = [
	{size: 0.5, orbitRadius: 6,color:"green", rotationSpeed: 0.1,orbitOffsetPlaneRotationOffset:15},
	{size: 0.3, orbitRadius: 10,color:"red", rotationSpeed: 0.04,orbitOffsetPlaneRotationOffset:-10},
	{size: 0.2, orbitRadius: 14,color:"cyan", rotationSpeed: 0.03,orbitSegments:80,orbitOffsetPlaneRotationOffset:-5},
	{size: 0.4, orbitRadius: 16,color:"blue", rotationSpeed: 0.02,orbitSegments: 96,eccentricity: 0.3,orbitOffsetPlaneRotationOffset:5},
	{size: 0.25, orbitRadius: 22,color:"yellow", rotationSpeed: 0.01,orbitSegments: 128,eccentricity: 0.6,orbitOffsetPlaneRotationOffset: 15},
]

function BackgroundStars({ count = 3000 }: { count?: number }) {
	const mesh = useRef<THREE.InstancedMesh>(null);
	const starRange = 100;
	useEffect(() => {
		if (!mesh.current) return;
		const matrix = new THREE.Matrix4();

		for (let i = 0; i < count; i++) {
			matrix.setPosition(
				randFloat(-1 * starRange, starRange),
				randFloat(-1 * starRange, starRange),
				randFloat(-1 * starRange, starRange),
			);
			mesh.current.setMatrixAt(i, matrix);
		}
		mesh.current.instanceMatrix.needsUpdate = true;
	}, [count]);

	return (
		<instancedMesh ref={mesh} args={[undefined, undefined, count]}>
			<sphereGeometry args={[0.05, 4, 4]} />
			<meshBasicMaterial color="white" />
		</instancedMesh>
	);
}

export default function Solar(): React.JSX.Element {
	const starCount = 1000;
	return (
		<Canvas
			style={{ background: "black", height: "100vh" }}
			camera={{ position: [0, 0, camScale], fov: 80 }}
			fallback={<div>Sorry no WebGL supported!</div>}
		>
			<OrbitControls target={sunPoint} />
			{/* Sun */}
			<mesh position={sunPoint}>
				<sphereGeometry args={[3, 32, 32]} />
				<meshStandardMaterial
					color="yellow"
					emissive="gold"
					emissiveIntensity={3}
				/>
			</mesh>
			<pointLight
				color="#fff5e0"
				position={sunPoint}
				intensity={300}
				distance={200}
				decay={2}
			/>
			{solarElements.map((props, idx) => (
				<SolarObject key={idx} {...props} />
			))}
			<BackgroundStars count={starCount} />
			<EffectComposer>
				<Bloom
					intensity={1.5}
					luminanceThreshold={0.2} // only pixels brighter than this glow
					luminanceSmoothing={0.9}
					mipmapBlur // smoother, more natural glow
				/>
			</EffectComposer>
		</Canvas>
	);
}