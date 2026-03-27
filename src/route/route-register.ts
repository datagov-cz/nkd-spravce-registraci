import fastifyStatic from "@fastify/static";
import fastifyProxy from "@fastify/http-proxy";

import { handleDashboardGet } from "./dashboard";
import { RegistrationService } from "../registration";
import { HttpServer } from "../http";
import { RouteService } from "./route-service";
import { handleRegistrationDetailGet } from "./registration-detail";
import { handleRegistrationPost } from "./registration-create";
import { Configuration } from "../application";

export function registerRoutes(
  configuration: Configuration,
  server: HttpServer,
  repository: RegistrationService,
  route: RouteService,
) {
  registerAssetsRoutes(server);

  server.route({
    method: "GET",
    url: route.dashboardInternal(),
    handler: (req, res) => handleDashboardGet(
      repository, route, req, res),
  });

  server.route({
    method: "POST",
    url: route.createRegistrationCallbackInternal(),
    handler: (req, res) => handleRegistrationPost(
      repository, route, req, res),
  });

  server.route({
    method: "GET",
    url: route.registrationDetailInternal(),
    handler: (req, res) => handleRegistrationDetailGet(
      repository, route, req, res),
  });

  // server.register(fastifyProxy, {
  //
  //   prefix: "/formulář/",
  //   preRewrite: (url: string) => {
  //     // We need custom rewrite as the URL can be encoded.
  //     // I.e. we can get "/formul%C3%A1%C5%99/" or "/formulář/".
  //     // As a result we use the second "/" as a separator.
  //     const start = url.indexOf("/", 1)
  //     console.log(url, "->", url.substring(start));
  //     return url.substring(start);
  //   },
  //   httpMethods: ["GET"],
  // });

  // server.register(fastifyProxy, {
  //   upstream: configuration.forms.proxyUrl,
  //   prefix: "/formulář/",
  //   httpMethods: ["GET"],
  // })

}

function registerAssetsRoutes(server: HttpServer) {
  server.register(fastifyStatic, {
    root: new URL("../../public", import.meta.url),
    prefix: "/assets/",
    decorateReply: false
  });
}
