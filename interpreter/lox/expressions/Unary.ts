import { Expression } from "./Expression";
import { Token } from "../Token";
export class Unary extends Expression {
	private readonly operator: Token;
	private readonly right: Expression;
	constructor(operator: Token, right: Expression) {
		super();
		this.operator = operator;
		this.right = right;
	}
}
