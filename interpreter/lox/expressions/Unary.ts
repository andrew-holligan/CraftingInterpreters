import {Token} from '../Token'
import {Expression} from './Expression'
import {Visitor} from './Visitor'
export class Unary extends Expression {
	public readonly operator: Token;
	public readonly right: Expression;
	constructor(operator: Token, right: Expression) {
		super();
		this.operator = operator;
		this.right = right;
	}
	accept<R>(visitor: Visitor<R>): R {
		return visitor.visitUnaryExpression(this);
	}
}
