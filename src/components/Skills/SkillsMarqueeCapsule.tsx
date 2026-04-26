import type React from "react";
import { useState } from "react";
import GradientText from "../ui/GradientText";
export interface SkillsMarqueeCapsuleProps {
	icon: React.ReactNode;
	text: string;
	side?: "left" | "right";
}

export default function SkillsMarqueeCapsule({
	icon,
	text,
	side = "left",
}: SkillsMarqueeCapsuleProps) {
	const [isHovered, setIsHovered] = useState(false);
	return (
		<div
			className={
				`
            group
            flex items-center
		h-14 sm:h-16 lg:h-18
		w-auto px-5 sm:px-6
		gap-3 sm:gap-4
            border border-white/10
            bg-white/5
            backdrop-blur-sm
            text-white
            rounded-full
            whitespace-nowrap
            transition-all duration-300
            hover:bg-white/10
            hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]` +
				" " +
				(side === "left" ? "" : "flex-row-reverse")
			}
			aria-label={`Skill: ${text}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<span className="flex h-12 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-14 lg:h-16 lg:w-16">
				{icon}
			</span>
			<span
				className={
					"mx-auto block max-w-44 overflow-hidden text-center text-base leading-tight transition-all duration-300 sm:max-w-48 sm:text-lg lg:max-w-48 lg:text-lg"
				}
			>
				{isHovered ? (
					<GradientText>{text}</GradientText>
				) : (
					text
				)}
			</span>
		</div>
	);
}
