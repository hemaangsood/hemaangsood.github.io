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
	side="left"
}: SkillsMarqueeCapsuleProps) {
	const [isHovered, setIsHovered] = useState(false);
	return (
		<div
			className={
				`
            group
            flex items-center
            h-16
            w-auto px-4
            gap-2
            border border-white/10
            bg-white/5
            backdrop-blur-sm
            text-white
            rounded-full
            whitespace-nowrap
            transition-all duration-300
            hover:bg-white/10
			// hover:max-h-fit
            hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]` +
				" " +
				(side === "left" ? "" : "flex-row-reverse")
			}
			aria-label={`Skill: ${text}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<span className="flex items-center justify-center shrink-0 w-16 h-16">
				{icon}
			</span>
			<span
				className={
					`overflow-hidden hidden lg:block text-center text-sm lg:text-lg transition-all mx-auto duration-300 max-w-30`
					// + (side === "left" ? "-ml-10 lg:ml-0" : "-mr-10 lg:mr-0")
				}
				style={{
					lineHeight: "2",
				}}
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
