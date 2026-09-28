import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticationData } from "../../authentication";
import { createHeaderBrandingState, createHeaderNavigationState } from "../../components";
import { RouteService } from "../route-service";
import { Status400State } from "./status-400-model";
import { renderStatus400ViewHtml } from "./status-400-view-html";
import { HttpStatusCode } from "../../http";

export function handleStatus400(
  route: RouteService,
  request: FastifyRequest,
  response: FastifyReply,
  sourceHref: string,
) {
  const user = request.user;
  const state = createState(route, user, sourceHref);
  response
    .code(HttpStatusCode.BadRequest)
    .type("text/html")
    .send(renderStatus400ViewHtml(state));
}

function createState(
  route: RouteService,
  user: AuthenticationData,
  sourceHref: string,
): Status400State {
  return {
    branding: createHeaderBrandingState(route, user),
    navigation: {
      ...createHeaderNavigationState(route),
      listRegistrationActive: true,
    },
    actionHref: sourceHref,
  };
}
