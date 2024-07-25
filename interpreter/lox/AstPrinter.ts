import { Binary } from "./expressions/Binary";
import { Grouping } from "./expressions/Grouping";
import { Literal } from "./expressions/Literal";
import { Unary } from "./expressions/Unary";
import { Expression } from "./expressions/Expression";
import { Visitor } from "./expressions/Visitor";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class AstPrinter implements Visitor<string> {
	public print(expression: Expression): string {
		return expression.accept(this);
	}

	public visitBinaryExpression(expression: Binary): string {
		return this.parenthesize(expression.operator.lexeme, [
			expression.left,
			expression.right,
		]);
	}

	public visitGroupingExpression(expression: Grouping): string {
		return this.parenthesize("group", [expression.expression]);
	}

	public visitLiteralExpression(expression: Literal): string {
		if (expression.value === null) return "nil";
		return expression.value.toString();
	}

	public visitUnaryExpression(expression: Unary): string {
		return this.parenthesize(expression.operator.lexeme, [
			expression.right,
		]);
	}

	private parenthesize(name: string, expressions: Expression[]): string {
		const expressionsString: string = expressions
			.map((expression) => expression.accept(this))
			.join(" ");
		return `(${name} ${expressionsString})`;
	}
}

// TESTING
const expression: Expression = new Binary(
	new Unary(new Token(TokenType.MINUS, "-", {}, 1), new Literal(123)),
	new Token(TokenType.STAR, "*", {}, 1),
	new Grouping(new Literal(45.67))
);

console.log(new AstPrinter().print(expression));
