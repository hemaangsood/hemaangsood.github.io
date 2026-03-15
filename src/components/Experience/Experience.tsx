import DarkVeil from "../ui/DarkVeil";
import Silk from "../ui/Silk";

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
				<Silk
					speed={8.3}
					scale={1}
					color="#400080"
					noiseIntensity={1.5}
					rotation={0}
				/>
			</div>
			<div className="absolute" style={{ background: "#fff" }}></div>
		</section>
	);
};
