import DarkVeil from "../ui/DarkVeil";

const ProjectsSection = () => {
	return (
		<section
			className="relative w-screen min-h-screen h-fit snap-start overflow-y-hidden"
			style={{
				opacity: "50%",
				backgroundBlendMode: "color-burn",
			}}
		>
			<div className="absolute top-0 left-0 w-full h-full">
				<DarkVeil
					hueShift={70}
					noiseIntensity={0.02}
					scanlineIntensity={0.4}
					speed={0.8}
					scanlineFrequency={0}
					warpAmount={0.05}
					resolutionScale={1.25}
				/>
			</div>
			<div className="absolute" style={{ background: "#fff" }}></div>
		</section>
	);
};

export default ProjectsSection;
