import Fastify, {
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session"
import fastifyHelmet from "@fastify/helmet"
import fastifyMultipart from "@fastify/multipart";

import { logger } from "../application/logger";
import { Configuration } from "../application/configuration";
import { HttpServer } from "./http-server-type";
import { AuthenticationData, HttpAuthentication } from "./http-authentication";

export async function createHttpServer(
  configuration: Configuration,
  authentication: HttpAuthentication,
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
  server.register(fastifyHelmet, {
    // Use for all paths.
    global: true,
  });

  // Multipart - https://github.com/fastify/fastify-multipart
  server.register(fastifyMultipart);

  // Cookies - https://www.npmjs.com/package/@fastify/cookie
  server.register(fastifyCookie);

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
    mockedAuthenticationMiddleware(
      configuration, authentication, request, reply, next));

  server.addHook("preHandler", (_request, _reply, next) => {
    initializeSession();
    next();
  })

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

function authenticationMiddleware(
  configuration: Configuration,
  authentication: HttpAuthentication,
  request: FastifyRequest,
  reply: FastifyReply,
  next: HookHandlerDoneFunction,
) {
  const url = configuration.http.baseUrl + request.originalUrl;
  const header = request.headers[authentication.httpHeaderName()];
  const data = authentication.createFromHeader(header);
  if (data === null) {
    reply.redirect("/caais/login?redirect-url=" + encodeURIComponent(url));
    return;
  }
  request.user = data;
  next();
}

function mockedAuthenticationMiddleware(
  _configuration: Configuration,
  _authentication: HttpAuthentication,
  request: FastifyRequest,
  _reply: FastifyReply,
  next: HookHandlerDoneFunction,
) {
  request.user = {
    login: "petr_skoda",
    givenName: "Petr",
    familyName: "Škoda",
    isEditor: true,
    entity: {
      identifier: "70890692",
      name: "Moravskoslezský kraj",
    }
  } as AuthenticationData;
  next();
}

function initializeSession() {
  // For now we do nothing here.
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
