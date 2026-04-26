import { useEffect, useRef, useState } from "react";
import { SectionViewportContext } from "./SectionViewportStore";

const ACTIVE_SECTION_DEBOUNCE_MS = 140;
const ACTIVE_SECTION_HYSTERESIS_DELTA = 0.1;
const PRELOAD_ROOT_MARGIN = "30% 0px";

type SectionViewportProviderProps = {
	children: React.ReactNode;
	rootRef: React.RefObject<HTMLElement | null>;
	sectionIds: string[];
};

export function SectionViewportProvider({
	children,
	rootRef,
	sectionIds,
}: SectionViewportProviderProps) {
	const [sectionRatios, setSectionRatios] = useState<Record<string, number>>({});
	const [seenSections, setSeenSections] = useState<Record<string, boolean>>({});
	const [activeSection, setActiveSection] = useState<string | null>(null);
	const activeSectionRef = useRef<string | null>(null);
	const switchTimerRef = useRef<number | null>(null);

	useEffect(() => {
		let frameId = 0;
		let observer: IntersectionObserver | null = null;
		let preloadObserver: IntersectionObserver | null = null;

		const setupObservers = () => {
			const root = rootRef.current;
			if (!root || sectionIds.length === 0) {
				frameId = window.requestAnimationFrame(setupObservers);
				return;
			}

			const sections = sectionIds
				.map((id) => document.getElementById(id))
				.filter((el): el is HTMLElement => Boolean(el));

			if (sections.length === 0) {
				frameId = window.requestAnimationFrame(setupObservers);
				return;
			}

			const syncViewportStateFromLayout = () => {
			const rootRect = root.getBoundingClientRect();
			const nextRatios: Record<string, number> = {};
			const currentlyVisibleSections: Record<string, boolean> = {};
			let bestId: string | null = null;
			let bestRatio = 0;

			for (const section of sections) {
				const rect = section.getBoundingClientRect();
				const overlapTop = Math.max(rect.top, rootRect.top);
				const overlapBottom = Math.min(rect.bottom, rootRect.bottom);
				const overlapHeight = Math.max(0, overlapBottom - overlapTop);
				const ratio =
					rect.height > 0 ? Math.min(1, overlapHeight / rect.height) : 0;

				nextRatios[section.id] = ratio;
				currentlyVisibleSections[section.id] = ratio > 0;

				if (ratio > bestRatio) {
					bestRatio = ratio;
					bestId = section.id;
				}
			}

			setSectionRatios(nextRatios);
			setSeenSections((prevSeen) => {
				const nextSeen = { ...prevSeen };
				let changed = false;

				for (const id of sectionIds) {
					if (currentlyVisibleSections[id] && !nextSeen[id]) {
						nextSeen[id] = true;
						changed = true;
					}
				}

				return changed ? nextSeen : prevSeen;
			});

			const nextActiveSection = bestRatio > 0 ? bestId : null;
			activeSectionRef.current = nextActiveSection;
			setActiveSection(nextActiveSection);
		};

			observer = new IntersectionObserver(
			(entries) => {
				setSectionRatios((prev) => {
					const next = { ...prev };
					let hasNewSeenSection = false;

					for (const entry of entries) {
						const id = (entry.target as HTMLElement).id;
						next[id] = entry.isIntersecting ? entry.intersectionRatio : 0;
						if (entry.isIntersecting) {
							hasNewSeenSection = true;
						}
					}

					if (hasNewSeenSection) {
						setSeenSections((prevSeen) => {
							let changed = false;
							const nextSeen = { ...prevSeen };

							for (const id of sectionIds) {
								if ((next[id] ?? 0) > 0 && !nextSeen[id]) {
									nextSeen[id] = true;
									changed = true;
								}
							}

							return changed ? nextSeen : prevSeen;
						});
					}

					let bestId: string | null = null;
					let bestRatio = 0;

					for (const id of sectionIds) {
						const ratio = next[id] ?? 0;
						if (ratio > bestRatio) {
							bestRatio = ratio;
							bestId = id;
						}
					}

					const bestSection = bestRatio > 0 ? bestId : null;

					const currentActive = activeSectionRef.current;

					if (!bestSection) {
						activeSectionRef.current = null;
						if (switchTimerRef.current !== null) {
							window.clearTimeout(switchTimerRef.current);
							switchTimerRef.current = null;
						}
						setActiveSection(null);
						return next;
					}

					if (!currentActive) {
						activeSectionRef.current = bestSection;
						setActiveSection(bestSection);
						return next;
					}

					if (bestSection === currentActive) {
						return next;
					}

					const currentRatio = next[currentActive] ?? 0;
					const candidateRatio = next[bestSection] ?? 0;

					if (
						candidateRatio <
						currentRatio + ACTIVE_SECTION_HYSTERESIS_DELTA
					) {
						return next;
					}

					if (switchTimerRef.current !== null) {
						window.clearTimeout(switchTimerRef.current);
					}

					switchTimerRef.current = window.setTimeout(() => {
						activeSectionRef.current = bestSection;
						setActiveSection(bestSection);
						switchTimerRef.current = null;
					}, ACTIVE_SECTION_DEBOUNCE_MS);

					return next;
				});
			},
			{
				root,
				rootMargin: "0px",
				threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
			},
		);

			preloadObserver = new IntersectionObserver(
			(entries) => {
				const preloadedIds: string[] = [];

				for (const entry of entries) {
					if (entry.isIntersecting) {
						preloadedIds.push((entry.target as HTMLElement).id);
					}
				}

				if (preloadedIds.length === 0) {
					return;
				}

				setSeenSections((prevSeen) => {
					let changed = false;
					const nextSeen = { ...prevSeen };

					for (const id of preloadedIds) {
						if (!nextSeen[id]) {
							nextSeen[id] = true;
							changed = true;
						}
					}

					return changed ? nextSeen : prevSeen;
				});
			},
			{
				root,
				rootMargin: PRELOAD_ROOT_MARGIN,
				threshold: 0.01,
			},
		);

			for (const section of sections) {
				observer.observe(section);
				preloadObserver.observe(section);
			}

			syncViewportStateFromLayout();
			frameId = window.requestAnimationFrame(syncViewportStateFromLayout);
		};

		setupObservers();

		return () => {
			window.cancelAnimationFrame(frameId);
			if (switchTimerRef.current !== null) {
				window.clearTimeout(switchTimerRef.current);
				switchTimerRef.current = null;
			}
			observer?.disconnect();
			preloadObserver?.disconnect();
		};
	}, [rootRef, sectionIds]);

	return (
		<SectionViewportContext.Provider
			value={{ activeSection, sectionRatios, seenSections }}
		>
			{children}
		</SectionViewportContext.Provider>
	);
}
