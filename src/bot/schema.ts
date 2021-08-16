export const accountActivityRequestSchema = {
  type: "object",
  properties: {
    for_user_id: { type: "string" },
    follow_events: {
      type: "array",
      properties: {
        "^type$": { type: "string", const: "follow" },
        created_timestamp: { type: "string" },
        target: {
          type: "object",
          properties: {
            id_str: { type: "string" },
            screen_name: { type: "string" },
            name: { type: "string" },
          },
        },
        source: {
          type: "object",
          properties: {
            id_str: { type: "string" },
            screen_name: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
  },
  required: ["for_user_id", "follow_events"],
} as const;

export const accountActivitySchema = {
  body: accountActivityRequestSchema
}
