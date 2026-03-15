import { LaserFlow } from "../ui/LaserFlow";

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
			<div className="absolute top-0 left-0 w-full h-full">
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
			<div className="absolute" style={{ background: "#fff" }}></div>
		</section>
	);
};
