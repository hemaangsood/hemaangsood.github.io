import type * as THREE from "three";
import type React from "react";

export type OrbitConfig = Omit<SolarObjectProps, "children">;

export interface AsteroidBeltProps {
	orbitRadius: number;
	count?: number;
	eccentricity?: number;
	thickness?: number;
	height?: number;
	size?: number;
}

export interface SolarObjectProps {
	centerAt?: [number, number, number];
	renderOrbit?: boolean;
	orbitRadius: number;
	rotationSpeed?: number;
	rotation?: [number, number, number];
	orbitSegments?: number;
	eccentricity?: number;
	orbitOffsetPlaneRotationOffset?: number;
	selfRotationSpeed?: number;
	children?: React.ReactNode;
}

export interface PlanetProps {
	size?: number;
	color?: THREE.ColorRepresentation;
	textureMap?: string;
	useAtmosphere?: boolean;
	atmosphereColor?: THREE.ColorRepresentation;
	atmosphereIntensity?: number;
	onClick?: () => void;
}

export interface SolarElementConfig {
	orbit: OrbitConfig | OrbitConfig[];
	planet: PlanetProps;
	asteroidBelts?: AsteroidBeltProps[];
}
