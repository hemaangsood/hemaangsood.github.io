import Dither from "../ui/Dither";
import { useSectionHasBeenInViewport } from "../viewport/viewportHooks";
import Solar from "./Solar";

const ProjectsSection = () => {
	const shouldMountProjectsGraphics = useSectionHasBeenInViewport("projects");
	return (
		<section
			className="relative w-screen min-h-screen h-fit snap-start overflow-y-hidden"
			style={{
				opacity: "50%",
				backgroundBlendMode: "color-burn",
			}}
			id="projects"
		>
			<div
				className="absolute top-0 left-0 w-full h-full"
				style={{
					background: "#080d1a",
				}}
			>
				{shouldMountProjectsGraphics && (
					// <Dither
					// 	waveColor={[0.25098039215686274, 0, 0.5019607843137255]}
					// 	disableAnimation={false}
					// 	enableMouseInteraction={false}
					// 	mouseRadius={0.2}
					// 	colorNum={9}
					// 	pixelSize={3}
					// 	waveAmplitude={0.35}
					// 	waveFrequency={4.5}
					// 	waveSpeed={0.08}
					// />
					<></>
				)}
			</div>
			<div className="flex absolute top-0 left-0 w-full h-full">
				<Solar />
			</div>
		</section>
	);
};

export default ProjectsSection;
