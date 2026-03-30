import * as THREE from "three";

export function getOrbitPoint(
	major: number,
	minor: number,
	angle: number,
): THREE.Vector3 {
	return new THREE.Vector3(
		major * Math.sin(angle),
		0,
		minor * Math.cos(angle),
	);
}

export function getPosition(a: number, b: number, angle: number) {
	const v = getOrbitPoint(a, b, angle);
	return [v.x, v.y, v.z] as [number, number, number];
}
