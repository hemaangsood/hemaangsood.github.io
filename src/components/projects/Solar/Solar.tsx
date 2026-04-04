import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { CameraSetup } from "./CameraSetup";
import { NebulaRing } from "./NebulaRing";
import { solarElements } from "./solarData";
import { Sun } from "./Sun";
import * as THREE from "three";
import Stats from "stats.js";
import { OrbitControls, useTexture } from "@react-three/drei";


function StatsPanel({ enabled }: { enabled: boolean }) {
	const statsRef = React.useRef<Stats | null>(null);

	useEffect(() => {
		if (!enabled) return;

		const stats = new Stats();
		stats.showPanel(0);
		document.body.appendChild(stats.dom);
		statsRef.current = stats;

		return () => {
			document.body.removeChild(stats.dom);
		};
	}, [enabled]);

	useFrame(() => {
		if (!statsRef.current) return;
		statsRef.current.begin();
		statsRef.current.end();
	});

	return null;
}

function OrbitControlsComponent() {
	return (
		<OrbitControls
			enablePan={true}
			enableZoom={true}
			maxDistance={50}
			minDistance={5}
		/>
	);
}

for (const texturePath of solarElements
	.map((element) => element.planet.textureMap)
	.filter((texturePath): texturePath is string => Boolean(texturePath))) {
	useTexture.preload(texturePath);
}

useTexture.preload("/projects/sun.png");

type SolarProps = {
	isActive?: boolean;
};

export default function Solar({ isActive = true }: SolarProps): React.JSX.Element {
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
			className="block h-full w-full"
			style={{ background: "black" }}
			camera={{ position: [24, 15, 0], fov: 80 }}
			dpr={[1, 1.2]}
			frameloop={isActive ? "always" : "never"}
			fallback={<div>Sorry no WebGL supported!</div>}
			gl={{
				logarithmicDepthBuffer: true,
				toneMapping: THREE.ACESFilmicToneMapping,
			}}
		>
			<CameraSetup />
			<OrbitControlsComponent />
			<fogExp2 attach="fog" args={["#0d0825", 0.004]} />
			<Sun shouldMountHeavyEffects={shouldMountHeavyEffects} />
			<StatsPanel enabled={false} />
			<ambientLight color="#404040" intensity={1.0} />
			<NebulaRing />
		</Canvas>
	);
}
