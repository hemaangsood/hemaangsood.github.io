import { Canvas } from "@react-three/fiber";
import React from "react";
import { Bloom, EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import { BackgroundStars } from "./BackgroundStars";
import { CameraSetup } from "./CameraSetup";
import { NebulaRing } from "./NebulaRing";
import { Planet } from "./Planet";
import { SolarObject } from "./SolarObject";
import { solarElements } from "./solarData";
import { Sun } from "./Sun";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { AmbientLight } from "three";

export default function Solar(): React.JSX.Element {
	const [sunMesh, setSunMesh] = React.useState<THREE.Mesh | null>(null);
	const [sunLight, setSunLight] = React.useState<THREE.PointLight | null>(null);

	return (
		<Canvas
			id="solar-canvas"
			style={{ background: "black", height: "100vh" }}
			camera={{ position: [24, 15, 0], fov: 80 }}
			dpr={[1, 1.5]}
			fallback={<div>Sorry no WebGL supported!</div>}
			gl={{
				logarithmicDepthBuffer: true,
				toneMapping: THREE.ACESFilmicToneMapping,
			}}
		>
			<CameraSetup />
			<OrbitControls
				enablePan={true}
				enableZoom={true}
				maxDistance={50}
				minDistance={5}
			/>
			<fogExp2 attach="fog" args={["#0d0825", 0.004]} />
			<Sun sunMeshRef={setSunMesh} sunLightRef={setSunLight} />
			<ambientLight
				color="#404040"
				intensity={6.0}
			/>
			{solarElements.map((element, idx) => (
				<SolarObject key={idx} {...element.orbit}>
					<Planet {...element.planet} useAtmosphere={true} />
				</SolarObject>
			))}
			<NebulaRing />
			<BackgroundStars count={500} />
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
						luminanceThreshold={0.05}
						luminanceSmoothing={0.9}
						mipmapBlur
					/>
				) : <></>}
			</EffectComposer>
		</Canvas>
	);
}
