import {Binary} from './Binary'
import {Grouping} from './Grouping'
import {Literal} from './Literal'
import {Unary} from './Unary'
export interface Visitor<R> {
	visitBinaryExpression(expression: Binary): R;
	visitGroupingExpression(expression: Grouping): R;
	visitLiteralExpression(expression: Literal): R;
	visitUnaryExpression(expression: Unary): R;
}
