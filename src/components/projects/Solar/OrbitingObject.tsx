import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import React, { useMemo, useRef } from "react";
import { randFloat } from "three/src/math/MathUtils.js";
import { PI, RADIAN, SUN_POINT } from "./constants";
import { OrbitEllipse } from "./OrbitEllipse";
import { getPosition } from "./orbit";
import type { SolarObjectProps as OrbitingObjectProps } from "./types";

export function OrbitalObject({
	centerAt = SUN_POINT,
	renderOrbit = true,
	orbitRadius,
	rotationSpeed = 0.01,
	orbitFrameRotationSpeed = 0,
	rotation = [0, 0, 0],
	orbitSegments = 50,
	eccentricity = 0.5,
	orbitOffsetPlaneRotationOffset = 0,
	fixedChildren,
	children,
}: OrbitingObjectProps) {
	const normalizedEccentricity = Math.min(eccentricity, 0.99);

	const absE = Math.abs(normalizedEccentricity);
	const a = orbitRadius;
	const b = a * Math.sqrt(1 - absE ** 2);

	const [majorX, majorZ] = normalizedEccentricity < 0 ? [a, b] : [b, a];
	const startAngle = useMemo(() => randFloat(0, 2 * PI), []);
	const orbitingObjectStartPos = useMemo(
		() => getPosition(majorX, majorZ, startAngle),
		[majorX, majorZ, startAngle],
	);
	const orbitingObjectPosition = useRef({ majorX, majorZ, angle: startAngle });
	const orbitFrameRef = useRef<Group>(null);
	const orbitingObject = useRef<Mesh>(null);
	const orbitThickness = 0.5;

	useFrame((_, delta) => {
		if (orbitFrameRef.current && orbitFrameRotationSpeed !== 0) {
			orbitFrameRef.current.rotation.y += delta * orbitFrameRotationSpeed;
		}

		orbitingObjectPosition.current.angle += rotationSpeed * delta;
		const newPos = getPosition(
			orbitingObjectPosition.current.majorX,
			orbitingObjectPosition.current.majorZ,
			orbitingObjectPosition.current.angle,
		);
		if (orbitingObject.current) {
			orbitingObject.current.position.set(newPos[0], newPos[1], newPos[2]);
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
			<group ref={orbitFrameRef}>
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
					{fixedChildren}
				</mesh>
			</group>
		</mesh>
	);
}
