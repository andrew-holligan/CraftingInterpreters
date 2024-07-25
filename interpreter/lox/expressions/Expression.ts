import {Visitor} from './Visitor.js'
export abstract class Expression {
	abstract accept<R>(visitor: Visitor<R>): R;
}
