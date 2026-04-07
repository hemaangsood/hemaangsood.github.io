import { useRef } from "react";
import LightPillar from "../ui/LightPillar";
import { TextAnimate } from "../ui/text-animate";
import { TypingAnimation } from "../ui/typing-animation";
import GradientText from "../ui/GradientText";
// import ParticleSphere from "./ParticleSphereThreejs";
import { motion } from "motion/react";
import { useSectionHasBeenInViewport } from "../viewport/viewportHooks";
import ParticleSphere from "./ParticleSphereThreejs";
import "./Hero.css";

function HeroSectionButton({ text, section,link,style,className="" }: { text: string;section?:string; link?: string; style?: React.CSSProperties,className?: string }) {
	const handleClick = () => {
		if (link) {
			document.location.href = link;
		} else if (section) {
			const element = document.getElementById(section);
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			}
		}else {
			console.warn("No section or link provided for HeroSectionButton");
		}
	}
	return (
		<div
			onClick={handleClick}
			className={className+" "+"px-4 py-2 m-2 text-base sm:text-xl md:text-2xl font-semibold text-white cursor-pointer text-center"}
			style={style}
		>
			<div>{text}</div>
		</div>
	);}

const HeroSection = () => {
	const shouldMountHeroGraphics = useSectionHasBeenInViewport("hero", true);
	const meThingsList = [
		"Software Engineer",
		"Full Stack Developer",
		"Backend Developer",
		"Distributed Systems",
		"Machine Learning",
		"IOT Enjoyer",
		"Expert Google Searcher",
	]
	const sphereRef = useRef<HTMLDivElement>(null);
	const particleSphereBrightness = 1.2;
	const particleSphereContrast = 1.2;
	return (
		<section
			className="hero-section relative w-screen min-h-screen h-fit snap-start overflow-y-hidden"
			id="hero"
		>
			<div className="hero-bg-veil absolute top-0 left-0 w-full h-full z-0" />
			<div className="absolute top-0 left-0 w-full h-full z-10">
				{shouldMountHeroGraphics && (
					<LightPillar
						colors={[
							"#5227FF",
							"#dbdb07",
							"#7cff67",
							"#8fdcff",
							"#5227FF",
						]}
						intensity={1}
						rotationSpeed={2}
						interactive={false}
						glowAmount={0.009}
						pillarWidth={3}
						pillarHeight={1}
						noiseIntensity={2}
						pillarRotation={90}
					/>
				)}
			</div>
			<div className="hero-overlay absolute top-0 left-0 w-full h-full z-11" />
			<div className="absolute top-0 left-0 w-full h-full z-20 flex bg-transparent">
				{/* Content */}
				<div className="hero-content-glass flex flex-col lg:flex-row p-4 pt-20 sm:p-8 lg:p-10 m-auto text-center font-bold text-white w-screen min-h-screen">
					<div
						className="flex flex-col items-start w-full lg:w-[60%] mt-6 sm:mt-10 lg:mt-0 px-2 sm:px-4 lg:pl-8"
						style={{
							alignSelf: "center",
							textAlign: "left",
						}}
					>
						<div className="flex flex-wrap items-end gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl leading-tight text-slate-100"
							style={{
								alignItems:"baseline"
							}}
						>
							<span>Hi, I&apos;m</span>
							<GradientText
								colors={["#fffdf3", "#caff9a", "#ff9962"]}
								animationSpeed={7}
								showBorder={false}
								yoyo={true}
								className="hero-name-gradient mx-0! cursor-text! rounded-none! overflow-visible! backdrop-blur-none bg-transparent"
							>
								Hemaang
							</GradientText>
						</div>
						<TypingAnimation
							words={meThingsList}
							className="hero-typing text-xl sm:text-2xl lg:text-4xl mt-3"
							loop={true}
						/>
						<br />
						<GradientText
							colors={["#fffdf7", "#d8ffbb", "#ffc785"]}
							animationSpeed={8}
							showBorder={false}
							yoyo={true}
							className="hero-edu-gradient mx-0! cursor-text! rounded-none! p-0! backdrop-blur-none bg-transparent text-lg sm:text-xl lg:text-2xl mt-2 sm:mt-4"
						>
							MEng ECE @ University of Waterloo
						</GradientText>
						<TextAnimate
							animation="slideLeft"
							by="word"
							as="p"
							className="hero-description text-base sm:text-lg lg:text-xl mt-3 max-w-full lg:max-w-[80%]"
						>
							{`Software engineer focused on building reliable backend systems, machine learning applications, and clean developer-first tools.`}
						</TextAnimate>
						<motion.div
							initial={{ y: 100, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5 }}
							className="flex flex-col sm:flex-row sm:items-center mt-6 sm:mt-10 w-full"
						>
							<HeroSectionButton
								text="View Projects"
								section="projects"
								className="hero-button-primary w-full sm:w-auto rounded-xl transition duration-300"
							/>
							<HeroSectionButton
								text="Contact Me &rarr;"
								section="contact"
								className="hero-button-secondary w-full sm:w-auto border-2 rounded-xl transition duration-300"
							/>
						</motion.div>
					</div>
					<div
						className="w-full lg:w-[40%] h-[35vh] sm:h-[45vh] lg:h-full mt-6 lg:mt-0"
						ref={sphereRef}
					>
						{shouldMountHeroGraphics && (
							<ParticleSphere
								parentRef={sphereRef}
								brightness={particleSphereBrightness}
								contrast={particleSphereContrast}
							/>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
