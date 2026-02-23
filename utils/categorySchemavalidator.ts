import Ajv from "ajv";

const ajv = new Ajv();

export function validateCategorySchema(schema: object, data: any) {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    console.error(validate.errors);
    throw new Error(
      "Schema validation failed: " +
      JSON.stringify(validate.errors, null, 2)
    );
  }
}
