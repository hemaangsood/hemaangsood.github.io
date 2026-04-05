import type { OrbitingElementConfig } from "./types";

export const solarElements: OrbitingElementConfig[] = [
	{
		orbit: {
			orbitRadius: 5.4,
			rotationSpeed: 0.12,
			orbitOffsetPlaneRotationOffset: 3,
			selfRotationSpeed: 0.45,
		},
		planet: {
			size: 0.44,
			color: "#d9b38a",
			textureMap: "/projects/2k_venus_surface.jpg",
			atmosphereColor: "#edd0aa",
			atmosphereIntensity: 1.3,
		},
	},
	{
		orbit: {
			orbitRadius: 8.55,
			rotationSpeed: 0.07,
			orbitSegments: 48,
			orbitOffsetPlaneRotationOffset: -2,
			selfRotationSpeed: 0.33,
		},
		planet: {
			size: 0.24,
			color: "#b85f44",
			textureMap: "/projects/red-rock.jpg",
			atmosphereColor: "#d77a63",
			atmosphereIntensity: 1.05,
			moons: [
				{
					orbit: {
						orbitRadius: 0.5,
						rotationSpeed: 0.2,
						orbitSegments: 16,
						eccentricity: 0.3,
						orbitOffsetPlaneRotationOffset: 0,
						selfRotationSpeed: 0.1,
						renderOrbit: true,
					},
					planet: {
						size: 0.1,
						color: "#888888",
						textureMap: "/projects/moon-texture.jpg",
						useAtmosphere: false,
					},
				},
			],
		},
	},
	{
		orbit: {
			orbitRadius: 12.15,
			rotationSpeed: 0.05,
			orbitSegments: 64,
			eccentricity: 0.06,
			orbitOffsetPlaneRotationOffset: 0,
			selfRotationSpeed: 0.22,
		},
		planet: {
			size: 0.46,
			color: "#4a78b8",
			textureMap: "/projects/green-water.jpg",
			atmosphereColor: "#89c9ff",
			atmosphereIntensity: 1.22,
		},
		asteroidBelts: [
			{
				orbitRadius: 0.6,
				count: 300,
				height: 0,
				size: 0.015,
				thickness: 0.1,
				eccentricity: 0.2,
			},
		],
	},
	{
		orbit: {
			orbitRadius: 15.75,
			rotationSpeed: 0.035,
			orbitSegments: 80,
			eccentricity: -0.1,
			orbitOffsetPlaneRotationOffset: 1.8,
			selfRotationSpeed: 0.38,
		},
		planet: {
			size: 1.0,
			color: "#d2b08a",
			textureMap: "/projects/2k_jupiter.jpg",
			atmosphereColor: "#e6c49f",
			atmosphereIntensity: 1.5,
		},
		asteroidBelts: [
			{
				orbitRadius: 1.5,
				count: 300,
				height: 0.01,
				size: 0.02,
				thickness: 0.5,
				eccentricity: 0,
			},
		],
	},
	{
		orbit: {
			orbitRadius: 18,
			rotationSpeed: 0.015,
			orbitSegments: 120,
			eccentricity: -0.04,
			orbitOffsetPlaneRotationOffset: -3,
			selfRotationSpeed: 0.16,
		},
		planet: {
			size: 0.64,
			color: "#79a6c9",
			textureMap: "/projects/gray-bubble.jpg",
			atmosphereColor: "#b9d7ef",
			atmosphereIntensity: 1.08,
		},
	},
	{
		orbit: {
			orbitRadius: 19.8,
			rotationSpeed: 0.024,
			orbitSegments: 96,
			eccentricity: 0.08,
			orbitOffsetPlaneRotationOffset: 4,
			selfRotationSpeed: 0.19,
		},
		planet: {
			size: 0.82,
			color: "#d9c37a",
			textureMap: "/projects/orange-details-moon-texture-concept.jpg",
			atmosphereColor: "#f1e2a9",
			atmosphereIntensity: 1.2,
			moons: [
				{
					orbit: {
						orbitRadius: 1.7,
						rotationSpeed: 0.18,
						eccentricity: 0.1,
						orbitOffsetPlaneRotationOffset: 0,
						selfRotationSpeed: 0.12,
						renderOrbit: true,
					},
					planet: {
						size: 0.15,
						color: "#aaaaaa",
						textureMap: "/projects/moon-texture.jpg",
						useAtmosphere: false,
					},
				},
				{
					orbit: {
						orbitRadius: 1.4,
						rotationSpeed: 0.18,
						eccentricity: 0.1,
						orbitOffsetPlaneRotationOffset: 90,
						selfRotationSpeed: 0.12,
						renderOrbit: true,
					},
					planet: {
						size: 0.1,
						color: "#aaaaaa",
						textureMap: "/projects/moon-texture.jpg",
						useAtmosphere: false,
					},
				},
			],
		},
	},
];
