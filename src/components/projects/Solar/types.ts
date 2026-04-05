import type * as THREE from "three";
import type React from "react";

export type OrbitConfig = Omit<SolarObjectProps, "children" | "fixedChildren">;

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
	orbitFrameRotationSpeed?: number;
	rotation?: [number, number, number];
	orbitSegments?: number;
	eccentricity?: number;
	orbitOffsetPlaneRotationOffset?: number;
	children?: React.ReactNode;
	fixedChildren?: React.ReactNode;
}

export interface PlanetProps {
	size?: number;
	color?: THREE.ColorRepresentation;
	textureMap?: string;
	useAtmosphere?: boolean;
	atmosphereColor?: THREE.ColorRepresentation;
	atmosphereIntensity?: number;
	selfRotationSpeed?: number;
	onClick?: () => void;
	moons?: OrbitingElementConfig[];
	asteroidBelts?: AsteroidBeltProps[];
}

export interface OrbitingElementConfig {
	orbit: OrbitConfig;
	planet: PlanetProps;
	moonSelfRotationSpeed?: number;
	asteroidBelts?: AsteroidBeltProps[];
}
