export const profileSchema = {
  type: 'object',
  required: ['id', 'email', 'name', 'role', 'avatar'],
  properties: {
    id: { type: 'number' },
    email: { type: 'string' },
    name: { type: 'string' },
    role: { type: 'string' },
    avatar: { type: 'string' }
  }
};
