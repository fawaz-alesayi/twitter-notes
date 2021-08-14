export const accountActivityRequestSchema = {
  type: "object",
  properties: {
    for_user_id: { type: "string" },
    follow_events: {
      type: "array",
      properties: {
        "^type$": { type: "string", pattern: "^follow$" },
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
} as const;
