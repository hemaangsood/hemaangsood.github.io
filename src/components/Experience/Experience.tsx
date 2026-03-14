import DarkVeil from "../ui/DarkVeil";

export default function ExperienceSection() {
	return (
		<section
			className="relative w-screen min-h-screen h-fit snap-start overflow-y-hidden"
			style={{
				opacity: "50%",
				backgroundBlendMode: "color-burn",
			}}
			id="experience"
		>
			<div className="absolute top-0 left-0 w-full h-full">
				<DarkVeil
					hueShift={-5}
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
