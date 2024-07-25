import { Expression } from "./Expression";
export class Grouping extends Expression {
	private readonly expression: Expression;
	constructor(expression: Expression) {
		super();
		this.expression = expression;
	}
}
