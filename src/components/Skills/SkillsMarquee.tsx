import type { SkillsMarqueeCapsuleProps } from "./SkillsMarqueeCapsule";
// import { cn } from "@/lib/utils";
import { Marquee } from "../ui/marquee";
import SkillsMarqueeCapsule from "./SkillsMarqueeCapsule";
import type { CSSProperties } from "react";

const marqueeEdgeFadeStyle: CSSProperties = {
	WebkitMaskImage:
		"linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)",
	maskImage:
		"linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)",
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
	// Keep scroll speed consistent even when the two columns have different lengths.
	const marqueeDuration = `${Math.round(items.length * 1.6)}s`;

	return (
		<div
			id={`${debugIdPrefix}-wrapper`}
			data-debug-id={`${debugIdPrefix}-wrapper`}
			className="relative flex h-full w-full flex-row items-center justify-center overflow-hidden bg-transparent"
			style={marqueeEdgeFadeStyle}
		>
			<Marquee
				id={`${debugIdPrefix}-track`}
				data-debug-id={`${debugIdPrefix}-track`}
				pauseOnHover={true}
				reverse={direction === "down"}
				vertical={true}
				className="h-full"
				style={{ "--duration": marqueeDuration } as CSSProperties}
			>
				{items.map((item, index) => (<SkillsMarqueeCapsule key={index} {...item} side={direction==="up"?"right":"left"} />))}
			</Marquee>
		</div>
	);
}