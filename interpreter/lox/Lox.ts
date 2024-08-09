import { AstPrinter } from "./AstPrinter";
import { Expression } from "./expressions/Expression";
import { Parser } from "./Parser";
import { Scanner } from "./Scanner";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Lox {
	private static hadError: boolean = false;

	// public static main(): void {}
	// private static runFile(path: string): void {}

	public static runPrompt(prompt: string): void {
		Lox.run(prompt);

		// const lines: string[] = prompt.split("\n");

		// for (const line of lines) {
		// 	Lox.run(`${line}\n`);
		// 	// Lox.hadError = false;
		// // }

		// let i = 0;
		// while (!Lox.hadError && i < lines.length) {
		// 	Lox.run(lines[i]);
		// }
	}

	private static run(source: string): void {
		const scanner = new Scanner(source);
		const tokens = scanner.scanTokens();

		const parser: Parser = new Parser(tokens);
		const expression: Expression | null = parser.parse();

		if (this.hadError) return;

		console.log(new AstPrinter().print(<Expression>expression));
	}

	public static error(line: number, message: string): void {
		Lox.report(line, "", message);
	}

	private static report(line: number, where: string, message: string) {
		console.error(`[line ${line}] Error ${where}: ${message}`);
		Lox.hadError = true;
	}

	public static errorWithToken(token: Token, message: string): void {
		if (token.type === TokenType.EOF) {
			Lox.report(token.line, "at end", message);
			return;
		}

		Lox.report(token.line, `at '${token.lexeme}'`, message);
	}
}
