import HeaderContainer from "./HeaderContainer";
import Logo from "../Logo";
import { RainbowButton } from "../ui/rainbow-button";
import type { ContainerPropsElement } from "./HeaderContainer";
import { useSectionViewport } from "../viewport/viewportHooks";
import GradientText from "../ui/GradientText";

type Props = {
	scrollContainer: React.RefObject<HTMLDivElement>;
};

function HeaderSectionRedirectButton({
	text,
	sectionId,
	isActive = false,
}: {
	text: string;
	sectionId: string;
	isActive?: boolean;
}): ContainerPropsElement {
	return {
		children: (
			<div
				className={`rounded-xl hidden lg:block py-1 px-2.5 mt-1 transition-colors duration-700 cursor-pointer ${
					isActive
						? "bg-white text-black"
						: "bg-transparent text-white hover:text-black hover:bg-white"
				}`}
			>
				{text}
			</div>
		),
		onClick: () => {
			const destSection = document.getElementById(sectionId);
			if (destSection) {
				destSection.scrollIntoView({ behavior: "smooth" });
			}
		},
	};
}

export default function Header({ scrollContainer }: Props) {
	void scrollContainer;
	const { activeSection } = useSectionViewport();

	// const gradient = useTransform(
	// 	scrollYProgress,
	// 	(v) => `linear-gradient(to right, white,purple, purple ${v * 100}%, green)`,
	// );

	return (
		<div className="w-full fixed top-0 left-0 z-50 px-4 pt-3 pr-6">
			<div className="relative flex items-center w-full h-16 mb-2">
				<Logo />

				<HeaderContainer side="left" items={[]} />

				<HeaderContainer
					side="right"
					items={[
						HeaderSectionRedirectButton({
							text: "Home",
							sectionId: "hero",
							isActive: activeSection === "hero",
						}),
						HeaderSectionRedirectButton({
							text: "About",
							sectionId: "about",
							isActive: activeSection === "about",
						}),
						HeaderSectionRedirectButton({
							text: "Skills",
							sectionId: "skills",
							isActive: activeSection === "skills",
						}),
						HeaderSectionRedirectButton({
							text: "Projects",
							sectionId: "projects",
							isActive: activeSection === "projects",
						}),
						HeaderSectionRedirectButton({
							text: "Experience",
							sectionId: "experience",
							isActive: activeSection === "experience",
						}),
						HeaderSectionRedirectButton({
							text: "Contact",
							sectionId: "contact",
							isActive: activeSection === "contact",
						}),
						{
							children: (
								<RainbowButton
									speed={10}
									className="hover:scale-110"
								>
									<p className="rainbow-text">Resume</p>
								</RainbowButton>
							),
							onClick: () => {
								window.open("/HemaangRes.pdf", "_blank");
							},
						},
					]}
				/>
			</div>

			{/* <motion.div
				className="absolute bottom-0 left-0 h-[0.2rem] w-full origin-left z-51"
				style={{
					background: gradient,
				}}
			/> */}
		</div>
	);
}
