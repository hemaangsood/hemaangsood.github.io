import { Canvas, useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CameraSetup } from "./CameraSetup";
import { NebulaRing } from "./NebulaRing";
import { solarElements } from "./solarData";
import { Sun } from "./Sun";
import * as THREE from "three";
import Stats from "stats.js";
import { OrbitControls, useTexture } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { SUN_POINT } from "./constants";
import { AsteroidBeltLOD } from "./AsteroidBeltLOD";
import { OrbitalObject } from "./OrbitingObject";
import { Planet } from "./Planet";
import { SelectionCameraController } from "./SelectionCameraController";
import { ProjectDetailsOverlay } from "./ProjectDetailsOverlay";
import type { ProjectMetadata, SelectedProject } from "./types";


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

type OrbitControlsComponentProps = {
	controlsRef: React.RefObject<OrbitControlsImpl | null>;
	selectionLocked: boolean;
};

function OrbitControlsComponent({
	controlsRef,
	selectionLocked,
}: OrbitControlsComponentProps) {
	return (
		<OrbitControls
			ref={controlsRef}
			enabled={!selectionLocked}
			enableDamping={true}
			dampingFactor={0.08}
			enableRotate={true}
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
	const [selectedProject, setSelectedProject] = useState<SelectedProject>(null);
	const [isResettingCamera, setIsResettingCamera] = useState(false);
	const controlsRef = useRef<OrbitControlsImpl | null>(null);
	const selectedProjectPositionRef = useRef<THREE.Vector3 | null>(null);

	const handleProjectSelect = useCallback(
		(project: ProjectMetadata, worldPosition: THREE.Vector3) => {
			if (selectedProject?.id === project.id) {
				selectedProjectPositionRef.current = null;
				setSelectedProject(null);
				setIsResettingCamera(true);
				return;
			}

			selectedProjectPositionRef.current = worldPosition.clone();
			setIsResettingCamera(false);
			setSelectedProject(project);
		},
		[selectedProject?.id],
	);

	const handleProjectPositionUpdate = useCallback(
		(projectId: string, worldPosition: THREE.Vector3) => {
			if (selectedProject?.id !== projectId) return;

			if (!selectedProjectPositionRef.current) {
				selectedProjectPositionRef.current = worldPosition.clone();
				return;
			}

			selectedProjectPositionRef.current.copy(worldPosition);
		},
		[selectedProject?.id],
	);

	const handleProjectDeselect = useCallback(() => {
		if (!selectedProject) return;

		selectedProjectPositionRef.current = null;
		setIsResettingCamera(true);
		setSelectedProject(null);
	}, [selectedProject]);

	const handleCameraResetComplete = useCallback(() => {
		setIsResettingCamera(false);
	}, []);

	useEffect(() => {
		const frame = window.requestAnimationFrame(() => {
			setShouldMountHeavyEffects(true);
		});

		return () => window.cancelAnimationFrame(frame);
	}, []);

	return (
		<div className="relative h-full w-full">
			<Canvas
				id="solar-canvas"
				className="block h-full w-full"
				style={{ background: "black" }}
				camera={{ position: [24, 15, 0], fov: 80 }}
				dpr={[1, 1.2]}
				frameloop={isActive ? "always" : "never"}
				fallback={<div>Sorry no WebGL supported!</div>}
				onPointerMissed={handleProjectDeselect}
				gl={{
					logarithmicDepthBuffer: true,
					toneMapping: THREE.ACESFilmicToneMapping,
				}}
			>
				<CameraSetup />
				<OrbitControlsComponent
					controlsRef={controlsRef}
					selectionLocked={Boolean(selectedProject) || isResettingCamera}
				/>
				<SelectionCameraController
					controlsRef={controlsRef}
					selectedProject={selectedProject}
					selectedProjectPositionRef={selectedProjectPositionRef}
					shouldRestoreDefault={isResettingCamera}
					onRestoreDefaultComplete={handleCameraResetComplete}
				/>
				<fogExp2 attach="fog" args={["#0d0825", 0.004]} />
				<Sun shouldMountHeavyEffects={shouldMountHeavyEffects} />
				{
					shouldMountHeavyEffects && (
					<>
						<AsteroidBeltLOD
							orbitRadius={10.0}
							count={1000}
							centerPosition={SUN_POINT}
						/>
						<AsteroidBeltLOD
							orbitRadius={22.0}
							count={1500}
							height={1.0}
							size={0.15}
							thickness={0.3}
							centerPosition={SUN_POINT}
						/>

						{solarElements.map((element, idx) => (
							<OrbitalObject key={idx} {...element.orbit}>
								<Planet
									{...element.planet}
									asteroidBelts={element.asteroidBelts}
									selectedProjectId={selectedProject?.id ?? null}
									onProjectSelect={handleProjectSelect}
									onProjectPositionUpdate={handleProjectPositionUpdate}
									useAtmosphere={true}
								/>
							</OrbitalObject>
						))}
					</>)
				}
				<StatsPanel enabled={false} />
				<ambientLight color="#404040" intensity={1.0} />
				<NebulaRing />
			</Canvas>
			<ProjectDetailsOverlay
				project={selectedProject}
				onClose={handleProjectDeselect}
			/>
		</div>
	);
}
