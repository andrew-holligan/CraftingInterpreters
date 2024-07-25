import {Expression} from './Expression.js'
import {Token} from '../Token.js'
import {Visitor} from './Visitor.js'
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
	accept<R>(visitor: Visitor<R>): R {
		return visitor.visitBinaryExpression(this);
	}
}
