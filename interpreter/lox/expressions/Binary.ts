import { Expression } from "./Expression";
import { Token } from "../Token";
export class Binary extends Expression {
	private readonly left: Expression;
	private readonly operator: Token;
	private readonly right: Expression;
	constructor(left: Expression, operator: Token, right: Expression) {
		super();
		this.left = left;
		this.operator = operator;
		this.right = right;
	}
}
