import { useEffect, useState } from "react";
import HeaderContainer from "./HeaderContainer";
import { useScroll } from "framer-motion";
import Logo from "../Logo";

export default function Header() {
	const { scrollY } = useScroll();
	const [scrollLevel, setScrollLevel] = useState(0);
	useEffect(() => {
		return scrollY.on("change", (latest) => {
			setScrollLevel(latest);
		});
	}, [scrollY]);
	const [maxScrollPossible, setMaxScrollPossible] = useState(0);

	useEffect(() => {
		const updateMaxScroll = () => {
			setMaxScrollPossible(
				document.documentElement.scrollHeight - window.innerHeight,
			);
		};
		updateMaxScroll();
		window.addEventListener("resize", updateMaxScroll);

		return () => window.removeEventListener("resize", updateMaxScroll);
	}, []);
	const progress = (scrollLevel / maxScrollPossible) * 100;
	return (
		<div
			className="w-full z-50 fixed top-0 left-0 px-4 pt-1"
			style={{
				background: scrollLevel > 0 ? "rgb(0, 0, 0,0.9)" : "transparent",
			}}
		>
			<div className="relative items-center flex w-full h-16 bg-blend-color-burn mb-2"
				style={{
					alignItems:"center"
				}}
			>
				<Logo />
				<HeaderContainer
					side="left"
					items={[{ title: "1", onClick: () => {} }]}
				/>
				<HeaderContainer
					side="right"
					items={[{ title: "2", onClick: () => {} }]}
				/>
			</div>
			<div
				className="absolute w-full h-[0.2rem] z-51 bottom-0 left-0"
				style={{
					width: scrollLevel > 0 ? `${progress}%` : "0%",
					background:
						"linear-gradient(to right, white 0%, green 50%, purple 100%)",
				}}
			></div>
		</div>
	);
}
