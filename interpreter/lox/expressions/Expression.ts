import {Visitor} from './Visitor'
export abstract class Expression {
	abstract accept<R>(visitor: Visitor<R>): R;
}
