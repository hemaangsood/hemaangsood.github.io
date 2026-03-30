import { Canvas } from "@react-three/fiber";
import React from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { BackgroundStars } from "./BackgroundStars";
import { CameraSetup } from "./CameraSetup";
import { NebulaRing } from "./NebulaRing";
import { Planet } from "./Planet";
import { SolarObject } from "./SolarObject";
import { SUN_POINT } from "./constants";
import { solarElements } from "./solarData";
import { Sun } from "./Sun";

export default function Solar(): React.JSX.Element {
	return (
		<Canvas
			style={{ background: "black", height: "100vh" }}
			camera={{ position: [20, 20, 0], fov: 80 }}
			dpr={[1, 1.5]}
			fallback={<div>Sorry no WebGL supported!</div>}
			gl={{ logarithmicDepthBuffer: true }}
		>
			<CameraSetup />
			<ambientLight intensity={0.5} position={[0, 20, 0]} />
			<Sun />
			<pointLight
				color="#fff5e0"
				position={SUN_POINT}
				intensity={50}
				distance={80}
				decay={2}
			/>
			{solarElements.map((element, idx) => (
				<SolarObject key={idx} {...element.orbit}>
					<Planet {...element.planet} />
				</SolarObject>
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