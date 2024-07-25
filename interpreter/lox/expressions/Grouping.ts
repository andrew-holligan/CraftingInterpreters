import {Expression} from './Expression.js'
import {Visitor} from './Visitor.js'
export class Grouping extends Expression {
	private readonly expression: Expression;
	constructor(expression: Expression) {
		super();
		this.expression = expression;
	}
	accept<R>(visitor: Visitor<R>): R {
		return visitor.visitGroupingExpression(this);
	}
}
