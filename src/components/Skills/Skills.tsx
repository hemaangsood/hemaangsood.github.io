import { LaserFlow } from "../ui/LaserFlow";
import SkillsMarquee from "./SkillsMarquee";
import type { SkillsMarqueeCapsuleProps } from "./SkillsMarqueeCapsule";
import { TbBrandTypescript,TbBrandNextjs } from "react-icons/tb";
import { RiJavascriptLine,RiTailwindCssLine } from "react-icons/ri";
import { SiPython,SiFastapi,SiDjango, SiSpringboot, SiRedux, SiPytorch, SiTensorflow, SiOpencv, SiHuggingface, SiPostgresql, SiMongodb, SiRedis, SiDocker } from "react-icons/si";
import { FaCss, FaGolang, FaHtml5 } from "react-icons/fa6";
import { FaGitlab, FaJava,FaReact,FaGit, FaAws } from "react-icons/fa";
import { DiNodejs } from "react-icons/di";
import Icon from "../icon";
import ShinyText from "../ui/ShinyText";

const iconSize = 40;

const leftCol:SkillsMarqueeCapsuleProps[] = [
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
	{ text: "XGBoost", icon: <Icon size={iconSize} imagePath="/icons/xgboost-logo.png" /> },
	{ text: "OpenAI Gym", icon: <Icon size={iconSize} imagePath="/icons/gymnasium_white.svg" /> },
	{ text: "PostgreSQL", icon: <SiPostgresql size={iconSize} /> },
	{ text: "MongoDB", icon: <SiMongodb size={iconSize} /> },
	{ text: "Redis", icon: <SiRedis size={iconSize} /> },
	{ text: "Qdrant", icon: <Icon size={iconSize} imagePath="/icons/qdrant-logo.svg" /> },
	{ text: "Docker", icon: <SiDocker size={iconSize} /> },
	{ text: "AWS", icon: <FaAws size={iconSize} /> },
	{ text: "Git", icon: <FaGit size={iconSize} /> },
	{ text: "GitLab CI/CD", icon: <FaGitlab size={iconSize} /> },
];

export default function SkillsSection() {
	return (
		<section
			className="relative w-screen min-h-screen h-fit snap-start overflow-y-hidden"
			style={{
				opacity: "50%",
				backgroundBlendMode: "color-burn",
			}}
			id="skills"
		>
			<div className="absolute top-0 left-0 w-screen h-screen">
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
			<div className="w-full text-center mt-30 text-5xl font-bold">
				<ShinyText
					text="SKILLS"
					speed={2}
					delay={0}
					color="#400080"
					shineColor="#ffffff"
					spread={120}
					direction="left"
					yoyo={false}
					pauseOnHover={true}
					disabled={false}
				/>
			</div>
			<div
				className="flex absolute top-0 left-0 w-screen h-screen overflow-hidden px-10 pt-10"
				style={{
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<div className="overflow-hidden w-[48%] h-[75vh] rounded-xl">
					<SkillsMarquee items={leftCol} />
				</div>
				<div className="w-[48%] h-[75vh] rounded-xl overflow-hidden">
					<SkillsMarquee items={rightCol} direction="up" />
				</div>
			</div>
		</section>
	);
}
