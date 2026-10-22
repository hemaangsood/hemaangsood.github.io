import { useRef } from "react";
import { motion } from "motion/react";
import {
	useIsSectionInViewport,
} from "../viewport/viewportHooks";
import WaveGrid from "./WaveGrid";
import ExperienceCard, { type ExperienceEntry } from "./ExperienceCard";
import "./Experience.css";

const professionalExperience: ExperienceEntry[] = [
	{
		company: "University of Waterloo",
		role: "ECE 699 Research - Multi-Agent LLM Optimization with DSPy and GEPA",
		period: "Sept 2026 - Present",
		highlights: [
			"Research project optimizing multi-agent LLM coordination by evolving agent prompts with GEPA on DSPy, benchmarked on Hanabi, SciBench, and maze navigation.",
			"Built a 16-GPU AMD Instinct MI50 (ROCm) cluster serving vLLM tensor-parallel models behind a Ray Serve router; delivered a 4-12x speed-up and 6x more evaluations on the same hardware without starvation.",
		],
	},
	{
		company: "Synechron",
		role: "Jr Associate",
		period: "May 2025 - Nov 2025",
		highlights: [
			"Built a full-stack Amusement Park Management System using MERN with Vite.js and Tailwind CSS, focusing on modular UI design, API integration, and database connectivity.",
			"Built a backend server for an Insurance Management System using Spring Boot, focusing on scalability, security, and modularity.",
		],
	},
	{
		company: "Bharat Electronics Limited (BEL)",
		role: "Intern",
		period: "Apr 2024 - Nov 2024",
		highlights: [
			"Developed an Authentication and Authorization module for a secure DRDO intranet website.",
			"Built an LLM interface using RAG to process and extract insights from sensitive documents; integrated a Vosk voice-input pipeline to transcribe speech into queries.",
		],
	},
];

const experienceWaveColors = ["#67d9ff", "#7fa4ff", "#95ceff", "#e8f6ff"];

export default function ExperienceSection() {
	const isExperienceVisible = useIsSectionInViewport("experience", false, 0.06);
	const shouldMountExperienceGraphics = isExperienceVisible;
	const bgContainer = useRef<HTMLDivElement>(null);

	return (
		<section
			className="experience-section relative w-full max-w-full min-h-screen h-fit snap-start overflow-hidden"
			id="experience"
		>
			<div
				ref={bgContainer}
				className="absolute top-0 left-0 w-full h-full"
			>
				{shouldMountExperienceGraphics && (
					<WaveGrid
						parentRef={bgContainer}
						colorStops={experienceWaveColors}
						maxAmplitude={0.36}
					/>
				)}
			</div>
			<div className="experience-overlay absolute top-0 left-0 w-full h-full" />
			<div
				className="experience-glow experience-glow--left"
				aria-hidden="true"
			/>
			<div
				className="experience-glow experience-glow--right"
				aria-hidden="true"
			/>

			<div className="relative z-10 flex flex-col w-full max-w-full min-h-screen lg:h-screen! items-center overflow-hidden pt-20 xl:pt-18 pb-8">
				<motion.div
					initial={{ opacity: 0, y: 28 }}
					animate={
						isExperienceVisible
							? { opacity: 1, y: 0 }
							: { opacity: 0, y: 28 }
					}
					transition={{ duration: isExperienceVisible ? 0.45 : 0.25 }}
					className="experience-shell flex flex-col gap-4 mx-auto my-0 lg:my-auto pt-2 pb-3 sm:py-6 px-3 sm:px-6 items-stretch w-full max-w-[90vw] 2xl:max-w-[70vw] min-w-0 min-h-[80vh] lg:min-h-[60vh]"
				>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={
							isExperienceVisible
								? { opacity: 1, y: 0 }
								: { opacity: 0, y: 30 }
						}
						transition={{
							duration: isExperienceVisible ? 0.45 : 0.25,
						}}
						className="experience-header"
					>
						<div className="experience-kicker text-lg lg:text-xl">
							Experience
						</div>
						<h2 className="experience-title">
							Hands-on product and platform delivery.
						</h2>
						<p className="experience-subtitle">
							Building distributed backend systems, secure
							enterprise features, and practical AI workflows.
						</p>
					</motion.div>

					<div className="experience-grid mt-2 grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 min-w-0 max-w-full thin-scrollbar">
						{professionalExperience.map((entry, index) => (
							<motion.div
								key={entry.company}
								initial={{ opacity: 0, y: 28 }}
								animate={
									isExperienceVisible
										? { opacity: 1, y: 0 }
										: { opacity: 0, y: 28 }
								}
								transition={{
									duration: isExperienceVisible ? 0.42 : 0.2,
									delay: isExperienceVisible
										? index * 0.1
										: 0,
								}}
								className="experience-card-wrap p-1 sm:p-2 min-w-0 max-w-full"
							>
								<ExperienceCard entry={entry} />
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
};
