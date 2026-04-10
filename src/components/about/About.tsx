import { useState } from "react";
import type { ReactNode } from "react";
import TerminalGimmick from "./TerminalComponent";
import { TerminalState } from "./types";
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
import { GiSpectacleLenses } from "react-icons/gi";
import { motion } from "motion/react";
import { useIsSectionInViewport } from "../viewport/viewportHooks";
import "./About.css";

const ABOUT_TABS = [
	{ state: TerminalState.skills, label: "Skills" },
	{ state: TerminalState.projects, label: "Projects" },
	{ state: TerminalState.experience, label: "Experience" },
];

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
	content?: ReactNode;
	icon?: ReactNode;
}) {
	return (
		<Card
			size="sm"
			className={
				"about-card w-full transition-all duration-300 ease-in-out " +
				(className ?? "")
			}
		>
			<CardHeader className="pb-2">
				<div className="flex items-center gap-2.5">
					{icon && <div className="about-card__icon">{icon}</div>}
					<CardTitle className="about-card__title">{title}</CardTitle>
				</div>
				{description && (
					<CardDescription className="about-card__description">
						{description}
					</CardDescription>
				)}
			</CardHeader>
			<CardContent className="about-card__content">{content}</CardContent>
		</Card>
	);
}

const AboutSection = () => {
	const isAboutVisible = useIsSectionInViewport("about", false, 0.08);
	const shouldRunAboutGraphics = isAboutVisible;
	const [terminalState, setTerminalState] = useState(TerminalState.skills);

	return (
		<section
			className="about-section relative w-screen min-h-screen h-fit snap-start overflow-x-hidden"
			id="about"
		>
			<div className="absolute top-0 left-0 w-full h-full">
				{shouldRunAboutGraphics && <Aurora amplitude={1.2} />}
			</div>
			<div className="about-orb about-orb--left" aria-hidden="true" />
			<div className="about-orb about-orb--right" aria-hidden="true" />

			<div className="relative z-10 flex flex-col w-full min-h-screen items-center overflow-x-hidden pt-20 xl:pt-18 pb-8">
				<div
					className={`about-shell grid grid-cols-1 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]
						gap-4 md:gap-6 mx-auto my-0 lg:my-auto py-4 sm:py-6 px-3 sm:px-6 items-stretch w-[96vw] max-w-350 min-h-[58%] lg:min-h-[80vh] xl:min-h-[60vh]`}
				>
					<div
						className="about-terminal-panel w-full mt-1 sm:mt-2 flex overflow-y-auto overflow-x-hidden thin-scrollbar flex-col mr-0 p-2 min-w-0"
						id="gimmick"
					>
						<div className="about-terminal-title">Live Career Snapshot</div>
						{shouldRunAboutGraphics && (
							<TerminalGimmick
								state={terminalState}
								className="w-full mx-auto mt-2 max-h-[60vh] lg:max-h-[70vh] xl:max-h-[85%]"
							/>
						)}
						<div
							className="about-tab-row my-auto!"
							role="tablist"
							aria-label="About terminal categories"
						>
							{ABOUT_TABS.map((tab) => {
								return (
									<button
										type="button"
										key={tab.state}
										onClick={() => setTerminalState(tab.state)}
										className={`about-tab ${
											terminalState === tab.state
												? "about-tab--active"
												: ""
										}`}
										role="tab"
										aria-selected={terminalState === tab.state}
									>
										{tab.label}
									</button>
								);
							})}
						</div>
					</div>
					<div className="about-content-panel w-full min-h-0 min-w-0 overflow-visible p-2 sm:p-3">
						<motion.div
							initial={{ y: 16, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.45 }}
						>
							<div className="about-kicker">About</div>
							<h2 className="about-title">
								Building resilient systems with clarity.
							</h2>
						</motion.div>
						<motion.div
							className="about-lead mt-2 sm:mt-3"
							initial={{ x: 100, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.5, delay: 0.05 }}
						>
							I build scalable backend platforms and distributed APIs,
							distributed systems, and I&apos;m currently pursuing a Master&apos;s in Electrical and
							Computer Engineering at the University of Waterloo.
						</motion.div>
						<motion.div
							initial={{ y: 100, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.55, delay: 0.2 }}
							className={`about-cards-grid thin-scrollbar grid grid-cols-1 sm:grid-cols-2
								w-full max-w-full gap-3 sm:gap-4 pt-2 sm:pt-4 my-auto p-1 overflow-visible`}
						>
							<AboutSectionCard
								className=""
								title="Education"
								description="Current"
								icon={<MdOutlineSchool size={20} />}
								content="MEng in Electrical and Computer Engineering, University of Waterloo (2026-2027)"
							/>
							<AboutSectionCard
								className=""
								title="Focus"
								description="Engineering"
								icon={<PiMagnifyingGlass size={20} />}
								content="Experienced in designing and implementing distributed architectures."
							/>
							<AboutSectionCard
								className=""
								title="Research"
								description="Publication"
								icon={<SiResearchgate size={18} />}
								content="IEEE COMPSIF 2025"
							/>
							<AboutSectionCard
								className=""
								title="Experience"
								description="Industry"
								icon={<GiSpectacleLenses size={20} />}
								content={
									<ul className="list-disc pl-5 space-y-1">
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
