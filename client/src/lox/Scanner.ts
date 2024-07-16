import { Lox } from "./Lox";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Scanner {
	private static readonly keywords: Map<string, TokenType> = new Map();
	static {
		Scanner.keywords.set("and", TokenType.AND);
		Scanner.keywords.set("class", TokenType.CLASS);
		Scanner.keywords.set("else", TokenType.ELSE);
		Scanner.keywords.set("false", TokenType.FALSE);
		Scanner.keywords.set("for", TokenType.FOR);
		Scanner.keywords.set("fun", TokenType.FUN);
		Scanner.keywords.set("if", TokenType.IF);
		Scanner.keywords.set("nil", TokenType.NIL);
		Scanner.keywords.set("or", TokenType.OR);
		Scanner.keywords.set("print", TokenType.PRINT);
		Scanner.keywords.set("return", TokenType.RETURN);
		Scanner.keywords.set("super", TokenType.SUPER);
		Scanner.keywords.set("this", TokenType.THIS);
		Scanner.keywords.set("true", TokenType.TRUE);
		Scanner.keywords.set("var", TokenType.VAR);
		Scanner.keywords.set("while", TokenType.WHILE);
	}

	private readonly source: string;
	private tokens: Token[];
	private start: number = 0;
	private current: number = 0;
	private line: number = 1;

	constructor(source: string) {
		this.source = source;
		this.tokens = [];
	}

	public scanTokens(): Token[] {
		while (!this.isAtEnd()) {
			this.start = this.current;
			this.scanToken();
		}

		this.tokens.push(new Token(TokenType.EOF, "", {}, this.line));
		return this.tokens;
	}

	private isAtEnd(): boolean {
		return this.current >= this.source.length;
	}

	private scanToken(): void {
		const c: string = this.advance();

		switch (c) {
			// Single-Character Tokens
			case "(":
				this.addToken(TokenType.LEFT_PAREN);
				break;
			case ")":
				this.addToken(TokenType.RIGHT_PAREN);
				break;
			case "{":
				this.addToken(TokenType.LEFT_BRACE);
				break;
			case "}":
				this.addToken(TokenType.RIGHT_BRACE);
				break;
			case ",":
				this.addToken(TokenType.COMMA);
				break;
			case ".":
				this.addToken(TokenType.DOT);
				break;
			case "-":
				this.addToken(TokenType.MINUS);
				break;
			case "+":
				this.addToken(TokenType.PLUS);
				break;
			case ";":
				this.addToken(TokenType.SEMICOLON);
				break;
			case "*":
				this.addToken(TokenType.STAR);
				break;

			// Special Case Token
			case "/":
				// Single Line Comment
				if (this.match("/")) {
					// Comments Last the Full Line
					while (this.peek() != "\n" && !this.isAtEnd())
						this.advance();
				}
				// Multi-Line Comment
				else if (this.match("*")) {
					while (!this.isAtEnd()) {
						// Comments End With */
						if (this.advance() === "*" && this.match("/")) {
							break;
						}
					}
				} else {
					this.addToken(TokenType.SLASH);
				}
				break;

			// One or Two Character Tokens
			case "!":
				this.addToken(
					this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG
				);
				break;
			case "=":
				this.addToken(
					this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
				);
				break;
			case "<":
				this.addToken(
					this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS
				);
				break;
			case ">":
				this.addToken(
					this.match("=")
						? TokenType.GREATER_EQUAL
						: TokenType.GREATER
				);
				break;

			// Meaningless Characters
			case " ":
			case "\r":
			case "\t":
				break;

			// Line Break
			case "\n":
				this.line++;
				break;

			// String Literals
			case '"':
				this.string();
				break;

			default:
				// Number Literals
				if (this.isDigit(c)) {
					this.number();
				}
				// Reserved Words and Identifiers
				else if (this.isAlpha(c)) {
					this.identifier();
				} else {
					Lox.error(this.line, "Unexpected Character");
				}
				break;
		}
	}

	private advance(): string {
		return this.source.charAt(this.current++);
	}

	private addToken(type: TokenType): void {
		this.addTokenWithLiteral(type, {});
	}

	private addTokenWithLiteral(type: TokenType, literal: Object): void {
		const text: string = this.source.substring(this.start, this.current);

		this.tokens.push(new Token(type, text, literal, this.line));
	}

	private match(expected: string): boolean {
		if (this.isAtEnd()) return false;
		if (this.source.charAt(this.current) != expected) return false;

		this.current++;
		return true;
	}

	private peek(): string {
		if (this.isAtEnd()) return "\0";

		return this.source.charAt(this.current);
	}

	private peekNext(): string {
		if (this.current + 1 >= this.source.length) return "\0";

		return this.source.charAt(this.current + 1);
	}

	private string(): void {
		while (this.peek() != '"' && !this.isAtEnd()) {
			if (this.peek() == "\n") this.line++;
			this.advance();
		}

		if (this.isAtEnd()) {
			Lox.error(this.line, "Unterminated String.");
			return;
		}

		// The Closing "
		this.advance();

		// Trim Surrounding Quotes
		const value: string = this.source.substring(
			this.start + 1,
			this.current - 1
		);
		this.addTokenWithLiteral(TokenType.STRING, value);
	}

	private isDigit(c: string): boolean {
		return c >= "0" && c <= "9";
	}

	private number(): void {
		while (this.isDigit(this.peek())) this.advance();

		// Look for any Fractional Part
		if (this.peek() == "." && this.isDigit(this.peekNext())) {
			// Consume the "."
			this.advance();

			while (this.isDigit(this.peek())) this.advance();
		}

		this.addTokenWithLiteral(
			TokenType.NUMBER,
			parseFloat(this.source.substring(this.start, this.current))
		);
	}

	private identifier(): void {
		while (this.isAlphaNumeric(this.peek())) this.advance();

		const text: string = this.source.substring(this.start, this.current);
		const type: TokenType =
			Scanner.keywords.get(text) || TokenType.IDENTIFIER;

		this.addToken(type);
	}

	private isAlpha(c: string): boolean {
		return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
	}

	private isAlphaNumeric(c: string): boolean {
		return this.isAlpha(c) || this.isDigit(c);
	}
}
