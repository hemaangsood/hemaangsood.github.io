import Grainient from "../ui/Grainient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdOutlineEmail, MdOutlineFileOpen } from "react-icons/md";
import { FiArrowUpRight } from "react-icons/fi";
import {
	useIsSectionInViewport,
} from "../viewport/viewportHooks";
import GradientText from "../ui/GradientText";

type ContactAction = {
	title: string;
	description: string;
	href: string;
	icon: React.ReactNode;
};

const contactActions: ContactAction[] = [
	{
		title: "GitHub",
		description: "See projects, code samples, and experiments.",
		href: "https://github.com/hemaangsood",
		icon: <FaGithub size={20} />,
	},
	{
		title: "LinkedIn",
		description: "Connect and reach out for collaboration.",
		href: "https://www.linkedin.com/in/hemaang-sood-a72153b0/",
		icon: <FaLinkedin size={20} />,
	},
	{
		title: "Resume",
		description: "Download my latest resume as a PDF.",
		href: "/HemaangRes.pdf",
		icon: <MdOutlineFileOpen size={22} />,
	},
	{
		title: "Email",
		description: "Reach out directly for opportunities or questions.",
		href: "mailto:hemaangsood@gmail.com",
		icon: <MdOutlineEmail size={22} />,
	},
];

export default function ContactSection() {
	const isContactVisible = useIsSectionInViewport("contact", false, 0.08);
	const shouldMountContactGraphics = isContactVisible;

	const openLink = (href: string) => {
		window.open(href, "_blank", "noopener,noreferrer");
	};

	return (
		<section
			className="relative w-full max-w-full min-h-screen h-fit snap-start overflow-hidden"
			style={{
				opacity: "50%",
				backgroundBlendMode: "color-burn",
			}}
			id="contact"
		>
			<div className="absolute top-0 left-0 w-full h-full">
				{shouldMountContactGraphics && (
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
				)}
			</div>
			<div className="absolute top-0 left-0 w-full h-full bg-black/35" />

			<div className="absolute top-0 left-0 w-full h-full max-w-full overflow-y-auto overflow-x-hidden flex items-start lg:items-center justify-center px-4 sm:px-6 md:px-10 pt-20 pb-10">
				<div
					className="w-full max-w-[90vw] min-w-0 rounded-3xl border border-white/30 overflow-hidden my-auto"
					style={{
						background:
							"linear-gradient(145deg, rgba(6,10,30,0.72), rgba(28,14,52,0.6))",
						backdropFilter: "blur(18px)",
					}}
				>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-5 sm:p-8 lg:p-10 min-w-0 max-w-full overflow-hidden">
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							animate={
								isContactVisible
									? { opacity: 1, y: 0 }
									: { opacity: 0, y: 40 }
							}
							transition={{ duration: isContactVisible ? 0.45 : 0.25 }}
							className="flex min-w-0 max-w-full flex-col justify-between overflow-hidden"
						>
							<div className="min-w-0 max-w-full">
									<p className="text-lg lg:text-xl font-bold tracking-[0.24em] text-white/70 uppercase wrap-anywhere">
									Contact
								</p>
									<GradientText className="mx-0! mt-2 block max-w-[24ch] text-[1.55rem] sm:text-4xl lg:text-[2.6rem] font-extrabold leading-[1.4] tracking-[-0.02em] text-white wrap-anywhere">
									Let&apos;s Build Something Real
								</GradientText>
									<p className="mt-4 max-w-[68ch] text-sm sm:text-base lg:text-[1.05rem] leading-[1.55] text-white/85 wrap-anywhere">
									I like solving backend-heavy problems, designing reliable
									systems, and shipping practical ML-powered tools. If your
									team is building meaningful products, I&apos;d love to connect.
								</p>
							</div>

							<div className="mt-8 flex min-w-0 max-w-full flex-wrap gap-3">
								<Button
									onClick={() => openLink("https://github.com/hemaangsood")}
									className="bg-white text-black hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5"
								>
									Open GitHub
								</Button>
								<Button
									variant="outline"
									onClick={() => openLink("/HemaangRes.pdf")}
									className="border-white/80 text-white hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5"
								>
									View Resume
								</Button>
								<Button
									variant="ghost"
									onClick={() => {
										const heroSection = document.getElementById("hero");
										if (heroSection) {
											heroSection.scrollIntoView({ behavior: "smooth" });
										}
									}}
									className="text-white hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5"
								>
									Back To Top
								</Button>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 40 }}
							animate={
								isContactVisible
									? { opacity: 1, y: 0 }
									: { opacity: 0, y: 40 }
							}
							transition={{
								duration: isContactVisible ? 0.45 : 0.25,
								delay: isContactVisible ? 0.1 : 0,
							}}
							className="grid grid-cols-1 lg:grid-cols-2 auto-rows-fr gap-3 min-w-0 max-w-full"
						>
							{contactActions.map((action, index) => (
								<motion.div
									key={action.title}
									initial={{ opacity: 0, y: 24, scale: 0.98 }}
									animate={
										isContactVisible
											? { opacity: 1, y: 0, scale: 1 }
											: { opacity: 0, y: 24, scale: 0.98 }
									}
									transition={{
										duration: isContactVisible ? 0.4 : 0.22,
										delay: isContactVisible ? 0.18 + index * 0.1 : 0,
										ease: [0.22, 1, 0.36, 1],
									}}
									whileHover={{ y: -2 }}
									whileTap={{ scale: 0.995 }}
									className="group min-w-0 max-w-full overflow-hidden"
								>
									<Card
										className="relative border h-full min-w-0 max-w-full overflow-hidden border-white/35 bg-white/10 text-white backdrop-blur-sm transition-colors duration-300 group-hover:border-white/60 group-hover:bg-white/15"
									>
										<div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
										<CardHeader className="pb-3 relative min-w-0">
											<CardTitle className="flex min-w-0 items-center justify-between gap-2 text-xl sm:text-3xl font-semibold wrap-anywhere">
												<span className="flex min-w-0 items-center gap-2">
													<span className="transition-transform duration-300 group-hover:scale-110">
														{action.icon}
													</span>
													<GradientText className="px-1 min-w-0 wrap-anywhere">
														{action.title}
													</GradientText>
												</span>
												<FiArrowUpRight className="opacity-80 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
											</CardTitle>
											<CardDescription className="text-white/75 text-base sm:text-xl mt-0.5 wrap-anywhere">
												{action.description}
											</CardDescription>
										</CardHeader>
										<CardContent className="pt-0 mt-auto mb-1 relative">
											<Button
												variant="outline"
												onClick={() => openLink(action.href)}
												className="w-full border-white/70 text-white hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5"
											>
												Open {action.title}
											</Button>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
};
