import Aurora from "../ui/Aurora";

const AboutSection = () => {
	return (
		<div
			className="relative w-screen min-h-screen h-fit"
			style={{
				opacity: "50%",
				backgroundBlendMode: "color-burn",
			}}
		>
			<div className="absolute top-0 left-0 w-full h-full">
				<Aurora

				/>
			</div>
			<div className="absolute" style={{ background: "#fff" }}></div>
		</div>
	);
};

export default AboutSection;
