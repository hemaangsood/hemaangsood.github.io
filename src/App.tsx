import "./App.css";
import Header from "./components/header/header";

function App() {
	return (
		<>
			<Header />
			<div className="flex w-full h-screen">
				<div className="m-auto">
					<h1>Section 1</h1>
				</div>
			</div>
			<div className="flex w-full h-screen">
				<div className="m-auto">
					<h1>Section 2</h1>
				</div>
			</div>
		</>
	);
}

export default App;
