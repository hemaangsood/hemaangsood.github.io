import type * as THREE from "three";
import type React from "react";

export type OrbitConfig = Omit<SolarObjectProps, "children" | "fixedChildren">;

export interface ProjectLink {
	label: string;
	url: string;
}

export interface ProjectMetadata {
	id: string;
	name: string;
	description: string;
	techStack?: string[];
	tags?: string[];
	links?: ProjectLink[];
}

export type SelectedProject = ProjectMetadata | null;

export interface PlanetInteractionHandlers {
	onProjectSelect?: (
		project: ProjectMetadata,
		worldPosition: THREE.Vector3,
	) => void;
	onProjectHover?: (project: ProjectMetadata | null) => void;
	onProjectPositionUpdate?: (
		projectId: string,
		worldPosition: THREE.Vector3,
	) => void;
}

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
	project?: ProjectMetadata;
	selectedProjectId?: string | null;
	onProjectSelect?: PlanetInteractionHandlers["onProjectSelect"];
	onProjectHover?: PlanetInteractionHandlers["onProjectHover"];
	onProjectPositionUpdate?: PlanetInteractionHandlers["onProjectPositionUpdate"];
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
