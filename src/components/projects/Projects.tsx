import {
	useIsSectionInViewport,
	useSectionHasBeenInViewport,
} from "../viewport/viewportHooks";
import Solar from "./Solar";

const ProjectsSection = () => {
	const isProjectsVisible = useIsSectionInViewport("projects", false, 0.08);
	const hasMountedProjectsGraphics = useSectionHasBeenInViewport("projects");
	const shouldMountProjectsGraphics =
		isProjectsVisible || hasMountedProjectsGraphics;
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
			</div>
			<div className="flex absolute top-0 left-0 w-full h-full">
				{shouldMountProjectsGraphics && <Solar isActive={isProjectsVisible} />}
				<div
					className="absolute top-25 left-19/20 transform -translate-x-1/2 cursor-pointer text-4xl animate-bounce"
					onClick={() => {
						const destSection =
							document.getElementById("skills");
						if (destSection) {
							destSection.scrollIntoView({ behavior: "smooth" });
						}
					}}
				>
					↑
				</div>
				<div
					className="absolute bottom-25 lg:bottom-6 left-19/20 transform -translate-x-1/2 cursor-pointer text-4xl animate-bounce"
					onClick={() => {
						const destSection =
							document.getElementById("experience");
						if (destSection) {
							destSection.scrollIntoView({ behavior: "smooth" });
						}
					}}
				>
					↓
				</div>
			</div>
		</section>
	);
};

export default ProjectsSection;
