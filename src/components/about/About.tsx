import { useState } from "react";
import TerminalGimmick from "../HeroSection/TerminalComponent";
import { TerminalState } from "../HeroSection/types";
import Aurora from "../ui/Aurora";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { MdOutlineSchool } from "react-icons/md";
import { PiMagnifyingGlass } from "react-icons/pi";
import { SiResearchgate } from "react-icons/si";
import GradientText from "../ui/GradientText";
import { GiSpectacleLenses } from "react-icons/gi";
import { motion } from "motion/react";
import { useSectionHasBeenInViewport } from "../viewport/viewportHooks";

function AboutSectionCard({
	className,
	title,
	description,
	content,
	icon,
}: {
	className?: string;
	title: string;
	description?: string;
	content?: React.ReactNode;
	icon?: React.ReactNode;
}) {
	return (
		<Card
			className={
				className +
				" " +
				"w-full md:basis-[calc(50%-0.75rem)] md:max-w-[calc(50%-0.75rem)] hover:scale-[1.03] transition-transform duration-300 ease-in-out border-2 border-gray-300 backdrop-blur-sm text-white"
			}
			style={{
				background: "rgb(255,255,255,0.2)",
			}}
		>
			<CardHeader>
				<div className="flex" style={{ alignItems: "center" }}>
					{icon && <div className="mr-2 h-full">{icon}</div>}
					<CardTitle>{title}</CardTitle>
				</div>
				{description && (
					<CardDescription>{description}</CardDescription>
				)}
			</CardHeader>
			<CardContent>{content}</CardContent>
		</Card>
	);
}

const AboutSection = () => {
	const shouldMountAboutGraphics = useSectionHasBeenInViewport("about");
	const [terminalState, setterminalState] = useState(TerminalState.skills);
	return (
		<section
			className="relative w-screen min-h-screen h-fit snap-start overflow-x-hidden overflow-y-hidden"
			style={{
				backgroundColor: "rgba(0,0,0,0.5)",
				backgroundBlendMode: "color-burn",
			}}
			id="about"
		>
			<div className="absolute top-0 left-0 w-full h-full">
				{shouldMountAboutGraphics && <Aurora amplitude={1.2} />}
			</div>
			<div className="flex absolute top-0 left-0 w-full h-full items-center overflow-x-hidden">
				<div
					className="flex flex-col 2xl:flex-row gap-6 m-auto py-4 sm:py-6 px-4 sm:px-6 items-stretch w-[95vw] xl:w-[90vw] max-w-[1600px] h-[calc(100vh-5rem)] sm:h-[calc(100vh-7rem)] overflow-hidden"
					style={{
						background: "rgba(100, 100,100, 0.1)",
						backdropFilter: "blur(24px)",
						borderRadius: "32px",
					}}
				>
					<div
						className="w-full h-full 2xl:w-[46%] mt-2 sm:mt-4 2xl:mt-8 flex flex-col mr-0 p-0 min-h-0 min-w-0"
						id="gimmick"
					>
						{shouldMountAboutGraphics && (
							<TerminalGimmick
								state={terminalState}
								className="w-full h-[30vh] sm:h-[34vh] lg:h-[38vh] xl:h-[42vh] 2xl:h-[46vh] mx-auto mt-2"
							/>
						)}
						<div className="flex flex-wrap w-full justify-center gap-3 sm:gap-4 m-auto mt-3 mb-2">
							{[
								TerminalState.skills,
								TerminalState.projects,
								TerminalState.experience,
							].map((state) => {
								return (
									<div
										key={state}
										onClick={() => setterminalState(state)}
										className={`px-3 py-2 rounded-md cursor-pointer text-sm sm:text-base ${
											terminalState === state
												? "bg-green-800 text-white"
												: "bg-gray-300 text-black"
										}`}
									>
										{state === TerminalState.skills &&
											"Skills"}
										{state === TerminalState.projects &&
											"Projects"}
										{state === TerminalState.experience &&
											"Experience"}
									</div>
								);
							})}
						</div>
					</div>
					<div className="w-full h-full 2xl:w-[54%] min-w-0 overflow-y-auto overflow-x-hidden pr-1">
						<div className="h-max w-max cursor-text bg-transparent">
							<GradientText
								colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
								animationSpeed={8}
								showBorder={false}
								yoyo={true}
								className="text-2xl sm:text-3xl p-2 bg-transparent"
							>
								About Me
							</GradientText>
						</div>
						<motion.div
							className="mt-3 ml-2 sm:mt-4 text-justify text-base sm:text-lg"
							initial={{ x: 100, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							I’m a software engineer focused on building scalable
							backend systems and reliable software
							infrastructure. My experience includes developing
							APIs, working with distributed systems, and
							designing efficient data-driven applications.
							Currently, I’m pursuing a Master’s in Electrical and
							Computer Engineering at the University of Waterloo
							while continuing to expand my work in backend
							architecture and intelligent systems.
						</motion.div>
						<motion.div
							initial={{ y: 100, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="flex flex-wrap w-full max-w-full gap-3 sm:gap-4 mt-2 sm:mt-4 overflow-x-hidden p-2"
						>
							<AboutSectionCard
								className=""
								title="Education"
								icon={<MdOutlineSchool size={20} />}
								content="MEng in Electrical and Computer Engineering, University of Waterloo (2026-2027)"
							/>
							<AboutSectionCard
								className=""
								title="Focus"
								icon={<PiMagnifyingGlass size={20} />}
								content="Experienced in designing and implementing distributed architectures."
							/>
							<AboutSectionCard
								className=""
								title="Research"
								icon={<SiResearchgate size={18} />}
								content="IEEE COMPSIF 2025"
							/>
							<AboutSectionCard
								className=""
								title="Experience"
								icon={<GiSpectacleLenses size={20} />}
								content={
									<ul className="list-disc pl-5">
										<li>Software Engineer at Synechron</li>
										<li>
											Software Intern at Bharat
											Electronics Limited
										</li>
									</ul>
								}
							/>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutSection;
