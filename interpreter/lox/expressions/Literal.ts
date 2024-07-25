import { Expression } from "./Expression";
export class Literal extends Expression {
	private readonly value: Object;
	constructor(value: Object) {
		super();
		this.value = value;
	}
}
