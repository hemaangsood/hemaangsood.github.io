import { useRef } from "react";
import "./App.css";
import AboutSection from "./components/about/About";
import Header from "./components/header/header";
import HeroSection from "./components/HeroSection/hero";
import ProjectsSection from "./components/projects/Projects";
import ExperienceSection from "./components/Experience/Experience";
import SkillsSection from "./components/Skills/Skills";
import ContactSection from "./components/Contact/Contact";
import { SectionViewportProvider } from "./components/viewport/SectionViewportContext";

function App() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const sectionIds = [
		"hero",
		"about",
		"skills",
		"projects",
		"experience",
		"contact",
	];
	return (
		<SectionViewportProvider
			rootRef={scrollRef}
			sectionIds={sectionIds}
		>
			<Header
				scrollContainer={scrollRef as React.RefObject<HTMLDivElement>}
			/>
			<main
				className="h-screen overflow-y-scroll snap-y snap-mandatory overflow-x-hidden"
				ref={scrollRef}
			>
				<HeroSection />
				<AboutSection />
				<SkillsSection />
				<ProjectsSection />
				<ExperienceSection />
				<ContactSection />
			</main>
		</SectionViewportProvider>
	);
}

export default App;
