import type { SolarElementConfig } from "./types";

export const solarElements: SolarElementConfig[] = [
	{
		orbit: {
			orbitRadius: 6,
			rotationSpeed: -0.1,
			orbitOffsetPlaneRotationOffset: 15,
		},
		planet: {
			size: 0.5,
			color: "orange",
			textureMap:"/projects/2k_venus_surface.jpg",
		},
	},
	{
		orbit: {
			orbitRadius: 10,
			rotationSpeed: 0.04,
			orbitOffsetPlaneRotationOffset: -5,
		},
		planet: {
			size: 0.3,
			textureMap:"/projects/red-rock.jpg",
		},
	},
	{
		orbit: {
			orbitRadius: 14,
			rotationSpeed: 0.03,
			orbitSegments: 80,
			orbitOffsetPlaneRotationOffset: 0,
		},
		planet: {
			size: 0.2,
			color: "cyan",
		},
	},
	{
		orbit: {
			orbitRadius: 16,
			rotationSpeed: -0.02,
			orbitSegments: 96,
			eccentricity: -0.3,
			orbitOffsetPlaneRotationOffset: 5,
		},
		planet: {
			size: 0.4,
			textureMap:"/projects/2k_jupiter.jpg",
		},
	},
	{
		orbit: {
			orbitRadius: 18,
			rotationSpeed: 0.01,
			orbitSegments: 128,
			eccentricity: 0.2,
			orbitOffsetPlaneRotationOffset: 30,
		},
		planet: {
			size: 0.25,
			color: "yellow",
		},
	},
	{
		orbit: {
			orbitRadius: 20,
			rotationSpeed: -0.005,
			orbitSegments: 160,
			eccentricity: -0.1,
			orbitOffsetPlaneRotationOffset: -10,
		},
		planet: {
			size: 0.3,
			color: "gray",
			textureMap: "/projects/gray-bubble.jpg",
		},
	}
];
