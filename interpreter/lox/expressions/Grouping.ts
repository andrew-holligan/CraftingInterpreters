import {Expression} from './Expression'
import {Visitor} from './Visitor'
export class Grouping extends Expression {
	public readonly expression: Expression;
	constructor(expression: Expression) {
		super();
		this.expression = expression;
	}
	accept<R>(visitor: Visitor<R>): R {
		return visitor.visitGroupingExpression(this);
	}
}
