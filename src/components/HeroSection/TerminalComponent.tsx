import { Terminal, TypingAnimation, AnimatedSpan } from "../ui/terminal";
import { TerminalState } from "./types";

/* ---------------- SKILLS ---------------- */

function SkillsTerminal() {
	return (
		<Terminal className="dark overflow-y-auto overflow-x-hidden">
			<TypingAnimation>
				hemaang@portfolio:~$ skills --stack
			</TypingAnimation>

			<AnimatedSpan>✔ Languages</AnimatedSpan>
			<AnimatedSpan> ├─ Python</AnimatedSpan>
			<AnimatedSpan> ├─ Go</AnimatedSpan>
			<AnimatedSpan> ├─ JavaScript / TypeScript</AnimatedSpan>
			<AnimatedSpan> └─ Java</AnimatedSpan>

			<AnimatedSpan>✔ Backend & APIs</AnimatedSpan>
			<AnimatedSpan> ├─ FastAPI</AnimatedSpan>
			<AnimatedSpan> ├─ Django</AnimatedSpan>
			<AnimatedSpan> ├─ Spring Boot</AnimatedSpan>
			<AnimatedSpan> └─ Node.js</AnimatedSpan>

			<AnimatedSpan>✔ Databases</AnimatedSpan>
			<AnimatedSpan> ├─ PostgreSQL</AnimatedSpan>
			<AnimatedSpan> ├─ MongoDB</AnimatedSpan>
			<AnimatedSpan> ├─ Redis</AnimatedSpan>
			<AnimatedSpan> └─ FAISS / Qdrant</AnimatedSpan>

			<AnimatedSpan>✔ DevOps & Cloud</AnimatedSpan>
			<AnimatedSpan> ├─ AWS (EC2, S3)</AnimatedSpan>
			<AnimatedSpan> ├─ Docker</AnimatedSpan>
			<AnimatedSpan> ├─ Git / GitHub</AnimatedSpan>
			<AnimatedSpan> └─ GitLab CI/CD</AnimatedSpan>

			<TypingAnimation>
				Loaded engineering stack successfully.
			</TypingAnimation>
		</Terminal>
	);
}

/* ---------------- PROJECTS ---------------- */

function ProjectsTerminal() {
	return (
		<Terminal className="dark">
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
}

/* ---------------- EXPERIENCE ---------------- */

function ExperienceTerminal() {
	return (
		<Terminal className="dark">
			<TypingAnimation>
				hemaang@portfolio:~$ experience --timeline
			</TypingAnimation>

			<AnimatedSpan>▶ Software Engineer — Synechron</AnimatedSpan>
			<AnimatedSpan> └─ Java full stack + AWS training</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ Built amusement park management system (MERN)
			</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ Developed scalable insurance backend using Spring Boot
			</AnimatedSpan>

			<AnimatedSpan>▶ Research / Development Intern — BEL</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ Authentication & authorization system for DRDO intranet
			</AnimatedSpan>
			<AnimatedSpan>
				{" "}
				└─ LLM document analysis interface with RAG
			</AnimatedSpan>
			<AnimatedSpan> └─ Voice query pipeline using Vosk</AnimatedSpan>

			<TypingAnimation>Query completed.</TypingAnimation>
		</Terminal>
	);
}

/* ---------------- MAIN TERMINAL ---------------- */

export default function TerminalComponent({
	state=TerminalState.skills,
}: {
	state: TerminalState;
}): React.JSX.Element {
	return (
		<>
			{state.valueOf() === TerminalState.skills && <SkillsTerminal />}
			{state.valueOf() === TerminalState.projects && <ProjectsTerminal />}
			{state.valueOf() === TerminalState.experience && <ExperienceTerminal />}
		</>
	);
}
