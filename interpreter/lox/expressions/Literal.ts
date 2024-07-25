import {Expression} from './Expression'
import {Visitor} from './Visitor'
export class Literal extends Expression {
	public readonly value: Object;
	constructor(value: Object) {
		super();
		this.value = value;
	}
	accept<R>(visitor: Visitor<R>): R {
		return visitor.visitLiteralExpression(this);
	}
}
