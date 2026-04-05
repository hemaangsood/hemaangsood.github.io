import type { OrbitingElementConfig } from "./types";

export const solarElements: OrbitingElementConfig[] = [
	{
		orbit: {
			orbitRadius: 5.4,
			rotationSpeed: 0.12,
			orbitOffsetPlaneRotationOffset: 3,
		},
		planet: {
			size: 0.44,
			color: "#d9b38a",
			textureMap: "/projects/2k_venus_surface.jpg",
			atmosphereColor: "#edd0aa",
			atmosphereIntensity: 1.3,
			selfRotationSpeed: 0.45,
			project: {
				id: "portfolio-3d-solar",
				name: "Solar Portfolio Engine",
				description:
					"An interactive 3D portfolio scene that maps project discovery to a planetary system with performant rendering and progressive detail.",
				techStack: ["React", "TypeScript", "Three.js", "React Three Fiber"],
				tags: ["3D UI", "WebGL", "Interaction Design"],
				links: [
					{ label: "Live Demo", url: "https://hemaangsood.github.io" },
					{ label: "Source", url: "https://github.com/hemaangsood/hemaangsood.github.io" },
				],
			},
		},
	},
	{
		orbit: {
			orbitRadius: 8.55,
			rotationSpeed: 0.07,
			orbitSegments: 48,
			orbitOffsetPlaneRotationOffset: -2,
		},
		planet: {
			size: 0.24,
			color: "#b85f44",
			textureMap: "/projects/red-rock.jpg",
			atmosphereColor: "#d77a63",
			atmosphereIntensity: 1.05,
			selfRotationSpeed: 0.33,
			project: {
				id: "graph-signal-monitor",
				name: "Graph Signal Monitor",
				description:
					"A graph-driven observability dashboard that surfaces system anomalies with animated topology views and event timelines.",
				techStack: ["React", "D3", "Node.js", "WebSocket"],
				tags: ["Data Viz", "Monitoring", "Real-time"],
				links: [
					{ label: "Case Study", url: "https://hemaangsood.github.io/#projects" },
					{ label: "Repository", url: "https://github.com/hemaangsood/hemaangsood.github.io" },
				],
			},
			moons: [
				{
					orbit: {
						orbitRadius: 0.5,
						rotationSpeed: 0.2,
						orbitSegments: 16,
						eccentricity: 0.3,
						orbitOffsetPlaneRotationOffset: 0,
						renderOrbit: true,
					},
					moonSelfRotationSpeed: 0.1,
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
		},
		planet: {
			size: 0.46,
			color: "#4a78b8",
			textureMap: "/projects/green-water.jpg",
			atmosphereColor: "#89c9ff",
			atmosphereIntensity: 1.22,
			selfRotationSpeed: 0.22,
			project: {
				id: "aurora-workboard",
				name: "Aurora Workboard",
				description:
					"A collaborative project workspace with live status lanes, keyboard-first workflows, and intelligent planning shortcuts.",
				techStack: ["React", "TypeScript", "PostgreSQL", "Express"],
				tags: ["Productivity", "Collaboration", "SaaS"],
				links: [
					{ label: "Overview", url: "https://hemaangsood.github.io/#projects" },
				],
			},
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
		},
		planet: {
			size: 1.0,
			color: "#d2b08a",
			textureMap: "/projects/2k_jupiter.jpg",
			atmosphereColor: "#e6c49f",
			atmosphereIntensity: 1.5,
			selfRotationSpeed: 0.38,
			project: {
				id: "cloud-cost-navigator",
				name: "Cloud Cost Navigator",
				description:
					"An engineering-finance analytics tool that predicts monthly cloud burn and recommends architecture-level optimizations.",
				techStack: ["Python", "FastAPI", "React", "Azure"],
				tags: ["FinOps", "Cloud", "Forecasting"],
				links: [
					{ label: "Architecture Notes", url: "https://hemaangsood.github.io/#projects" },
				],
			},
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
		},
		planet: {
			size: 0.64,
			color: "#79a6c9",
			textureMap: "/projects/gray-bubble.jpg",
			atmosphereColor: "#b9d7ef",
			atmosphereIntensity: 1.08,
			selfRotationSpeed: 0.16,
			project: {
				id: "interview-prism",
				name: "Interview Prism",
				description:
					"A preparation platform that simulates technical interviews, scores responses, and builds personalized practice loops.",
				techStack: ["Next.js", "OpenAI", "Prisma", "Tailwind"],
				tags: ["EdTech", "AI", "Assessment"],
				links: [
					{ label: "Product Brief", url: "https://hemaangsood.github.io/#projects" },
				],
			},
		},
	},
	{
		orbit: {
			orbitRadius: 19.8,
			rotationSpeed: 0.024,
			orbitSegments: 96,
			eccentricity: 0.08,
			orbitOffsetPlaneRotationOffset: 4,
		},
		planet: {
			size: 0.82,
			color: "#d9c37a",
			textureMap: "/projects/orange-details-moon-texture-concept.jpg",
			atmosphereColor: "#f1e2a9",
			atmosphereIntensity: 1.2,
			selfRotationSpeed: 0.19,
			project: {
				id: "promptops-studio",
				name: "PromptOps Studio",
				description:
					"A prompt lifecycle workspace with versioning, evaluation runs, and deployment guardrails for production LLM features.",
				techStack: ["TypeScript", "React", "Node.js", "Redis"],
				tags: ["LLM", "Developer Tools", "MLOps"],
				links: [
					{ label: "Walkthrough", url: "https://hemaangsood.github.io/#projects" },
				],
			},
			moons: [
				{
					orbit: {
						orbitRadius: 1.7,
						rotationSpeed: 0.18,
						eccentricity: 0.1,
						orbitOffsetPlaneRotationOffset: 0,
						renderOrbit: true,
					},
					moonSelfRotationSpeed: 0.12,
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
						renderOrbit: true,
					},
					moonSelfRotationSpeed: 0.12,
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
