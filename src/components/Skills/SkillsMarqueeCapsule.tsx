import type React from "react";
export interface SkillsMarqueeCapsuleProps {
	icon: React.ReactNode;
	text: string;
}

export default function SkillsMarqueeCapsule({
	icon,
	text,
}: SkillsMarqueeCapsuleProps) {
	return (
		<div
			className={`
            group
            flex items-center
            w-16 h-16
            hover:w-auto hover:px-4
            gap-0 hover:gap-2
            border border-white/10
            bg-white/5
            backdrop-blur-sm
            text-white
            rounded-full
            whitespace-nowrap
            transition-all duration-300
            hover:bg-white/10
            hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]`}
			aria-label={`Skill: ${text}`}
		>
			<span className="flex items-center justify-center shrink-0 w-16 h-16">
				{icon}
			</span>
			<span className="max-w-0 invisible group-hover:visible overflow-hidden opacity-0 transition-all duration-300 group-hover:max-w-30 group-hover:opacity-100 pr-0 group-hover:pr-0">
				{text}
			</span>
		</div>
	);
}
