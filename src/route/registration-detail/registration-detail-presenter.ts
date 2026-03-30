import { type FastifyReply, type FastifyRequest } from "fastify";
import { RegistrationDetailGetState } from "./registration-detail-model";
import { RegistrationService } from "../../registration";
import { HttpStatusCode } from "../../http";
import { RouteService } from "../route-service";
import { renderRegistrationDetailGetViewHtml } from "./registration-detail-view-html";
import { createHeaderBrandingState, createHeaderNavigationState } from "../../components";

export async function handleRegistrationDetailGet(
  repository: RegistrationService,
  route: RouteService,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const user = request.user;
  const query = request.query as any;
  const registration = await repository.readRegistration(
    user.entity.identifier, query["identifikátor"]);

  if (registration === null) {
    response.code(HttpStatusCode.NotFound).send();
    return;
  }

  // Create state ...
  const state: RegistrationDetailGetState = {
    branding: createHeaderBrandingState(route, user),
    navigation: {
      ...createHeaderNavigationState(route),
      listRegistrationActive: true,
    },
    registrationLabel: registration.label["cs"],
    registrationSource: registration.source,
    registrationType: registration.type,
    attachmentContent: registration.attachmentContent,
    registrationListUrl: route.listRegistration(),
  };

  response
    .code(HttpStatusCode.Ok)
    .type("text/html")
    .send(renderRegistrationDetailGetViewHtml(state));
}
