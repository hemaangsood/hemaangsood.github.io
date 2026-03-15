import LightPillar from "../ui/LightPillar";
import { TextAnimate } from "../ui/text-animate";
import { TypingAnimation } from "../ui/typing-animation";

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
			className={className+" "+"px-4 py-2 m-2 text-3xl font-semibold text-white cursor-pointer"}
			style={style}
		>
			<div>{text}</div>
		</div>
	);}

const HeroSection = () => {
	const meThingsList = [
		"Software Engineer",
		"Full Stack Developer",
		"Backend Developer",
		"Distributed Systems",
		"Machine Learning",
		"IOT Enjoyer",
		"Expert Google Searcher",
	]
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
				<LightPillar
					topColor="#00ff00"
					bottomColor="#c210ef"
					intensity={0.9}
					rotationSpeed={0.8}
					interactive={false}
					glowAmount={0.002}
					pillarWidth={3}
					pillarHeight={0.4}
					noiseIntensity={0.8}
					pillarRotation={90}
				/>
			</div>
			<div className="absolute top-0 left-0 w-full h-full z-11 flex bg-transparent">
				<div
					className="flex p-10 m-auto text-center font-bold text-white rounded-4xl min-w-[50vw] min-h-[60vh]"
					style={{
						// paddingTop: "4rem",
						backdropFilter: "blur(40px)",
						backgroundColor: "rgba(255, 255, 255, 0.1)",
					}}
				>
					<div
						className="flex flex-col items-start"
						style={{
							alignSelf: "flex-start max-w-[60%]",
							textAlign: "left",
						}}
					>
						<div className="text-4xl">
							Hi, I'm{" "}
							<span className="text-5xl text-yellow-300">
								Hemaang
							</span>
						</div>
						<TypingAnimation
							words={meThingsList}
							className="text-4xl mt-3"
							loop={true}
						/>
						<br />
						<TextAnimate
							animation="scaleUp"
							className="text-2xl mt-5"
						>
							MEng ECE @ University of Waterloo
						</TextAnimate>
						<TextAnimate
							animation="slideLeft"
							by="word"
							as="p"
							className="text-xl mt-3 max-w-[80%]"
						>
							{`Software engineer focused on building reliable backend systems, machine learning applications, and clean developer-first tools.`}
						</TextAnimate>
						<div className="flex align-baseline mt-10">
							<HeroSectionButton
								text="View Projects"
								section="projects"
								// Hover must be light purple
								className="bg-purple-800 rounded-xl transition duration-300 hover:shadow-[0_0_10px_#c084fc,0_0_40px_#c084fc]"
							/>
							<HeroSectionButton
								text="Contact Me &rarr;"
								section="contact"
								className="bg-transparent border-purple-800 border-2 rounded-xl transition duration-300 hover:shadow-[0_0_10px_#c084fc,0_0_40px_#c084fc]"
								style={{
									color: "white",
								}}
							/>
						</div>
					</div>
					{/* Fluid simulation */}
					<div
						className="min-w-[40%]"
						style={{
							alignSelf: "flex-end",
						}}
					></div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
