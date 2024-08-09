import { Lox } from "./Lox";
import { Binary } from "./expressions/Binary";
import { Expression } from "./expressions/Expression";
import { Grouping } from "./expressions/Grouping";
import { Literal } from "./expressions/Literal";
import { Unary } from "./expressions/Unary";
import { Token } from "./Token";
import { TokenType } from "./TokenType";
import { ParseError } from "./ParseError";

/**
 *  Consumes a flat input sequence of tokens.
 */
export class Parser {
	/**
	 *  Stored list of tokens.
	 */
	private readonly tokens: Token[];
	/**
	 *  Points to the next token to be parsed.
	 *  Initialised to 0 upon instantiation.
	 */
	private current: number;

	/**
	 * Constructor for {@link Parser}
	 * @param tokens Flat input sequence of tokens.
	 */
	constructor(tokens: Token[]) {
		this.tokens = tokens;
		this.current = 0;
	}

	/**
	 * Entry method. Runs parser.
	 * @returns Parsed Expression if no error else null
	 */
	public parse(): Expression | null {
		try {
			return this.expression();
		} catch (error: any) {
			return null;
		}
	}

	// GRAMMER RULES

	/**
	 * Parses the 'expression' grammer rule, 1st level precendance.
	 *
	 * expression -> equality
	 * @returns Syntax tree produced from the grammer rule.
	 */
	private expression(): Expression {
		return this.equality();
	}

	/**
	 * Parses the 'equality' grammer rule, 2nd level precedance.
	 *
	 * equality -> comparison ( ("!=" | "==") comparison )*
	 * @returns Syntax tree produced from the grammer rule.
	 */
	private equality(): Expression {
		// The first comparison nonterminal.
		let expression: Expression = this.comparison();

		// The (...)* loop which checks for a BANG_EQUAL or EQUAL_EQUAL token.
		while (this.match([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
			const operator: Token = this.previous();
			const right: Expression = this.comparison();

			expression = new Binary(expression, operator, right);
		}

		return expression;
	}

	/**
	 * Parses the 'comparison' grammer rule, 3rd level precedance.
	 *
	 * comparison → term ( ( ">" | ">=" | "<" | "<=" ) term )*
	 * @returns Syntax tree produced from the grammer rule.
	 */
	private comparison(): Expression {
		// The first term nonterminal.
		let expression: Expression = this.term();

		// The (...)* loop which checks for a GREATER, GREATER_EQUAL, LESS or LESS_EQUAL token.
		while (
			this.match([
				TokenType.GREATER,
				TokenType.GREATER_EQUAL,
				TokenType.LESS,
				TokenType.LESS_EQUAL,
			])
		) {
			const operator: Token = this.previous();
			const right: Expression = this.term();

			expression = new Binary(expression, operator, right);
		}

		return expression;
	}

	/**
	 * Parses the 'term' grammer rule, 4th level precedance.
	 *
	 * term → factor ( ( "-" | "+" ) factor )*
	 * @returns Syntax tree produced from the grammer rule.
	 */
	private term(): Expression {
		// The first factor nonterminal.
		let expression: Expression = this.factor();

		// The (...)* loop which checks for a MINUS or PLUS token.
		while (this.match([TokenType.MINUS, TokenType.PLUS])) {
			const operator: Token = this.previous();
			const right: Expression = this.factor();

			expression = new Binary(expression, operator, right);
		}

		return expression;
	}

	/**
	 * Parses the 'factor' grammer rule, 5th level precedance.
	 *
	 * factor → unary ( ( "/" | "*" ) unary )*
	 * @returns Syntax tree produced from the grammer rule.
	 */
	private factor(): Expression {
		// The first unary nonterminal.
		let expression: Expression = this.unary();

		// The (...)* loop which checks for a SLASH or STAR token.
		while (this.match([TokenType.SLASH, TokenType.STAR])) {
			const operator: Token = this.previous();
			const right: Expression = this.unary();

			expression = new Binary(expression, operator, right);
		}

		return expression;
	}

	/**
	 * Parses the 'unary' grammer rule, 6th level precedance.
	 *
	 * unary → ( "!" | "-" ) unary | primary
	 * @returns Syntax tree produced from the grammer rule.
	 */
	private unary(): Expression {
		// Check for the BANG or MINUS token.
		if (this.match([TokenType.BANG, TokenType.MINUS])) {
			const operator: Token = this.previous();
			const right: Expression = this.unary();

			// Parse the operand.
			return new Unary(operator, right);
		}

		// Else must be primary.
		return this.primary();
	}

	/**
	 * Parses the 'primary' grammer rule, 7th level precedance.
	 *
	 * primary → NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")"
	 * @returns Syntax tree produced from the grammer rule.
	 */
	private primary(): Expression {
		// Deal with the single terminals.
		if (this.match([TokenType.FALSE])) return new Literal(false);
		if (this.match([TokenType.TRUE])) return new Literal(true);
		if (this.match([TokenType.NIL])) return new Literal({});
		if (this.match([TokenType.NUMBER, TokenType.STRING]))
			return new Literal(this.previous().literal);

		// After we match an opening '(' and parse the expression inside we MUST find a ')' token.
		if (this.match([TokenType.LEFT_PAREN])) {
			const expression: Expression = this.expression();

			this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
			return new Grouping(expression);
		}

		throw this.error(this.peek(), "Expect expression.");
	}

	// ERROR HANDLING

	/**
	 * Error method. Checks if next token is given type after parsing the expression. If not then throw error.
	 * @param type Type that the next token should be.
	 * @param message Error message if the next token is not the giving type.
	 * @returns Next token if no error else throws error.
	 */
	private consume(type: TokenType, message: string): Token {
		if (this.check(type)) return this.advance();

		throw this.error(this.peek(), message);
	}

	/**
	 * Error method. Handles a parse error.
	 * @param token Error token
	 * @param message Error message
	 * @returns ParseError
	 */
	private error(token: Token, message: string): ParseError {
		Lox.errorWithToken(token, message);
		return new ParseError();
	}

	/**
	 * Error method. Discards tokens up to next statement.
	 * @returns
	 */
	private synchronize(): void {
		this.advance();

		while (!this.isAtEnd()) {
			// Semi colon => end of statement
			if (this.previous().type === TokenType.SEMICOLON) return;

			// Keywords => start of statement
			switch (this.peek().type) {
				case TokenType.CLASS:
				case TokenType.FUN:
				case TokenType.VAR:
				case TokenType.FOR:
				case TokenType.IF:
				case TokenType.WHILE:
				case TokenType.PRINT:
				case TokenType.RETURN:
					return;
			}

			this.advance();
		}
	}

	// HELPERS

	/**
	 * Helper method. Checks if current token matches any of given types.
	 * NOTE - If a match is found then {@link current} is incremented.
	 * @param types Types to match with current token.
	 * @returns True if there were any matches else false.
	 */
	private match(types: TokenType[]): boolean {
		for (const type of types) {
			if (this.check(type)) {
				this.advance();
				return true;
			}
		}

		return false;
	}

	/**
	 * Helper method. Checks if token beyond {@link current} matches given type.
	 * NOTE - If at the end of the list of tokens then returns false.
	 * @param type True if next token matches given type else false.
	 * @returns
	 */
	private check(type: TokenType): boolean {
		if (this.isAtEnd()) return false;
		return this.peek().type === type;
	}

	/**
	 * Helper method. Consumes current token and returns it.
	 * @returns Consumed token.
	 */
	private advance(): Token {
		if (!this.isAtEnd()) {
			this.current++;
		}
		return this.previous();
	}

	/**
	 * Helper method. Checks if token beyond {@link current} is EOF.
	 * @returns True if next token is EOF else false.
	 */
	private isAtEnd(): boolean {
		return this.peek().type === TokenType.EOF;
	}

	/**
	 * Helper method. Gets {@link current} token.
	 * @returns Current token.
	 */
	private peek(): Token {
		return <Token>this.tokens[this.current];
	}

	/**
	 * Helper method. Get token before {@link current}.
	 * @returns Previous token.
	 */
	private previous(): Token {
		return <Token>this.tokens[this.current - 1];
	}
}
