import ColorBends from "../ui/ColorBends";

const HeroSection = () => {
	return (
		<div
			className="relative w-screen min-h-screen h-fit"
			style={{
				opacity: "50%",
				backgroundBlendMode: "color-burn",
			}}
		>
			<div className="absolute top-0 left-0 w-full h-full">
				<ColorBends
					rotation={45}
					speed={0.2}
					colors={["#5227FF", "#FF9FFC", "#7cff67"]}
					transparent
					autoRotate={0}
					scale={1}
					frequency={1}
					warpStrength={1}
					mouseInfluence={0}
					parallax={0.5}
					noise={0.1}
				/>
			</div>
			<div className="absolute" style={{ background: "#fff" }}></div>
		</div>
	);
};

export default HeroSection;
