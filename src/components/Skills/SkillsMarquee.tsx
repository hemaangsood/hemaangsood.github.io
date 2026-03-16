import type { SkillsMarqueeCapsuleProps } from "./SkillsMarqueeCapsule";
// import { cn } from "@/lib/utils";
import { Marquee } from "../ui/marquee";
import SkillsMarqueeCapsule from "./SkillsMarqueeCapsule";

export default function SkillsMarquee({items,direction="down"}:
	{items:SkillsMarqueeCapsuleProps[]; direction?:"up"|"down"}
) {
	return (
		<div className="relative flex w-full flex-row items-center overflow-hidden justify-center overflow-hidden">
			<Marquee pauseOnHover={true} reverse={direction === "down"} vertical={true} className="[--duration:25s]">
				{items.map((item, index) => (<SkillsMarqueeCapsule key={index} {...item} />))}
			</Marquee>
		</div>
	);
}