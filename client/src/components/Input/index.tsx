import "./Input.css";

function Input() {
	return (
		<form id="lox-form">
			{/* PANEL */}
			<div id="lox-panel">
				<button>Run</button>
			</div>

			{/* CODEINPUT */}
			<textarea id="lox-codeinput"></textarea>
		</form>
	);
}

export default Input;
