import {Binary} from './Binary.js'
import {Grouping} from './Grouping.js'
import {Literal} from './Literal.js'
import {Unary} from './Unary.js'
export interface Visitor<R> {
	visitBinaryExpression(expression: Binary): R;
	visitGroupingExpression(expression: Grouping): R;
	visitLiteralExpression(expression: Literal): R;
	visitUnaryExpression(expression: Unary): R;
}
