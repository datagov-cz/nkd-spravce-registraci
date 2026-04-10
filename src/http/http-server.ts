import Fastify, {
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session"
import fastifyHelmet from "@fastify/helmet"
import fastifyFormBody from "@fastify/formbody";

import { logger } from "../application/logger";
import { Configuration } from "../application/configuration";
import { HttpServer } from "./http-server-type";
import {
  AuthenticationData,
  AuthenticationService,
} from "../authentication/authentication";
import { RouteService } from "../route";

export async function createHttpServer(
  configuration: Configuration,
  authentication: AuthenticationService,
  route: RouteService,
): Promise<HttpServer> {

  const server = Fastify({
    loggerInstance: logger,
    // For development.
    disableRequestLogging: configuration.development,
    // From https://www.npmjs.com/package/@fastify/session
    // If you are terminating HTTPs at the reverse proxy, you need to add
    // the trustProxy setting to your fastify instance if you want to use
    // secure cookies.
    trustProxy: true,
  });

  // Helmet - https://npmjs.com/package/@fastify/helmet
  //        - https://www.npmjs.com/package/helmet
  // server.register(fastifyHelmet, {
  //   // Use for all paths.
  //   global: true,
  // });

  // Cookies - https://www.npmjs.com/package/@fastify/cookie
  server.register(fastifyCookie);

  // x-www-form-urlencoded - https://github.com/fastify/fastify-formbody
  server.register(fastifyFormBody)

  // Sessions - https://www.npmjs.com/package/@fastify/session
  server.register(fastifySession, {
    cookieName: configuration.http.cookieName,
    secret: configuration.http.cookiesSecret,
    // We enable cookies for HTTP only in the develop mode.
    cookie: {
      secure: !configuration.development,
      // Basically a session time out in ms.
      maxAge: 60 * 60 * 1000,
    },
    // List of compatible sessions storages
    // https://github.com/expressjs/session?tab=readme-ov-file#compatible-session-stores
    // store: {
    //   set(sessionId, session, callback)
    //   get(sessionId, callback)
    //   destroy(sessionId, callback)
    // }
  });

  server.addHook("onRequest", (request, reply, next) =>
    authenticationMiddleware(authentication, request, reply, next));

  server.addHook("preHandler", (request, reply, next) =>
    initializeSessionMiddleware(request, reply, next))

  // CORS - https://www.npmjs.com/package/@fastify/cors
  await server.register(fastifyCors, {
    "origin": true,
  });

  return server;
}

declare module "fastify" {

  interface FastifyRequest {

    user: AuthenticationData;

  }

}

const HTTP_UNAUTHORIZED = 401;

function authenticationMiddleware(
  authentication: AuthenticationService,
  request: FastifyRequest,
  reply: FastifyReply,
  next: HookHandlerDoneFunction,
) {
  const data = authentication.authenticateHttp(request.headers);
  if (data === null) {
    reply.code(HTTP_UNAUTHORIZED).send();
    return;
  }
  request.user = data;
  next();
}

function initializeSessionMiddleware(
  _request: FastifyRequest,
  _reply: FastifyReply,
  next: HookHandlerDoneFunction,
) {
  // For now we do nothing here.
  next();
}

export function startServer(configuration: Configuration, server: HttpServer) {
  server.listen({
    port: configuration.http.port,
    host: configuration.http.host,
  }, (error) => {
    if (error) {
      server.log.error(error);
      process.exit(1);
    }
  });
}
