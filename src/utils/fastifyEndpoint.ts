/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyRequest, FastifyReply } from 'fastify';
export interface FastifyEndpoint {
  handler: (
    req: FastifyRequest<any>,
    reply: FastifyReply<any>,
  ) => Promise<void>;
  inputSchema?: any;
  outputSchema?: any;
}

export interface routeOptions {
  prefix: string;
}
