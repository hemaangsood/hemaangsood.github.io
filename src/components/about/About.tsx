import { useState } from "react";
import TerminalGimmick from "../HeroSection/TerminalComponent";
import { TerminalState } from "../HeroSection/types";
import Aurora from "../ui/Aurora";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { MdOutlineSchool } from "react-icons/md";
import { PiMagnifyingGlass } from "react-icons/pi";
import { SiResearchgate } from "react-icons/si";
import GradientText from "../ui/GradientText";
import { GiSpectacleLenses } from "react-icons/gi";

function AboutSectionCard({className, title, description,content,icon}:
	{className?: string, title: string, description?: string,content?:React.ReactNode,icon?: React.ReactNode}) {
	return (
		<Card
			className={
				className +
				" " +
				"m-2 w-[40%] hover:scale-110 transition-transform duration-300 ease-in-out border-2 border-gray-300 backdrop-blur-sm text-white"
			}
			style={{
				background: "rgb(255,255,255,0.2)",
			}}
		>
			<CardHeader>
				<div className="flex" style={{alignItems:"center"}}>
					{icon && <div className="mr-2 h-full">{icon}</div>}
					<CardTitle>{title}</CardTitle>
				</div>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>{content}</CardContent>
		</Card>
	);
}

const AboutSection = () => {
	const [terminalState, setterminalState] = useState(TerminalState.skills);
	return (
		<section
			className="relative w-screen min-h-screen h-fit snap-start  overflow-y-hidden"
			style={{
				opacity: "50%",
				backgroundBlendMode: "color-burn",
			}}
			id="about"
		>
			<div className="absolute top-0 left-0 w-full h-full">
				<Aurora amplitude={1.2} />
			</div>
			<div className="flex absolute top-0 left-0 w-full h-full">
				<div
					className="flex m-auto p-8 w-[80vw] h-[80vh]"
					style={{
						background: "rgba(100, 100,100, 0.1)",
						backdropFilter: "blur(40px)",
						borderRadius: "40px",
					}}
				>
					<div className="w-[50%] flex flex-col">
						<TerminalGimmick state={terminalState} />
						<div className="flex w-[80%] justify-around my-auto">
							{[
								TerminalState.skills,
								TerminalState.projects,
								TerminalState.experience,
							].map((state) => {
								return (
									<div
										key={state}
										onClick={() => setterminalState(state)}
										className={`p-2 rounded-md cursor-pointer ${
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
					<div className="max-w-[50%]">
						<div className="-ml-1 h-max w-max  cursor-text">
							<GradientText
								colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
								animationSpeed={8}
								showBorder={false}
								yoyo={true}
								className="text-3xl p-2 bg-transparent"
							>
								About Me
							</GradientText>
						</div>
						<div className="mt-4 text-justify">
							I’m a software engineer focused on building scalable
							backend systems and reliable software
							infrastructure. My experience includes developing
							APIs, working with distributed systems, and
							designing efficient data-driven applications. I
							enjoy solving complex engineering problems and
							building systems that are both performant and
							maintainable. Currently, I’m pursuing a Master’s in
							Electrical and Computer Engineering at the
							University of Waterloo while continuing to expand my
							work in backend architecture and intelligent
							systems.
						</div>
						<div className="flex flex-wrap w-full mt-2">
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
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutSection;
