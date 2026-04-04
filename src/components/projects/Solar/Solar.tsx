import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
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
import AsteroidBelt from "./AsteroidBelt";

export default function Solar(): React.JSX.Element {
	const [sunMesh, setSunMesh] = React.useState<THREE.Mesh | null>(null);
	const [sunLight, setSunLight] = React.useState<THREE.PointLight | null>(null);
	const [shouldMountHeavyEffects, setShouldMountHeavyEffects] = useState(false);

	useEffect(() => {
		const frame = window.requestAnimationFrame(() => {
			setShouldMountHeavyEffects(true);
		});

		return () => window.cancelAnimationFrame(frame);
	}, []);

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
			{shouldMountHeavyEffects && (
				<>
					<AsteroidBelt orbitRadius={10.0} count={1000}/>
					<AsteroidBelt orbitRadius={22.0} count={2500} height={1.0} size={0.1} />
				</>
			)}
			<ambientLight color="#404040" intensity={1.0} />
			{solarElements.map((element, idx) => {
				const orbitConfig = Array.isArray(element.orbit)
					? element.orbit[0]
					: element.orbit;

				return (
					<SolarObject key={idx} {...orbitConfig}>
						<Planet {...element.planet} useAtmosphere={true} />
						{shouldMountHeavyEffects &&
							element.asteroidBelts?.map((belt, beltIndex) => (
								<AsteroidBelt
									key={`belt-${idx}-${beltIndex}`}
									{...belt}
								/>
							))}
					</SolarObject>
				);
			})}
			<NebulaRing />
			{shouldMountHeavyEffects && (
				<>
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
								intensity={1.5}
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
		</Canvas>
	);
}
