import { type FastifyReply, type FastifyRequest } from "fastify";
import { renderDashboardViewHtml } from "./dashboard-view-html";
import { type DashboardState } from "./dashboard-model";
import { RegistrationItem, RegistrationService } from "../../registration";
import { AuthenticationData } from "../../authentication";
import { RouteService } from "../route-service";

export function handleDashboardGet(
  repository: RegistrationService,
  route: RouteService,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const user = request.user;
  const messages = repository.listRegistrations(user.entity.identifier);
  const state = createState(route, user, messages);
  response
    .code(200)
    .type("text/html")
    .send(renderDashboardViewHtml(state));
}

function createState(
  route: RouteService,
  user: AuthenticationData,
  messages: RegistrationItem[],
): DashboardState {
  return {
    user: {
      name: `${user.familyName} ${user.givenName}`,
      logout: route.caaisLogout(),
    },
    organization: {
      name: user.entity.name,
    },
    datasetRegistrationUrl: route.formsRegisterDataset(),
    catalogRegistrationUrl: route.formsRegisterCatalog(),
    registrationUploadUrl: route.createRegistrationCallback(),
    messages: messages.map(message => ({
      identifier: message.identifier,
      label: message.label["cs"],
      source: message.source,
      type: message.type,
      createdAt: message.createdAt,
      detailUrl: route.registrationDetail(message.identifier),
    })),
  }
}
