import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import * as THREE from "three";
import { SUN_POINT } from "./constants";

export function CameraSetup() {
	const { camera } = useThree();

	useEffect(() => {
		camera.lookAt(new THREE.Vector3(...SUN_POINT));
	}, [camera]);

	return null;
}
