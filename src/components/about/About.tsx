import Aurora from "../ui/Aurora";

const AboutSection = () => {
	return (
		<section
			className="relative w-screen min-h-screen h-fit snap-start  overflow-y-hidden"
			style={{
				opacity: "50%",
				backgroundBlendMode: "color-burn",
			}}
			id="about"
		>
			<div className="absolute top-0 left-0 w-full h-full">
				<Aurora amplitude={1.2} />
			</div>
			<div className="absolute" style={{ background: "#fff" }}></div>
		</section>
	);
};

export default AboutSection;
