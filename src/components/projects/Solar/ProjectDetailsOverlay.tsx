import React from "react";
import type { SelectedProject } from "./types";

type ProjectDetailsOverlayProps = {
	project: SelectedProject;
	onClose: () => void;
};

export function ProjectDetailsOverlay({
	project,
	onClose,
}: ProjectDetailsOverlayProps) {
	if (!project) return null;

	return (
		<div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex justify-center sm:left-auto sm:right-4 sm:w-md">
			<aside className="pointer-events-auto w-full rounded-xl border border-white/20 bg-black/70 p-4 text-white shadow-2xl backdrop-blur-md">
				<div className="mb-3 flex items-start justify-between gap-4">
					<div>
						<h3 className="text-lg font-semibold leading-tight">{project.name}</h3>
						<p className="mt-1 text-sm text-white/75">{project.id}</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded border border-white/30 px-2 py-1 text-xs font-medium transition hover:bg-white/10 active:scale-[0.98]"
					>
						Close
					</button>
				</div>

				<p className="text-sm leading-relaxed text-white/90">{project.description}</p>

				{project.techStack && project.techStack.length > 0 && (
					<p className="mt-3 text-xs text-white/80">
						<span className="font-semibold text-white">Tech:</span>{" "}
						{project.techStack.join(" • ")}
					</p>
				)}

				{project.tags && project.tags.length > 0 && (
					<div className="mt-3 flex flex-wrap gap-2">
						{project.tags.map((tag) => (
							<span
								key={tag}
								className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] text-white/90"
							>
								{tag}
							</span>
						))}
					</div>
				)}

				{project.links && project.links.length > 0 && (
					<div className="mt-4 flex flex-wrap gap-2">
						{project.links.map((link) => (
							<a
								key={`${project.id}-${link.label}`}
								href={link.url}
								target="_blank"
								rel="noreferrer"
								className="rounded border border-cyan-300/40 bg-cyan-300/10 px-2 py-1 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/20"
							>
								{link.label}
							</a>
						))}
					</div>
				)}
			</aside>
		</div>
	);
}
