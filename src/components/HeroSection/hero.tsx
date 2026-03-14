import LightPillar from "../ui/LightPillar";

const HeroSection = () => {
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
				<div className="p-4 m-auto text-center text-4xl font-bold text-white rounded-4xl"
					style={{
						"backdropFilter": "blur(10px)",
					}}
				>
					Welcome to the Future of Web3
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
