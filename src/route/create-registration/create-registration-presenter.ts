import { type FastifyReply, type FastifyRequest } from "fastify";
import { RegistrationService } from "../../registration";
import { RouteService } from "../route-service";
import { HttpStatusCode } from "../../http";
import { renderCreateRegistrationGetViewHtml } from "./create-registration-view-html";
import { createLayoutState } from "../../components";
import { CreateRegistrationGetState } from "./create-registration-model";

export async function handleCreateRegistrationGet(
  route: RouteService,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const user = request.user;

  const state: CreateRegistrationGetState = {
    layout: {
      ...createLayoutState(route, user),
      createRegistrationActive: true,
    },
    datasetRegistrationUrl: route.registerDatasetForm(),
    catalogRegistrationUrl: route.registerCatalogForm(),
    registrationUploadUrl: route.createRegistration(),
  };

  response
    .code(HttpStatusCode.Ok)
    .type("text/html")
    .send(renderCreateRegistrationGetViewHtml(state));
}

export async function handleCreateRegistrationPost(
  repository: RegistrationService,
  route: RouteService,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const user = request.user;
  const contentType = request.headers["content-type"];

  let attachment: string | null = null;
  if (contentType === undefined) {
    response.code(HttpStatusCode.BadRequest).send();
    return;
  } else if (contentType === "application/json") {
    // TODO Remove this once the forms application is updated.
    // Fastify parse JSON by default.
    // We need to get the string back.
    // The content must be in "formData" property.
    // https://github.com/datagov-cz/nkd-formulare?tab=readme-ov-file#using-returnurl-to-post-data-to-an-url-of-choice
    attachment = JSON.stringify((request.body as any)["formData"]);
  } else if (contentType.startsWith("multipart/form-data")) {
    attachment = await readMultipart(request);
  } else if (contentType === "application/x-www-form-urlencoded") {
    attachment = (request.body as any).formData;
  }

  if (attachment === null || attachment === undefined) {
    response.code(HttpStatusCode.BadRequest).send();
    return;
  }

  await repository.createRegistration(
    user.entity.identifier, user.login, attachment);

  // We need to encode the value for a redirect.
  response.redirect(encodeURI(route.listRegistration()));
}

async function readMultipart(request: FastifyRequest): Promise<string | null> {
  const file = await request.file();
  if (file === undefined) {
    return null;
  }
  return (await file.toBuffer()).toString("utf-8");
}
