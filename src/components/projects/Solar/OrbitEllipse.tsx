import { Line } from "@react-three/drei";
import { getOrbitPoint } from "./orbit";

interface OrbitEllipseProps {
	majorX: number;
	majorZ: number;
	segments?: number;
	lineWidth?: number;
}

export function OrbitEllipse({
	majorX,
	majorZ,
	segments = 128,
	lineWidth = 0.5,
}: OrbitEllipseProps) {
	const points = Array.from({ length: segments + 1 }, (_, i) =>
		getOrbitPoint(majorX, majorZ, (i / segments) * 2 * Math.PI),
	);

	return (
		<Line
			points={points}
			color="white"
			lineWidth={lineWidth}
			opacity={0.1}
			transparent
		/>
	);
}
