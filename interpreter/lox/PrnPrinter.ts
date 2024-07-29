import { Binary } from "./expressions/Binary";
import { Grouping } from "./expressions/Grouping";
import { Literal } from "./expressions/Literal";
import { Unary } from "./expressions/Unary";
import { Expression } from "./expressions/Expression";
import { Visitor } from "./expressions/Visitor";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class PrnPrinter implements Visitor<string> {
	public print(expression: Expression): string {
		return expression.accept(this);
	}

	public visitBinaryExpression(expression: Binary): string {
		return this.prn(expression.operator.lexeme, [
			expression.left,
			expression.right,
		]);
	}

	public visitGroupingExpression(expression: Grouping): string {
		return this.prn("", [expression.expression]);
	}

	public visitLiteralExpression(expression: Literal): string {
		if (expression.value === null) return "nil";
		return expression.value.toString();
	}

	public visitUnaryExpression(expression: Unary): string {
		return this.prn(expression.operator.lexeme, [expression.right]);
	}

	private prn(name: string, expressions: Expression[]): string {
		const expressionsString: string = expressions
			.map((expression) => expression.accept(this))
			.join(" ");
		return name ? `${expressionsString} ${name}` : `${expressionsString}`;
	}
}

// TESTING
const expression1: Expression = new Binary(
	new Unary(new Token(TokenType.MINUS, "-", {}, 1), new Literal(123)),
	new Token(TokenType.STAR, "*", {}, 1),
	new Grouping(new Literal(45.67))
);

console.log(new PrnPrinter().print(expression1));

const expression2: Expression = new Binary(
	new Grouping(
		new Binary(
			new Literal(1),
			new Token(TokenType.PLUS, "+", {}, 1),
			new Literal(2)
		)
	),
	new Token(TokenType.STAR, "*", {}, 1),
	new Grouping(
		new Binary(
			new Literal(4),
			new Token(TokenType.MINUS, "-", {}, 1),
			new Literal(3)
		)
	)
);

console.log(new PrnPrinter().print(expression2));
