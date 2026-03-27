import { type FastifyReply, type FastifyRequest } from "fastify";
import { renderRegistrationViewHtml } from "./registration-detail-view-html";
import { type RegistrationState } from "./registration-detail-model";
import { RegistrationService } from "../../registration";
import { HttpStatusCode } from "../../http";
import { RouteService } from "../route-service";

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
  const state: RegistrationState = {
    user: {
      name: `${user.familyName} ${user.givenName}`,
      logout: route.caaisLogout(),
    },
    organization: {
      name: user.entity.name,
    },
    dashboardUrl: route.dashboard(),
    registration,
    attachment: registration.attachmentContent,
  };

  response
    .code(HttpStatusCode.Ok)
    .type("text/html")
    .send(renderRegistrationViewHtml(state));
}
