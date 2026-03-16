import Fastify, {
  type FastifyRequest,
} from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session"
import fastifyHelmet from "@fastify/helmet"

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

  server.addHook("onRequest", (request, reply, next) => {
    const url = configuration.http.baseUrl + request.originalUrl;
    const header = request.headers[authentication.httpHeaderName()];
    const data = authentication.createFromHeader(header);
    if (data === null) {
      reply.redirect("/caais/login?redirect-url=" + encodeURIComponent(url));
      return;
    }
    request.user = data;
    next();
  });

  // Initialize session object.
  server.addHook("preHandler", (request, _reply, next) => {
    console.log("preHandler");
    initializeSession(request);
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

/**
 * This method is called for every request.
 */
function initializeSession(request: FastifyRequest) {
  request.session.authenticated = false;
}

export function startServer(configuration: Configuration, server: HttpServer) {
  server.listen({
    port: configuration.http.port,
    // TODO : Do not use port for now due to a proxy issues.
    // host: configuration.http.host,
  }, function (error) {
    if (error) {
      server.log.error(error);
      process.exit(1);
    }
  });
}
