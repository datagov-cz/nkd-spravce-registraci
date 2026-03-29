import fastifyStatic from "@fastify/static";
import fastifyProxy from "@fastify/http-proxy";

import { RegistrationService } from "../registration";
import { HttpServer } from "../http";
import { RouteService } from "./route-service";
import { Configuration } from "../application";
import { handleRegistrationListGet } from "./registration-list";
import { handleRegistrationDetailGet } from "./registration-detail";
import { handleCreateRegistrationGet, handleCreateRegistrationPost } from "./create-registration";

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
      // Redirect.
      res.redirect(encodeURI(route.listRegistration()));
    },
  });

  server.route({
    method: "GET",
    url: route.listRegistrationInternal(),
    handler: (req, res) => handleRegistrationListGet(
      repository, route, req, res),
  });

  server.route({
    method: "GET",
    url: route.registrationDetailInternal(),
    handler: (req, res) => handleRegistrationDetailGet(
      repository, route, req, res),
  });

  server.route({
    method: "GET",
    url: route.createRegistrationInternal(),
    handler: (req, res) => handleCreateRegistrationGet(route, req, res),
  });

  server.route({
    method: "POST",
    url: route.createRegistrationInternal(),
    handler: (req, res) => handleCreateRegistrationPost(
      repository, route, req, res),
  });

  server.register(fastifyProxy, {
    upstream: configuration.forms.proxyUrl,
    prefix: "/formulář/",
    httpMethods: ["GET"],
  });

}

function registerAssetsRoutes(server: HttpServer) {
  server.register(fastifyStatic, {
    root: new URL("../../public/assets/", import.meta.url),
    prefix: "/assets/",
    decorateReply: false
  });
}
