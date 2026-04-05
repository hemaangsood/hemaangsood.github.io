import { useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { SUN_POINT } from "./constants";
import type { SelectedProject } from "./types";

type SelectionCameraControllerProps = {
	controlsRef: React.RefObject<OrbitControlsImpl | null>;
	selectedProject: SelectedProject;
	selectedProjectPositionRef: React.RefObject<THREE.Vector3 | null>;
	shouldRestoreDefault: boolean;
	onRestoreDefaultComplete: () => void;
};

export function SelectionCameraController({
	controlsRef,
	selectedProject,
	selectedProjectPositionRef,
	shouldRestoreDefault,
	onRestoreDefaultComplete,
}: SelectionCameraControllerProps) {
	const { camera } = useThree();
	const defaultCameraPosition = useMemo(() => new THREE.Vector3(24, 15, 0), []);
	const defaultTarget = useMemo(
		() => new THREE.Vector3(...SUN_POINT),
		[],
	);
	const cameraOffset = useMemo(() => new THREE.Vector3(3.5, 1.8, 3.5), []);
	const desiredTargetRef = useRef(defaultTarget.clone());
	const desiredCameraPosRef = useRef(defaultCameraPosition.clone());
	const cameraLookVectorRef = useRef(new THREE.Vector3());

	useFrame((_, delta) => {
		const selectedPosition = selectedProjectPositionRef.current;
		if (!selectedProject && !shouldRestoreDefault) {
			return;
		}

		if (selectedProject && selectedPosition) {
			desiredTargetRef.current.copy(selectedPosition);
			desiredCameraPosRef.current.copy(selectedPosition).add(cameraOffset);
		} else {
			desiredTargetRef.current.copy(defaultTarget);
			desiredCameraPosRef.current.copy(defaultCameraPosition);
		}

		const smoothing = 1 - Math.exp(-delta * 4.5);
		camera.position.lerp(desiredCameraPosRef.current, smoothing);

		const controls = controlsRef.current;
		if (controls) {
			controls.target.lerp(desiredTargetRef.current, smoothing);
			if (controls.enabled) {
				controls.update();
			} else {
				camera.lookAt(controls.target);
			}
		} else {
			camera.lookAt(desiredTargetRef.current);
		}

		if (!selectedProject && shouldRestoreDefault) {
			const cameraDone = camera.position.distanceTo(desiredCameraPosRef.current) < 0.1;
			camera.getWorldDirection(cameraLookVectorRef.current);
			const desiredDirection = desiredTargetRef.current
				.clone()
				.sub(camera.position)
				.normalize();
			const targetDone = cameraLookVectorRef.current.angleTo(desiredDirection) < 0.04;

			if (cameraDone && targetDone) {
				onRestoreDefaultComplete();
			}
		}
	});

	return null;
}
