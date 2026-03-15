import { useRef } from "react";
import "./App.css";
import AboutSection from "./components/about/About";
import Header from "./components/header/header";
import HeroSection from "./components/HeroSection/Hero";
import ProjectsSection from "./components/projects/Projects";
import ExperienceSection from "./components/Experience/Experience";
import SkillsSection from "./components/Skills/Skills";
import ContactSection from "./components/Contact/Contact";

function App() {
	const scrollRef = useRef<HTMLDivElement>(null);
	return (
		<>
			<Header
				scrollContainer={scrollRef as React.RefObject<HTMLDivElement>}
			/>
			<main
				className="h-screen overflow-y-scroll snap-y snap-mandatory overflow-x-hidden"
				ref={scrollRef}
			>
				<HeroSection />
				<AboutSection />
				<ProjectsSection />
				<ExperienceSection />
				<SkillsSection />
				<ContactSection />
			</main>
		</>
	);
}

export default App;
