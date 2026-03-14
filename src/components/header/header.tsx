import { motion, useScroll } from "motion/react";
import HeaderContainer from "./HeaderContainer";
import Logo from "../Logo";
import { RainbowButton } from "../ui/rainbow-button";

type Props = {
	scrollContainer: React.RefObject<HTMLDivElement>;
};

export default function Header({ scrollContainer }: Props) {
	const { scrollYProgress } = useScroll({
		container: scrollContainer,
	});

	return (
		<div className="w-full fixed top-0 left-0 z-50 px-4 pt-3 pr-6">
			<div className="relative flex items-center w-full h-16 mb-2">
				<Logo />

				<HeaderContainer
					side="left"
					items={[]}
				/>

				<HeaderContainer
					side="right"
					items={[{ children:(
					<RainbowButton speed={10}
						className="hover:scale-110"
					>
						Resume
					</RainbowButton>), onClick: () => {} }]}
				/>
			</div>

			<motion.div
				className="absolute bottom-0 left-0 h-[0.2rem] w-full origin-left z-[51]"
				style={{
					scaleX: scrollYProgress,
					background:
						"linear-gradient(to right, white, green, purple)",
				}}
			/>
		</div>
	);
}
