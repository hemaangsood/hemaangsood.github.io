import { Terminal, TypingAnimation, AnimatedSpan } from "../ui/terminal";
import React from "react";
import { TerminalState } from "./types";

/* ---------------- SKILLS ---------------- */

const SkillsTerminal = React.memo(function SkillsTerminal({ className }: { className?: string }) {
	return (
		<Terminal className={`dark overflow-y-auto overflow-x-hidden ${className}`}>
			<TypingAnimation>
				hemaang@portfolio:~$ skills --stack
			</TypingAnimation>

			<AnimatedSpan>✔ Languages</AnimatedSpan>
			<AnimatedSpan> ├─ Python</AnimatedSpan>
			<AnimatedSpan> ├─ Go</AnimatedSpan>
			<AnimatedSpan> ├─ JavaScript / TypeScript</AnimatedSpan>
			<AnimatedSpan> └─ Java / Kotlin</AnimatedSpan>

			<AnimatedSpan>✔ AI / LLM</AnimatedSpan>
			<AnimatedSpan> ├─ PyTorch</AnimatedSpan>
			<AnimatedSpan> ├─ LangChain / RAG</AnimatedSpan>
			<AnimatedSpan> ├─ DSPy</AnimatedSpan>
			<AnimatedSpan> └─ vLLM / Ray Serve</AnimatedSpan>

			<AnimatedSpan>✔ Backend & APIs</AnimatedSpan>
			<AnimatedSpan> ├─ FastAPI</AnimatedSpan>
			<AnimatedSpan> ├─ Django</AnimatedSpan>
			<AnimatedSpan> ├─ Spring Boot</AnimatedSpan>
			<AnimatedSpan> └─ Node.js</AnimatedSpan>

			<AnimatedSpan>✔ Databases</AnimatedSpan>
			<AnimatedSpan> ├─ PostgreSQL</AnimatedSpan>
			<AnimatedSpan> ├─ MongoDB</AnimatedSpan>
			<AnimatedSpan> └─ Redis / Qdrant</AnimatedSpan>

			<AnimatedSpan>✔ DevOps & Cloud</AnimatedSpan>
			<AnimatedSpan> ├─ AWS (EC2)</AnimatedSpan>
			<AnimatedSpan> ├─ Docker / Nginx</AnimatedSpan>
			<AnimatedSpan> └─ Git / GitHub</AnimatedSpan>

			<TypingAnimation>
				Loaded engineering stack successfully.
			</TypingAnimation>
		</Terminal>
	);
});

/* ---------------- PROJECTS ---------------- */

const ProjectsTerminal = React.memo(function ProjectsTerminal({ className }: { className?: string }) {
	return (
		<Terminal className={`dark ${className}`}>
			<TypingAnimation>hemaang@portfolio:~$ ls projects/</TypingAnimation>

			<AnimatedSpan>📦 routed-travel-matching</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ Microservices platform for traveler matching
			</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ FastAPI + Kafka + PostgreSQL + Go workers
			</AnimatedSpan>

			<AnimatedSpan>📦 face-voice-door-lock</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ Hybrid facial + voice authentication system
			</AnimatedSpan>
			<AnimatedSpan> └─ PyTorch + OpenCV + Raspberry Pi</AnimatedSpan>

			<AnimatedSpan>📦 stock-ml-predictor</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ ML pipeline predicting market movement
			</AnimatedSpan>
			<AnimatedSpan> └─ LSTM / GRU / CNN models</AnimatedSpan>

			<AnimatedSpan>📦 encrypted-chat-app</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ AES-256 end-to-end encrypted chat system
			</AnimatedSpan>
			<AnimatedSpan> └─ MERN stack</AnimatedSpan>

			<TypingAnimation>4 repositories indexed.</TypingAnimation>
		</Terminal>
	);
});

/* ---------------- EXPERIENCE ---------------- */

const ExperienceTerminal = React.memo(function ExperienceTerminal({ className }: { className?: string }) {
	return (
		<Terminal className={`dark ${className}`}>
			<TypingAnimation>
				hemaang@portfolio:~$ experience --timeline
			</TypingAnimation>

			<AnimatedSpan>▶ ECE 699 Research — University of Waterloo</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ Multi-agent LLM optimization with DSPy + GEPA
			</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ 16-GPU MI50 cluster serving vLLM via Ray Serve
			</AnimatedSpan>

			<AnimatedSpan>▶ Jr Associate — Synechron</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ Built amusement park management system (MERN)
			</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ Developed scalable insurance backend using Spring Boot
			</AnimatedSpan>

			<AnimatedSpan>▶ Intern — Bharat Electronics Limited</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ Authentication & authorization system for DRDO intranet
			</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ LLM document analysis with RAG + Vosk voice queries
			</AnimatedSpan>

			<TypingAnimation>Query completed.</TypingAnimation>
		</Terminal>
	);
});

/* ---------------- MAIN TERMINAL ---------------- */

export default function TerminalComponent({
	state=TerminalState.skills,
	className= ""
}: {
	state: TerminalState;
	className?: string;
}): React.JSX.Element {
	return (
		<>
			{state === TerminalState.skills && <SkillsTerminal className={className} />}
			{state === TerminalState.projects && <ProjectsTerminal className={className} />}
			{state === TerminalState.experience && <ExperienceTerminal className={className} />}
		</>
	);
}
