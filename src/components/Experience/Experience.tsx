import { useRef } from "react";
import Silk from "../ui/Silk";
import { useSectionHasBeenInViewport } from "../viewport/viewportHooks";
import WaveGrid from "./WaveGrid";

export default function ExperienceSection() {
	const shouldMountExperienceGraphics = useSectionHasBeenInViewport("experience");
	const bgContainer = useRef<HTMLDivElement>(null);
	return (
		<section
			className="relative w-screen min-h-screen h-fit snap-start overflow-y-hidden"
			style={{
				opacity: "50%",
				backgroundBlendMode: "color-burn",
			}}
			id="experience"
		>
			<div ref={bgContainer} className="absolute top-0 left-0 w-full h-full">
				{shouldMountExperienceGraphics && (
					<WaveGrid parentRef={bgContainer} />
					// <Silk
					// 	speed={8.3}
					// 	scale={1}
					// 	color="#400080"
					// 	noiseIntensity={1.5}
					// 	rotation={0}
					// />
				)}
			</div>
			<div className="absolute" style={{ background: "#fff" }}></div>
		</section>
	);
};
