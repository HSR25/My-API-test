export const loginSchema = {
  type: 'object',
  required: ['access_token'],
  properties: {
    access_token: { type: 'string' },
    refresh_token: { type: 'string' }
  }
};
