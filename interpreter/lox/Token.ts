import { TokenType } from "./TokenType";

export class Token {
	readonly type: TokenType;
	readonly lexeme: string;
	readonly literal: Object;
	readonly line: number;

	constructor(
		type: TokenType,
		lexeme: string,
		literal: Object,
		line: number
	) {
		this.type = type;
		this.lexeme = lexeme;
		this.literal = literal;
		this.line = line;
	}

	public toString(): string {
		return `${this.type} ${this.lexeme} ${this.literal}`;
	}
}
