import { Lox } from "@interpreter/lox/Lox.ts";

import "./Input.css";

function Input() {
	function handleFormSubmit(e: React.FormEvent<HTMLFormElement>): void {
		e.preventDefault();

		const form = e.currentTarget;
		const formData = new FormData(form);
		const prompt: string = formData.get("prompt")?.toString() || "";

		Lox.runPrompt(prompt);
	}

	function handlePromptInput(
		e: React.KeyboardEvent<HTMLTextAreaElement>
	): void {
		// User uses Tab
		if (e.key === "Tab") {
			e.preventDefault();

			const textarea = e.target as HTMLTextAreaElement;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const lines = textarea.value.split("\n");

			const tabbedString = tab(lines, start, end);
			textarea.value = tabbedString;
		}
	}

	function tab(lines: string[], start: number, end: number): string {
		let count: number = 0;
		let tabbedLines: string[] = [];

		for (let line of lines) {
			const startIndex: number = count;
			const endIndex: number = count + line.length;
			count = endIndex + 1;

			if (
				(startIndex >= start && startIndex <= end) ||
				(endIndex >= start && endIndex <= end) ||
				(startIndex <= start && endIndex >= end)
			) {
				tabbedLines.push(`\t${line}`);
			} else {
				tabbedLines.push(line);
			}
		}

		return tabbedLines.join("\n");
	}

	function run(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {}

	return (
		<form id="lox-form" onSubmit={handleFormSubmit}>
			{/* PANEL */}
			<div id="lox-panel">
				<button type="submit">Run</button>
			</div>

			{/* PROMPT */}
			<textarea
				id="lox-prompt"
				name="prompt"
				onKeyDown={handlePromptInput}
			></textarea>
		</form>
	);
}

export default Input;
