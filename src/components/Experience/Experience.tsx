import { useRef } from "react";
import { motion } from "motion/react";
import {
	useIsSectionInViewport,
	useSectionHasBeenInViewport,
} from "../viewport/viewportHooks";
import WaveGrid from "./WaveGrid";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import GradientText from "../ui/GradientText";

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

export default function ExperienceSection() {
	const shouldMountExperienceGraphics = useSectionHasBeenInViewport("experience");
	const isExperienceVisible = useIsSectionInViewport("experience", false, 0.06);
	const bgContainer = useRef<HTMLDivElement>(null);
	return (
		<section
			className="relative w-screen min-h-screen h-fit snap-start overflow-x-hidden overflow-y-hidden"
			style={{
				backgroundColor: "rgba(0,0,0,0.5)",
				backgroundBlendMode: "color-burn",
			}}
			id="experience"
		>
			<div
				ref={bgContainer}
				className="absolute top-0 left-0 w-full h-full"
			>
				{shouldMountExperienceGraphics && (
					<WaveGrid parentRef={bgContainer} />
				)}
			</div>
			<div className="absolute top-0 left-0 w-full h-full bg-black/45" />

			<div className="flex flex-col absolute top-0 left-0 w-full h-full items-center overflow-x-hidden pt-20 xl:pt-18 pb-8">
				<motion.div
					initial={{ opacity: 0, y: 28 }}
					animate={
						isExperienceVisible
							? { opacity: 1, y: 0 }
							: { opacity: 0, y: 28 }
					}
					transition={{ duration: isExperienceVisible ? 0.45 : 0.25 }}
					className="flex flex-col gap-4 m-auto pt-2 pb-3 sm:py-6 px-4 sm:px-6 items-stretch w-[92vw] max-w-350 min-h-[50%] lg:min-h-[76vh]"
					style={{
						background: "rgba(100, 100,100, 0.1)",
						backdropFilter: "blur(5px)",
						borderRadius: "32px",
					}}
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
					>
						<GradientText
							colors={["#5227FF", "#fcba03", "#7cff67", "#fff"]}
							animationSpeed={8}
							showBorder={false}
							yoyo={true}
							className="text-2xl sm:text-3xl mx-auto backdrop-blur-none! cursor-text!"
						>
							Experience
						</GradientText>
					</motion.div>

					<div
						className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 overflow-hidden thin-scrollbar"
						style={{
							alignItems: "stretch",
						}}
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
								className="p-4"
							>
								<Card
									className="w-full h-full hover:scale-[1.01] transition-transform duration-300 ease-in-out border-2 border-gray-300 backdrop-blur-sm text-white"
									style={{
										background: "rgb(255,255,255,0.2)",
									}}
								>
									<CardHeader>
										<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
											<div>
												<CardTitle className="text-xl sm:text-2xl font-semibold">
													{entry.company}
												</CardTitle>
												<CardDescription className="text-white/80 text-base sm:text-lg mt-0.5">
													{entry.role}
												</CardDescription>
											</div>
											<p className="text-xs sm:text-sm tracking-wide uppercase text-white/75 sm:text-right">
												{entry.period}
											</p>
										</div>
									</CardHeader>
									<CardContent>
										<ul className="list-disc pl-5 text-white/90 space-y-2 text-sm sm:text-base leading-relaxed">
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
