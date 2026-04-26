import { LaserFlow } from "../ui/LaserFlow";
import SkillsMarquee from "./SkillsMarquee";
import type { SkillsMarqueeCapsuleProps } from "./SkillsMarqueeCapsule";
import { TbBrandTypescript, TbBrandNextjs } from "react-icons/tb";
import { RiJavascriptLine, RiTailwindCssLine } from "react-icons/ri";
import {
	SiPython,
	SiFastapi,
	SiDjango,
	SiSpringboot,
	SiRedux,
	SiPytorch,
	SiTensorflow,
	SiOpencv,
	SiHuggingface,
	SiPostgresql,
	SiMongodb,
	SiRedis,
	SiDocker,
} from "react-icons/si";
import { FaCss, FaGolang, FaHtml5 } from "react-icons/fa6";
import { FaGitlab, FaJava, FaReact, FaGit, FaAws } from "react-icons/fa";
import { DiNodejs } from "react-icons/di";
import Icon from "../icon";
import GradientText from "../ui/GradientText";
import Aurora from "../ui/Aurora";
import {
	useIsSectionInViewport,
	useSectionHasBeenInViewport,
} from "../viewport/viewportHooks";

const iconSize = 40;

const leftCol: SkillsMarqueeCapsuleProps[] = [
	{ text: "TypeScript", icon: <TbBrandTypescript size={iconSize} /> },
	{ text: "JavaScript", icon: <RiJavascriptLine size={iconSize} /> },
	{ text: "Python", icon: <SiPython size={iconSize} /> },
	{ text: "Go", icon: <FaGolang size={iconSize} /> },
	{ text: "Java", icon: <FaJava size={iconSize} /> },
	{ text: "React", icon: <FaReact size={iconSize} /> },
	{ text: "Next.js", icon: <TbBrandNextjs size={iconSize} /> },
	{ text: "Node.js", icon: <DiNodejs size={iconSize} /> },
	{ text: "FastAPI", icon: <SiFastapi size={iconSize} /> },
	{ text: "Django", icon: <SiDjango size={iconSize} /> },
	{ text: "Spring Boot", icon: <SiSpringboot size={iconSize} /> },
	{ text: "Redux", icon: <SiRedux size={iconSize} /> },
	{ text: "Tailwind CSS", icon: <RiTailwindCssLine size={iconSize} /> },
	{ text: "HTML", icon: <FaHtml5 size={iconSize} /> },
	{ text: "CSS", icon: <FaCss size={iconSize} /> },
];

const rightCol: SkillsMarqueeCapsuleProps[] = [
	{ text: "PyTorch", icon: <SiPytorch size={iconSize} /> },
	{ text: "TensorFlow", icon: <SiTensorflow size={iconSize} /> },
	{ text: "OpenCV", icon: <SiOpencv size={iconSize} /> },
	{
		text: "HuggingFace",
		icon: <SiHuggingface size={iconSize} />,
	},
	{
		text: "XGBoost",
		icon: <Icon size={iconSize} imagePath="/icons/xgboost-logo.png" />,
	},
	{
		text: "OpenAI Gym",
		icon: <Icon size={iconSize} imagePath="/icons/gymnasium_white.svg" />,
	},
	{ text: "PostgreSQL", icon: <SiPostgresql size={iconSize} /> },
	{ text: "MongoDB", icon: <SiMongodb size={iconSize} /> },
	{ text: "Redis", icon: <SiRedis size={iconSize} /> },
	{
		text: "Qdrant",
		icon: <Icon size={iconSize} imagePath="/icons/qdrant-logo.svg" />,
	},
	{ text: "Docker", icon: <SiDocker size={iconSize} /> },
	{ text: "AWS", icon: <FaAws size={iconSize} /> },
	{ text: "Git", icon: <FaGit size={iconSize} /> },
	{ text: "GitLab CI/CD", icon: <FaGitlab size={iconSize} /> },
];

const mobileCol: SkillsMarqueeCapsuleProps[] = [...leftCol, ...rightCol];

export default function SkillsSection() {
	const isSkillsSectionInViewport = useIsSectionInViewport("skills", false, 0.04);
	const hasSkillsSectionBeenSeen = useSectionHasBeenInViewport("skills", false);
	const shouldMountSkillsGraphics =
		isSkillsSectionInViewport || hasSkillsSectionBeenSeen;
	return (
		<section
			className="relative w-screen min-h-screen h-fit snap-start overflow-hidden"
			id="skills"
		>
			<div className="pointer-events-none absolute inset-0 z-0 bg-linear-to-b from-[#120a24] via-[#090515] to-[#05020d]" />
			<div className="absolute inset-0 z-10 pointer-events-none">
				{shouldMountSkillsGraphics && (
					<>
						<div className="absolute inset-0 h-[22vh] opacity-24 lg:h-[20vh] lg:opacity-16">
							<Aurora
								amplitude={0.4}
								blend={0.9}
								colorStops={["#4f46c7", "#4ab8b2", "#5d57c9"]}
								speed={0.25}
							/>
						</div>
						<div className="absolute inset-0 opacity-20 lg:opacity-42">
							<LaserFlow
								color="#8000ff"
								wispDensity={2}
								flowSpeed={0.35}
								verticalSizing={5}
								horizontalSizing={1.2}
								fogIntensity={0.9}
								fogScale={0.3}
								wispSpeed={15}
								wispIntensity={5}
								flowStrength={0.25}
								decay={0.8}
								horizontalBeamOffset={0}
								verticalBeamOffset={-0.45}
							/>
						</div>
					</>
				)}
			</div>
			<div className="relative z-30 w-full bg-transparent pt-14 text-center sm:pt-18 lg:pt-20">
				<GradientText
					colors={["#dff6ff", "#9ae6ff", "#a6b4ff", "#dff6ff"]}
					animationSpeed={6}
					showBorder={false}
					direction="horizontal"
					pauseOnHover={true}
					yoyo={true}
					className="cursor-text! rounded-none! bg-transparent text-3xl font-extrabold tracking-[0.15em] backdrop-blur-none sm:text-4xl lg:text-5xl lg:tracking-[0.18em]"
				>
					SKILLS
				</GradientText>
			</div>
			<div
				className="relative z-30 mx-auto mt-8 flex w-full max-w-7xl flex-col gap-4 overflow-hidden px-4 pb-2 sm:mt-10 sm:gap-6 sm:px-6 sm:pb-4 lg:mt-6 lg:h-[75vh] lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:pb-12"
				style={{
					alignItems: "stretch",
				}}
			>
				<div className="h-[70vh] w-full overflow-hidden rounded-2xl sm:h-[74vh] lg:hidden">
					{shouldMountSkillsGraphics && <SkillsMarquee items={mobileCol} idPrefix="skills-marquee-mobile" />}
				</div>
				<div className="hidden h-full w-full gap-6 lg:flex lg:items-center lg:justify-between">
					<div className="h-full w-[48%] overflow-hidden rounded-xl">
						{shouldMountSkillsGraphics && (
							<SkillsMarquee
								items={leftCol}
								idPrefix="skills-marquee-left"
							/>
						)}
					</div>
					<div className="h-full w-[48%] overflow-hidden rounded-xl">
						{shouldMountSkillsGraphics && (
							<SkillsMarquee
								items={rightCol}
								direction="up"
								idPrefix="skills-marquee-right"
							/>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
