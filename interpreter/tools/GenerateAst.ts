const fs = require("node:fs");

export class GenerateAst {
	public static generate(outputDir: string): void {
		GenerateAst.defineAst(outputDir, "Expression", [
			"Binary		=	left: Expression, operator: Token, right: Expression",
			"Grouping	=	expression: Expression",
			"Literal	=	value: Object",
			"Unary		=	operator: Token, right: Expression",
		]);
	}

	private static defineAst(
		outputDir: string,
		baseName: string,
		types: string[]
	): void {
		// Abstract Class 'Expression'
		const path: string = `${outputDir}/${baseName}.ts`;
		fs.writeFileSync(path, ``, {
			flag: "w",
		});
		fs.writeFileSync(path, `export abstract class ${baseName} {}`, {
			flag: "a",
		});

		// AST Classes
		for (const type of types) {
			const className: string = type.split("=")[0].trim();
			const fields: string = type.split("=")[1].trim();
			GenerateAst.defineType(outputDir, baseName, className, fields);
		}
	}

	private static defineType(
		outputDir: string,
		baseName: string,
		className: string,
		fieldList: string
	): void {
		const path: string = `${outputDir}/${className}.ts`;
		const fields: string[] = fieldList.split(", ");

		fs.writeFileSync(path, ``, {
			flag: "w",
		});

		fs.writeFileSync(
			path,
			`export class ${className} extends ${baseName} {\n`,
			{
				flag: "a",
			}
		);

		// Fields
		for (const field of fields) {
			fs.writeFileSync(path, `	private readonly ${field};\n`, {
				flag: "a",
			});
		}

		// Constructor
		fs.writeFileSync(path, `	constructor(${fieldList}) {\n`, {
			flag: "a",
		});
		fs.writeFileSync(path, `		super();\n`, {
			flag: "a",
		});

		// Params In Fields
		for (const field of fields) {
			const fieldName: string = field.split(": ")[0];
			fs.writeFileSync(path, `		this.${fieldName} = ${fieldName};\n`, {
				flag: "a",
			});
		}

		fs.writeFileSync(path, `	}\n`, {
			flag: "a",
		});

		fs.writeFileSync(path, `}\n`, {
			flag: "a",
		});
	}
}

GenerateAst.generate(`${process.cwd()}/lox/expressions`);
