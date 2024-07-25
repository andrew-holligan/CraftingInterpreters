import {Expression} from './Expression.js'
import {Visitor} from './Visitor.js'
export class Literal extends Expression {
	private readonly value: Object;
	constructor(value: Object) {
		super();
		this.value = value;
	}
	accept<R>(visitor: Visitor<R>): R {
		return visitor.visitLiteralExpression(this);
	}
}
