export const observerRequestSchema = {
  type: 'object',
  properties: {
    user: { type: 'string' },
  },
  required: ['user'],
} as const;

const observerReplySchema = {
  200: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
  },
} as const;

export const observerSchema = {
  body: observerRequestSchema,
  response: observerReplySchema,
};
