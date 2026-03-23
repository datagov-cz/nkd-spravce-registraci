import { type FastifyReply, type FastifyRequest } from "fastify";
import { renderRegistrationViewHtml } from "./registration-view-html";
import { type RegistrationState } from "./registration-model";
import { RegistrationRepository } from "../../registration";

export async function handleRegistrationGet(
  repository: RegistrationRepository,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const user = request.user;
  const query = request.query as any;
  const attachment = await repository.readAttachment(
    user.entity.identifier, query.id) ?? "";

  // Create state ...
  const state: RegistrationState = {
    user: {
      name: `${user.familyName} ${user.givenName}`,
      logout: "/caais/logout?redirect-url=/"
    },
    organization: {
      name: user.entity.name,
    },
   attachment,
  }

  response
    .code(200)
    .type("text/html")
    .send(renderRegistrationViewHtml(state));
}
