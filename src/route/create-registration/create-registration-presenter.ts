import { type FastifyReply, type FastifyRequest } from "fastify";
import { RegistrationService } from "../../registration";
import { RouteService } from "../route-service";
import { HttpStatusCode } from "../../http";
import { renderCreateRegistrationGetViewHtml } from "./create-registration-view-html";
import { createHeaderBrandingState, createHeaderNavigationState } from "../../components";
import { CreateRegistrationGetState } from "./create-registration-model";

export async function handleCreateRegistrationGet(
  route: RouteService,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const user = request.user;

  const state: CreateRegistrationGetState = {
    branding: createHeaderBrandingState(route, user),
    navigation: {
      ...createHeaderNavigationState(route),
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
  const attachments = await readAttachments(request);
  if (attachments.length === 0) {
    response.code(HttpStatusCode.BadRequest).send();
    return;
  }

  // For each attachment we create a new registration record.
  const now = Date.now();
  for (const attachment of attachments) {
    await repository.createRegistration(
      now, user.entity.identifier, user.login, attachment);
  }

  // We need to encode the value for a redirect.
  response.redirect(encodeURI(route.listRegistration()));
}

/**
 * @param request
 * @returns All attachments as strings.
 */
async function readAttachments(request: FastifyRequest,) {
  const contentType = request.headers["content-type"];
  if (contentType === undefined) {
    return [];
  } else if (contentType === "application/json") {
    // TODO Remove this once the forms application is updated.
    // Fastify parse JSON by default.
    // We need to get the string back.
    // The content must be in "formData" property.
    // https://github.com/datagov-cz/nkd-formulare?tab=readme-ov-file#using-returnurl-to-post-data-to-an-url-of-choice
    return [JSON.stringify((request.body as any)["formData"])];
  } else if (contentType.startsWith("multipart/form-data")) {
    return await readMultipart(request);
  } else if (contentType === "application/x-www-form-urlencoded") {
    return [(request.body as any).formData];
  } else {
    return [];
  }
}

/**
 * @param request
 * @returns All files in the request.
 */
async function readMultipart(request: FastifyRequest): Promise<string[]> {
  const result: string[] = [];
  const parts = request.files()
  for await (const part of parts) {
    if (part.type !== "file") {
      continue;
    }
    const content = (await part.toBuffer()).toString();
    result.push(content);
  }
  return result;
}
