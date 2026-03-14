import Grainient from "../ui/Grainient";

export default function ContactSection() {
	return (
		<section
			className="relative w-screen min-h-screen h-fit snap-start overflow-y-hidden"
			style={{
				opacity: "50%",
				backgroundBlendMode: "color-burn",
			}}
		>
			<div className="absolute top-0 left-0 w-full h-full">
				<Grainient
					color1="#FF9FFC"
					color2="#5227FF"
					color3="#00ff00"
					timeSpeed={0.25}
					colorBalance={0}
					warpStrength={1}
					warpFrequency={5}
					warpSpeed={2}
					warpAmplitude={50}
					blendAngle={0}
					blendSoftness={0.05}
					rotationAmount={500}
					noiseScale={2}
					grainAmount={0.1}
					grainScale={2}
					grainAnimated={false}
					contrast={1.5}
					gamma={1}
					saturation={1}
					centerX={0}
					centerY={0}
					zoom={0.9}
				/>
			</div>
			<div className="absolute" style={{ background: "#fff" }}></div>
		</section>
	);
};
