import HeaderContainer from "./HeaderContainer";
import { useScroll } from "framer-motion";

export default function Header() {
	const { scrollYProgress } = useScroll();
	return (
		<>
			<div
				className="flex w-full h-16 bg-blend-color-burn fixed top-0 left-0 px-6 py-2"
				style={{
					background:
						scrollYProgress.get() == 0 ? "transparent" : "black",
				}}
			>
				<HeaderContainer
					side="left"
					items={[{ title: "1", onClick: () => {} }]}
				/>
				<HeaderContainer
					side="right"
					items={[{ title: "2", onClick: () => {} }]}
				/>
			</div>
		</>
	);
}
