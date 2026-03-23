import fastifyStatic from "@fastify/static";
import fastifyProxy from "@fastify/http-proxy";
import { HttpServer } from "./http-server-type";

import { handleDashboardGet } from "./dashboard";
import { type Forms } from "../dcat-ap-forms";
import { handleCatalogCreateGet } from "./catalog-create";
import { handleCatalogUpdateGet } from "./catalog-update";
import { handleCatalogDeleteGet } from "./catalog-delete";
import { handleDatasetCreateGet } from "./dataset-create";
import { handleDatasetUpdateGet } from "./dataset-update";
import { handleDatasetDeleteGet } from "./dataset-delete";
import { handleDashboardPost } from "./dashboard/dashboard-presenter";
import { RegistrationRepository } from "../registration";
import { handleRegistrationGet } from "./registration";

const routes = Object.freeze({
  CatalogCreate: "/formulář/registrace-lokálního-katalogu",
  CatalogUpdate: "/formulář/úprava-lokálního-katalogu",
  CatalogDelete: "/formulář/odstranění-datového-katalogu",
  DatasetCreate: "/formulář/registrace-datové-sady",
  DatasetUpdate: "/formulář/úprava-datové-sady",
  DatasetDelete: "/formulář/odstranění-datové-sady",
});

export function registerRoutes(
  server: HttpServer,
  forms: Forms,
  repository: RegistrationRepository,
) {
  registerAssetsRoutes(server);

  server.route({
    method: "GET",
    url: "/",
    handler: (req, res) => handleDashboardGet(repository, req, res),
  });

  server.route({
    method: "POST",
    url: "/",
    handler: (req, res) => handleDashboardPost(repository, req, res),
  });

  server.route({
    method: "GET",
    url: "/detail-registrace",
    handler: (req, res) => handleRegistrationGet(repository, req, res),
  });

  return;

  server.route({
    method: "GET",
    url: routes.CatalogCreate,
    handler: (req, res) => handleCatalogCreateGet(forms, req, res),
  });

  server.route({
    method: "GET",
    url: routes.CatalogUpdate,
    handler: (req, res) => handleCatalogUpdateGet(forms, req, res),
  });

  server.route({
    method: "GET",
    url: routes.CatalogDelete,
    handler: (req, res) => handleCatalogDeleteGet(forms, req, res),
  });

  server.route({
    method: "GET",
    url: routes.DatasetCreate,
    handler: (req, res) => handleDatasetCreateGet(forms, req, res),
  });

  server.route({
    method: "GET",
    url: routes.DatasetUpdate,
    handler: (req, res) => handleDatasetUpdateGet(forms, req, res),
  });

  server.route({
    method: "GET",
    url: routes.DatasetDelete,
    handler: (req, res) => handleDatasetDeleteGet(forms, req, res),
  });

  // server.route({
  //   method: "GET",
  //   url: "/přihlásit",
  //   handler: (req, res) => loginHandler(serviceManager, req, res),
  // });

  // server.route({
  //   method: "GET",
  //   url: "/odhlásit",
  //   handler: (req, res) => loginHandler(serviceManager, req, res),
  // });

  // We need to proxy for other resources like JS or CSS files.
  server.register(fastifyProxy, {
    prefix: "/formulář/",
    preRewrite: (url: string) => {
      // We need custom rewrite as the URL can be encoded so we use the
      // second '/' as a separator.
      const start = url.indexOf("/", 1)
      return url.substring(start);
    },
    httpMethods: ["GET"],
    upstream: forms.proxyUrl(),
  });
}

function registerAssetsRoutes(server: HttpServer) {
  server.register(fastifyStatic, {
    root: new URL("../../public", import.meta.url),
    prefix: "/assets/",
    decorateReply: false
  });
}
