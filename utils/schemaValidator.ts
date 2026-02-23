import Ajv from 'ajv';

const ajv = new Ajv();

export function validateSchema(schema: object, data: any): boolean {
  const validate = ajv.compile(schema);
  return validate(data);
}
