import { type FastifyReply, type FastifyRequest } from "fastify";

import { RegistrationItem, RegistrationService } from "../../registration";
import { AuthenticationData } from "../../authentication";
import { RouteService } from "../route-service";
import { createHeaderBrandingState, createHeaderNavigationState } from "../../components";
import { RegistrationListGetState } from "./registration-list-model";
import { renderRegistrationListGetViewHtml } from "./registration-list-view-html";

export function handleRegistrationListGet(
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
    .send(renderRegistrationListGetViewHtml(state));
}

function createState(
  route: RouteService,
  user: AuthenticationData,
  messages: RegistrationItem[],
): RegistrationListGetState {
  return {
    branding: createHeaderBrandingState(route, user),
    navigation: {
      ...createHeaderNavigationState(route),
      listRegistrationActive: true,
    },
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
