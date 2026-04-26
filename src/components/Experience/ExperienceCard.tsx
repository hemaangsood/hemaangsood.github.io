import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

export type ExperienceEntry = {
	company: string;
	role: string;
	period: string;
	highlights: string[];
};

type ExperienceCardProps = {
	entry: ExperienceEntry;
	className?: string;
	style?: CSSProperties;
	contentClassName?: string;
	highlightsClassName?: string;
};

export default function ExperienceCard({
	entry,
	className,
	style,
	contentClassName,
	highlightsClassName,
}: ExperienceCardProps) {
	return (
		<Card
			className={cn(
				"experience-card w-full min-w-0 max-w-full transition-transform duration-300 ease-in-out text-white overflow-hidden",
				className,
			)}
			style={style}
		>
			<CardHeader className="shrink-0">
				<div className="flex min-w-0 flex-col flex-wrap gap-2 sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0">
						<CardTitle className="experience-company text-xl sm:text-3xl font-semibold wrap-break-word leading-tight">
							{entry.company}
						</CardTitle>
						<CardDescription className="experience-role text-base sm:text-xl mt-0.5 wrap-break-word">
							{entry.role}
						</CardDescription>
					</div>
					<p className="experience-period text-xs sm:text-sm tracking-wide uppercase wrap-break-word whitespace-nowrap sm:ml-auto sm:text-right">
						{entry.period}
					</p>
				</div>
			</CardHeader>
			<CardContent
				className={cn("experience-card-content", contentClassName)}
			>
				<ul
					className={cn(
						"experience-highlights thin-scrollbar list-disc pl-5 space-y-2 text-sm sm:text-base 2xl:text-lg leading-relaxed wrap-anywhere",
						highlightsClassName,
					)}
				>
					{entry.highlights.map((highlight) => (
						<li key={highlight}>{highlight}</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
