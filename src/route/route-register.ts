import fastifyStatic from "@fastify/static";
import fastifyProxy from "@fastify/http-proxy";

import { RegistrationService } from "../registration";
import { HttpServer } from "../http";
import { RouteService } from "./route-service";
import { Configuration } from "../application";
import { handleRegistrationListGet } from "./registration-list";
import { handleRegistrationDetailGet } from "./registration-detail";
import { handleCreateRegistrationGet, handleCreateRegistrationPost } from "./create-registration";
import { handleUnauthorized } from "./unauthorized";
import { FastifyReply, FastifyRequest } from "fastify";

export function registerRoutes(
  configuration: Configuration,
  server: HttpServer,
  repository: RegistrationService,
  route: RouteService,
) {
  registerAssetsRoutes(server);

  server.route({
    method: "GET",
    url: "/",
    handler: (_, res) => {
      res.redirect(encodeURI(route.listRegistration()));
    },
  });

  server.route({
    method: "GET",
    url: route.listRegistrationInternal(),
    handler: checkRole(route, (req, res) => handleRegistrationListGet(
      repository, route, req, res)),
  });

  server.route({
    method: "GET",
    url: route.registrationDetailInternal(),
    handler: checkRole(route, (req, res) => handleRegistrationDetailGet(
      repository, route, req, res)),
  });

  server.route({
    method: "GET",
    url: route.createRegistrationInternal(),
    handler: checkRole(route, (req, res) => handleCreateRegistrationGet(
      route, req, res)),
  });

  server.route({
    method: "POST",
    url: route.createRegistrationInternal(),
    handler: checkRole(route, (req, res) => handleCreateRegistrationPost(
      repository, route, req, res)),
  });

  server.register(fastifyProxy, {
    upstream: configuration.forms.proxyUrl,
    prefix: "/formulář/",
    httpMethods: ["GET"],
    preRewrite(url) {
      // We get the forms ASCII encoded.
      return url.replace("/formul%C3%A1%C5%99/", "");
    }
  });

}

function checkRole(
  route: RouteService,
  handler: (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => void,
) {
  return (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    if (request.user.isAuthorized) {
      handler(request, reply);
    } else {
      handleUnauthorized(route, request, reply);
    }
  }
}

function registerAssetsRoutes(server: HttpServer) {
  server.register(fastifyStatic, {
    root: new URL("../../public/assets/", import.meta.url),
    prefix: "/assets/",
    decorateReply: false
  });
}
