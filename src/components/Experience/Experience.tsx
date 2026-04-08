import { useRef } from "react";
import { motion } from "motion/react";
import {
	useIsSectionInViewport,
} from "../viewport/viewportHooks";
import WaveGrid from "./WaveGrid";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import "./Experience.css";

type ExperienceEntry = {
	company: string;
	role: string;
	period: string;
	highlights: string[];
};

const professionalExperience: ExperienceEntry[] = [
	{
		company: "Synechron",
		role: "Jr Associate",
		period: "June 2025 - November 2025",
		highlights: [
			"Completed intensive training across Java full stack, MERN, AWS, and Python machine learning with practical backend and frontend work.",
			"Learned fundamentals of capital markets and commodities through introductory domain sessions.",
			"Built an Amusement Park Management System with MERN, Vite, and Tailwind CSS, focused on modular UI, API integration, and data connectivity.",
			"Built a Spring Boot backend for an Insurance Management System, emphasizing scalability, security, and modular service design.",
		],
	},
	{
		company: "Bharat Electronics Limited (BEL)",
		role: "Intern",
		period: "February 2025 - June 2025",
		highlights: [
			"Developed an authentication and authorization module for DRDO in a secure intranet web platform.",
			"Built an LLM interface to process and extract insights from sensitive documents using a RAG workflow.",
			"Integrated a Vosk-based voice input pipeline that transcribed speech to query text for improved accessibility.",
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
			className="experience-section relative w-screen min-h-screen h-fit snap-start overflow-x-hidden"
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
			<div className="experience-glow experience-glow--left" aria-hidden="true" />
			<div className="experience-glow experience-glow--right" aria-hidden="true" />

			<div className="relative z-10 flex flex-col w-full min-h-screen items-center overflow-x-hidden pt-20 xl:pt-18 pb-8">
				<motion.div
					initial={{ opacity: 0, y: 28 }}
					animate={
						isExperienceVisible
							? { opacity: 1, y: 0 }
							: { opacity: 0, y: 28 }
					}
					transition={{ duration: isExperienceVisible ? 0.45 : 0.25 }}
					className="experience-shell flex flex-col gap-4 mx-auto my-0 lg:my-auto pt-2 pb-3 sm:py-6 px-3 sm:px-6 items-stretch w-[96vw] max-w-350 min-h-[58%]"
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
						<div className="experience-kicker">Experience</div>
						<h2 className="experience-title">Hands-on product and platform delivery.</h2>
						<p className="experience-subtitle">
							Building distributed backend systems, secure enterprise features, and practical AI workflows.
						</p>
					</motion.div>

					<div
						className="experience-grid mt-2 grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 overflow-visible thin-scrollbar"
					>
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
								className="experience-card-wrap p-1 sm:p-2"
							>
								<Card
									className="experience-card w-full h-full transition-transform duration-300 ease-in-out text-white"
								>
									<CardHeader>
										<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
											<div>
												<CardTitle className="experience-company text-xl sm:text-2xl font-semibold">
													{entry.company}
												</CardTitle>
												<CardDescription className="experience-role text-base sm:text-lg mt-0.5">
													{entry.role}
												</CardDescription>
											</div>
											<p className="experience-period text-xs sm:text-sm tracking-wide uppercase sm:text-right">
												{entry.period}
											</p>
										</div>
									</CardHeader>
									<CardContent>
										<ul className="experience-highlights list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed">
											{entry.highlights.map(
												(highlight) => (
													<li key={highlight}>
														{highlight}
													</li>
												),
											)}
										</ul>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
};
