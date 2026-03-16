import { useContext } from "react";
import { SectionViewportContext } from "./SectionViewportStore";

export function useSectionViewport() {
	const context = useContext(SectionViewportContext);
	if (!context) {
		throw new Error(
			"useSectionViewport must be used inside SectionViewportProvider",
		);
	}

	return context;
}

export function useIsSectionInViewport(
	sectionId: string,
	fallback = false,
	threshold = 0.1,
) {
	const { sectionRatios } = useSectionViewport();
	const ratio = sectionRatios[sectionId];

	if (ratio === undefined) {
		return fallback;
	}

	return ratio >= threshold;
}

export function useSectionHasBeenInViewport(
	sectionId: string,
	fallback = false,
) {
	const { seenSections } = useSectionViewport();

	if (seenSections[sectionId] === undefined) {
		return fallback;
	}

	return seenSections[sectionId];
}
