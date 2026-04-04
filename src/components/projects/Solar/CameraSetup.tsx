import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import { SUN_POINT } from "./constants";

export function CameraSetup() {
	const { camera } = useThree();

	useEffect(() => {
		camera.lookAt(...SUN_POINT);
	}, [camera]);

	return null;
}
