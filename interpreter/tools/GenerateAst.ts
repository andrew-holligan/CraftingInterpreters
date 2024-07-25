const fs = require("node:fs");

interface Type {
	className: string;
	fields: {
		name: string;
		type: string;
	}[];
	imports: {
		name: string;
		location: string;
	}[];
}

export class GenerateAst {
	public static generate(outputDir: string): void {
		GenerateAst.defineAst(outputDir, "Expression", [
			{
				className: "Binary",
				fields: [
					{ name: "left", type: "Expression" },
					{ name: "operator", type: "Token" },
					{ name: "right", type: "Expression" },
				],
				imports: [
					{ name: "Expression", location: "./Expression.js" },
					{ name: "Token", location: "../Token.js" },
					{ name: "Visitor", location: "./Visitor.js" },
				],
			},
			{
				className: "Grouping",
				fields: [{ name: "expression", type: "Expression" }],
				imports: [
					{ name: "Expression", location: "./Expression.js" },
					{ name: "Visitor", location: "./Visitor.js" },
				],
			},
			{
				className: "Literal",
				fields: [{ name: "value", type: "Object" }],
				imports: [
					{ name: "Expression", location: "./Expression.js" },
					{ name: "Visitor", location: "./Visitor.js" },
				],
			},
			{
				className: "Unary",
				fields: [
					{ name: "operator", type: "Token" },
					{ name: "right", type: "Expression" },
				],
				imports: [
					{ name: "Token", location: "../Token.js" },
					{ name: "Expression", location: "./Expression.js" },
					{ name: "Visitor", location: "./Visitor.js" },
				],
			},
		]);
	}

	private static defineAst(
		outputDir: string,
		baseName: string,
		types: Type[]
	): void {
		GenerateAst.defineExpression(outputDir, baseName);
		GenerateAst.defineVisitor(outputDir, baseName, types, [
			{ name: "Binary", location: "./Binary.js" },
			{ name: "Grouping", location: "./Grouping.js" },
			{ name: "Literal", location: "./Literal.js" },
			{ name: "Unary", location: "./Unary.js" },
		]);

		// AST Classes
		for (const type of types) {
			GenerateAst.defineType(
				outputDir,
				baseName,
				type.className,
				type.fields,
				type.imports
			);
		}
	}

	private static defineExpression(outputDir: string, baseName: string): void {
		const path: string = `${outputDir}/${baseName}.ts`;
		fs.writeFileSync(path, ``, {
			flag: "w",
		});

		// Imports
		fs.writeFileSync(path, `import {Visitor} from './Visitor.js'\n`, {
			flag: "a",
		});
		// Class Signature
		fs.writeFileSync(path, `export abstract class ${baseName} {\n`, {
			flag: "a",
		});
		// Abstract Method
		fs.writeFileSync(
			path,
			`	abstract accept<R>(visitor: Visitor<R>): R;\n`,
			{
				flag: "a",
			}
		);
		// Close
		fs.writeFileSync(path, `}\n`, {
			flag: "a",
		});
	}

	private static defineVisitor(
		outputDir: string,
		baseName: string,
		types: Type[],
		imports: Type["imports"]
	): void {
		const path: string = `${outputDir}/Visitor.ts`;
		fs.writeFileSync(path, ``, {
			flag: "w",
		});

		// Imports
		for (const imp of imports) {
			fs.writeFileSync(
				path,
				`import {${imp.name}} from '${imp.location}'\n`,
				{
					flag: "a",
				}
			);
		}
		// Class Signature
		fs.writeFileSync(path, `export interface Visitor<R> {\n`, {
			flag: "a",
		});
		// Interface
		for (const type of types) {
			fs.writeFileSync(
				path,
				`	visit${type.className}${baseName}(${baseName.toLowerCase()}: ${
					type.className
				}): R;\n`,
				{
					flag: "a",
				}
			);
		}
		// Close
		fs.writeFileSync(path, `}\n`, {
			flag: "a",
		});
	}

	private static defineType(
		outputDir: string,
		baseName: string,
		className: string,
		fields: Type["fields"],
		imports: Type["imports"]
	): void {
		const path: string = `${outputDir}/${className}.ts`;
		fs.writeFileSync(path, ``, {
			flag: "w",
		});

		// Imports
		for (const imp of imports) {
			fs.writeFileSync(
				path,
				`import {${imp.name}} from '${imp.location}'\n`,
				{
					flag: "a",
				}
			);
		}
		// Class Signature
		fs.writeFileSync(
			path,
			`export class ${className} extends ${baseName} {\n`,
			{
				flag: "a",
			}
		);
		// Fields
		for (const field of fields) {
			fs.writeFileSync(
				path,
				`	private readonly ${field.name}: ${field.type};\n`,
				{
					flag: "a",
				}
			);
		}
		// Constructor
		const fieldList: string = fields
			.map((field) => `${field.name}: ${field.type}`)
			.join(", ");
		fs.writeFileSync(path, `	constructor(${fieldList}) {\n`, {
			flag: "a",
		});
		fs.writeFileSync(path, `		super();\n`, {
			flag: "a",
		});
		// Params In Fields
		for (const field of fields) {
			fs.writeFileSync(path, `		this.${field.name} = ${field.name};\n`, {
				flag: "a",
			});
		}
		fs.writeFileSync(path, `	}\n`, {
			flag: "a",
		});
		// Visitor Pattern
		fs.writeFileSync(path, `	accept<R>(visitor: Visitor<R>): R {\n`, {
			flag: "a",
		});
		fs.writeFileSync(
			path,
			`		return visitor.visit${className}${baseName}(this);\n`,
			{
				flag: "a",
			}
		);
		fs.writeFileSync(path, `	}\n`, {
			flag: "a",
		});
		// Close
		fs.writeFileSync(path, `}\n`, {
			flag: "a",
		});
	}
}

GenerateAst.generate(`${process.cwd()}/lox/expressions`);
