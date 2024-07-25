import {Token} from '../Token.js'
import {Expression} from './Expression.js'
import {Visitor} from './Visitor.js'
export class Unary extends Expression {
	private readonly operator: Token;
	private readonly right: Expression;
	constructor(operator: Token, right: Expression) {
		super();
		this.operator = operator;
		this.right = right;
	}
	accept<R>(visitor: Visitor<R>): R {
		return visitor.visitUnaryExpression(this);
	}
}
