import {Expression} from './Expression'
import {Token} from '../Token'
import {Visitor} from './Visitor'
export class Binary extends Expression {
	public readonly left: Expression;
	public readonly operator: Token;
	public readonly right: Expression;
	constructor(left: Expression, operator: Token, right: Expression) {
		super();
		this.left = left;
		this.operator = operator;
		this.right = right;
	}
	accept<R>(visitor: Visitor<R>): R {
		return visitor.visitBinaryExpression(this);
	}
}
