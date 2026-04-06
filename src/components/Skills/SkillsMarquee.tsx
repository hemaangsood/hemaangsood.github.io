import type { SkillsMarqueeCapsuleProps } from "./SkillsMarqueeCapsule";
// import { cn } from "@/lib/utils";
import { Marquee } from "../ui/marquee";
import SkillsMarqueeCapsule from "./SkillsMarqueeCapsule";
import type { CSSProperties } from "react";

const marqueeEdgeFadeStyle: CSSProperties = {
	WebkitMaskImage:
		"linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
	maskImage:
		"linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
	WebkitMaskRepeat: "no-repeat",
	maskRepeat: "no-repeat",
	WebkitMaskSize: "100% 100%",
	maskSize: "100% 100%",
};

type SkillsMarqueeProps = {
	items: SkillsMarqueeCapsuleProps[];
	direction?: "up" | "down";
	idPrefix?: string;
};

export default function SkillsMarquee({
	items,
	direction = "down",
	idPrefix,
}: SkillsMarqueeProps) {
	const debugIdPrefix = idPrefix ?? `skills-marquee-${direction}`;

	return (
		<div
			id={`${debugIdPrefix}-wrapper`}
			data-debug-id={`${debugIdPrefix}-wrapper`}
			className="relative flex h-full w-full flex-row items-center justify-center overflow-hidden"
			style={marqueeEdgeFadeStyle}
		>
			<Marquee
				id={`${debugIdPrefix}-track`}
				data-debug-id={`${debugIdPrefix}-track`}
				pauseOnHover={true}
				reverse={direction === "down"}
				vertical={true}
				className="h-full [--duration:25s]"
			>
				{items.map((item, index) => (<SkillsMarqueeCapsule key={index} {...item} side={direction==="up"?"right":"left"} />))}
			</Marquee>
			<div
				id={`${debugIdPrefix}-fade-top`}
				data-debug-id={`${debugIdPrefix}-fade-top`}
				className="pointer-events-none absolute inset-x-0 top-0 h-12 z-10 bg-linear-to-b from-[#0a0715]/95 to-transparent"
			/>
			<div
				id={`${debugIdPrefix}-fade-bottom`}
				data-debug-id={`${debugIdPrefix}-fade-bottom`}
				className="pointer-events-none absolute inset-x-0 bottom-0 h-12 z-10 bg-linear-to-t from-[#0a0715]/95 to-transparent"
			/>
		</div>
	);
}