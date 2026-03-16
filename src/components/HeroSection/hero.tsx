import { useRef } from "react";
import LightPillar from "../ui/LightPillar";
import { TextAnimate } from "../ui/text-animate";
import { TypingAnimation } from "../ui/typing-animation";
import ParticleSphere from "./ParticleSphereThreejs";
import { motion } from "motion/react";
import { useSectionHasBeenInViewport } from "../viewport/viewportHooks";

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
	return (
		<section
			className="relative w-screen min-h-screen h-fit snap-start overflow-y-hidden"
			style={{
				opacity: "50%",
				backgroundBlendMode: "color-burn",
			}}
			id="hero"
		>
			<div className="absolute top-0 left-0 w-full h-full z-10">
				{shouldMountHeroGraphics && (
					<LightPillar
						topColor="#00ff00"
						bottomColor="#c210ef"
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
			<div className="absolute top-0 left-0 w-full h-full z-11 flex bg-transparent">
				{/* Content */}
				<div
					className="flex flex-col lg:flex-row p-4 pt-20 sm:p-8 lg:p-10 m-auto text-center font-bold text-white w-screen min-h-screen"
					style={{
						backdropFilter: "blur(20px)",
						backgroundColor: "rgba(255, 255, 255, 0.1)",
						alignItems: "center",
					}}
				>
					<div
						className="flex flex-col items-start w-full lg:w-[60%] mt-6 sm:mt-10 lg:mt-0 px-2 sm:px-4 lg:pl-8"
						style={{
							alignSelf: "center",
							textAlign: "left",
						}}
					>
						<div className="text-2xl sm:text-3xl lg:text-4xl leading-tight">
							Hi, I'm{" "}
							<span className="text-3xl sm:text-4xl lg:text-5xl text-yellow-300">
								Hemaang
							</span>
						</div>
						<TypingAnimation
							words={meThingsList}
							className="text-xl sm:text-2xl lg:text-4xl mt-3"
							loop={true}
						/>
						<br />
						<TextAnimate
							animation="scaleUp"
							className="text-lg sm:text-xl lg:text-2xl mt-2 sm:mt-4"
						>
							MEng ECE @ University of Waterloo
						</TextAnimate>
						<TextAnimate
							animation="slideLeft"
							by="word"
							as="p"
							className="text-base sm:text-lg lg:text-xl mt-3 max-w-full lg:max-w-[80%]"
						>
							{`Software engineer focused on building reliable backend systems, machine learning applications, and clean developer-first tools.`}
						</TextAnimate>
						<motion.div 
							initial={{y:100,opacity:0}}
							whileInView={{y:0,opacity:1}}
							transition={{duration:0.5}}
							className="flex flex-col sm:flex-row sm:items-center mt-6 sm:mt-10 w-full">
							<HeroSectionButton
								text="View Projects"
								section="projects"
								// Hover must be light purple
								className="w-full sm:w-auto bg-purple-800 rounded-xl transition duration-300 hover:shadow-[0_0_10px_#c084fc,0_0_40px_#c084fc]"
							/>
							<HeroSectionButton
								text="Contact Me &rarr;"
								section="contact"
								className="w-full sm:w-auto bg-transparent border-purple-800 border-2 rounded-xl transition duration-300 hover:shadow-[0_0_10px_#c084fc,0_0_40px_#c084fc]"
								style={{
									color: "white",
								}}
							/>
						</motion.div>
					</div>
					<div className="w-full lg:w-[40%] h-[35vh] sm:h-[45vh] lg:h-full mt-6 lg:mt-0" ref={sphereRef}>
						{shouldMountHeroGraphics && (
							<ParticleSphere parentRef={sphereRef} />
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
