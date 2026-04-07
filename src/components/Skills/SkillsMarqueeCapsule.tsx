import type React from "react";
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
	return (
		<div
			className={`
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
            hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]`+ " " + (side === "left" ? "" : "flex-row-reverse")}
			aria-label={`Skill: ${text}`}

		>
			<span className="flex items-center justify-center shrink-0 w-16 h-16">
				{icon}
			</span>
			<span className="overflow-hidden transition-all mx-auto duration-300 max-w-30">
				{text}
			</span>
		</div>
	);
}
