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
import { CAMERA_DISTANCE_MAX, CAMERA_DISTANCE_MIN, SUN_POINT } from "./constants";
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
	onCameraDistanceChange: () => void;
};

function OrbitControlsComponent({
	controlsRef,
	selectionLocked,
	onCameraDistanceChange,
}: OrbitControlsComponentProps) {
	return (
		<OrbitControls
			ref={controlsRef}
			enabled={!selectionLocked}
			onChange={onCameraDistanceChange}
			enableDamping={true}
			dampingFactor={0.08}
			enableRotate={true}
			enablePan={true}
			enableZoom={true}
			maxDistance={CAMERA_DISTANCE_MAX}
			minDistance={CAMERA_DISTANCE_MIN}
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

const OVERLAY_SCALE_MIN = 0.98;
const OVERLAY_SCALE_MAX = 1.2;
const OVERLAY_SCALE_CURVE_EXPONENT = 1.6;
const OVERLAY_SCALE_EPSILON = 0.01;
const SELECTION_CAMERA_MIN_DISTANCE = 4.5;
const SELECTION_CAMERA_MAX_DISTANCE = 8.5;
const FALLBACK_SELECTION_CAMERA_OFFSET = new THREE.Vector3(3.5, 1.8, 3.5);

export default function Solar({ isActive = true }: SolarProps): React.JSX.Element {
	const [shouldMountHeavyEffects, setShouldMountHeavyEffects] = useState(false);
	const [selectedProject, setSelectedProject] = useState<SelectedProject>(null);
	const [isResettingCamera, setIsResettingCamera] = useState(false);
	const [overlayTextScale, setOverlayTextScale] = useState(1);
	const controlsRef = useRef<OrbitControlsImpl | null>(null);
	const selectedProjectPositionRef = useRef<THREE.Vector3 | null>(null);
	const selectedProjectCameraOffsetRef = useRef(FALLBACK_SELECTION_CAMERA_OFFSET.clone());

	const handleCameraDistanceChange = useCallback(() => {
		const controls = controlsRef.current;
		if (!controls) return;

		const cameraDistance = controls.object.position.distanceTo(controls.target);
		const normalized = THREE.MathUtils.clamp(
			(cameraDistance - CAMERA_DISTANCE_MIN) / (CAMERA_DISTANCE_MAX - CAMERA_DISTANCE_MIN),
			0,
			1,
		);
		const curvedNormalized = Math.pow(normalized, OVERLAY_SCALE_CURVE_EXPONENT);
		const nextScale = THREE.MathUtils.lerp(
			OVERLAY_SCALE_MIN,
			OVERLAY_SCALE_MAX,
			curvedNormalized,
		);

		setOverlayTextScale((previousScale) => {
			if (Math.abs(previousScale - nextScale) < OVERLAY_SCALE_EPSILON) {
				return previousScale;
			}

			return nextScale;
		});
	}, []);

	const handleProjectSelect = useCallback(
		(project: ProjectMetadata, worldPosition: THREE.Vector3) => {
			if (selectedProject?.id === project.id) {
				selectedProjectPositionRef.current = null;
				setSelectedProject(null);
				setIsResettingCamera(true);
				return;
			}

			const controls = controlsRef.current;
			if (controls) {
				selectedProjectCameraOffsetRef.current
					.copy(controls.object.position)
					.sub(worldPosition);

				const currentDistance = selectedProjectCameraOffsetRef.current.length();
				if (currentDistance > 0.001) {
					selectedProjectCameraOffsetRef.current.setLength(
						THREE.MathUtils.clamp(
							currentDistance,
							SELECTION_CAMERA_MIN_DISTANCE,
							SELECTION_CAMERA_MAX_DISTANCE,
						),
					);
				} else {
					selectedProjectCameraOffsetRef.current.copy(FALLBACK_SELECTION_CAMERA_OFFSET);
				}
			} else {
				selectedProjectCameraOffsetRef.current.copy(FALLBACK_SELECTION_CAMERA_OFFSET);
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
		selectedProjectCameraOffsetRef.current.copy(FALLBACK_SELECTION_CAMERA_OFFSET);
		setIsResettingCamera(true);
		setSelectedProject(null);
	}, [selectedProject]);

	const handleCameraResetComplete = useCallback(() => {
		setIsResettingCamera(false);
	}, []);

	useEffect(() => {
		const frame = window.requestAnimationFrame(() => {
			setShouldMountHeavyEffects(true);
			handleCameraDistanceChange();
		});

		return () => window.cancelAnimationFrame(frame);
	}, [handleCameraDistanceChange]);

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
					onCameraDistanceChange={handleCameraDistanceChange}
				/>
				<SelectionCameraController
					controlsRef={controlsRef}
					selectedProject={selectedProject}
					selectedProjectPositionRef={selectedProjectPositionRef}
					selectedProjectCameraOffsetRef={selectedProjectCameraOffsetRef}
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
				textScale={overlayTextScale}
			/>
		</div>
	);
}
