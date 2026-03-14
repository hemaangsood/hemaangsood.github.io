import HeaderContainer from "./HeaderContainer";
import Logo from "../Logo";
import { RainbowButton } from "../ui/rainbow-button";
import type { ContainerPropsElement } from ".";
import { useScroll} from "framer-motion";

type Props = {
	scrollContainer: React.RefObject<HTMLDivElement>;
};

function HeaderSectionRedirectButton({
	text,
	sectionId,
}: {
	text: string;
	sectionId: string;
}): ContainerPropsElement {
	return {
		children:( <div
			className="rounded-xl bg-transparent text-white hover:text-black py-1 px-2.5 mt-1 hover:bg-white"
		>{text}</div>),
		onClick: () => {
			const destSection = document.getElementById(sectionId);
			if (destSection) {
				destSection.scrollIntoView({ behavior: "smooth" });
			}
		},
	};
}

export default function Header({ scrollContainer }: Props) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { scrollYProgress } = useScroll({
		container: scrollContainer,
	});

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
						}),
						HeaderSectionRedirectButton({
							text: "About",
							sectionId: "about",
						}),
						HeaderSectionRedirectButton({
							text: "Projects",
							sectionId: "projects",
						}),
						HeaderSectionRedirectButton({
							text: "Experience",
							sectionId: "experience",
						}),
						HeaderSectionRedirectButton({
							text: "Skills",
							sectionId: "skills",
						}),
						HeaderSectionRedirectButton({
							text: "Contact",
							sectionId: "contact",
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
							onClick: () => {},
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
