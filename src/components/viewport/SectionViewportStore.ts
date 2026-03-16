import { createContext } from "react";

export type SectionViewportContextValue = {
	activeSection: string | null;
	sectionRatios: Record<string, number>;
	seenSections: Record<string, boolean>;
};

export const SectionViewportContext =
	createContext<SectionViewportContextValue | null>(null);
