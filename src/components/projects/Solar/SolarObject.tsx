import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import React, { useRef } from "react";
import { randFloat } from "three/src/math/MathUtils.js";
import { PI, RADIAN, SUN_POINT } from "./constants";
import { OrbitEllipse } from "./OrbitEllipse";
import { getPosition } from "./orbit";
import type { SolarObjectProps } from "./types";

export function SolarObject({
	centerAt = SUN_POINT,
	renderOrbit = true,
	orbitRadius,
	rotationSpeed = 0.01,
	rotation = [0, 0, 0],
	orbitSegments = 50,
	eccentricity = 0.5,
	orbitOffsetPlaneRotationOffset = 0,
	selfRotationSpeed = 0.3,
	children,
}: SolarObjectProps) {
	if (eccentricity >= 1) eccentricity = 0.99;

	const absE = Math.abs(eccentricity);
	const a = orbitRadius;
	const b = a * Math.sqrt(1 - absE ** 2);

	const [majorX, majorZ] = eccentricity < 0 ? [a, b] : [b, a];
	const startAngle = randFloat(0, 2 * PI);
	const orbitingObjectStartPos = getPosition(majorX, majorZ, startAngle);
	const orbitingObjectPosition = useRef({ majorX, majorZ, angle: startAngle });
	const orbitingObject = useRef<Mesh>(null);
	const orbitThickness = 0.5;

	useFrame((_, delta) => {
		orbitingObjectPosition.current.angle += rotationSpeed * delta;
		const newPos = getPosition(
			orbitingObjectPosition.current.majorX,
			orbitingObjectPosition.current.majorZ,
			orbitingObjectPosition.current.angle,
		);
		if (orbitingObject.current) {
			orbitingObject.current.position.set(newPos[0], newPos[1], newPos[2]);
			orbitingObject.current.rotation.y += delta * selfRotationSpeed;
		}
	});

	return (
		<mesh
			position={centerAt}
			rotation={
				[
					(rotation[0] + orbitOffsetPlaneRotationOffset) * RADIAN,
					rotation[1] * RADIAN,
					rotation[2] * RADIAN,
				] as [number, number, number]
			}
		>
			{renderOrbit && (
				<OrbitEllipse
					majorX={majorX}
					majorZ={majorZ}
					segments={orbitSegments}
					lineWidth={orbitThickness}
				/>
			)}
			<mesh position={orbitingObjectStartPos} ref={orbitingObject}>
				{children}
			</mesh>
		</mesh>
	);
}
