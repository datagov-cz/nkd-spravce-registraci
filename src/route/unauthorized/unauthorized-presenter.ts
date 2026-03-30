import { type FastifyReply, type FastifyRequest } from "fastify";

import { renderUnauthorizedViewHtml } from "./unauthorized-view-html";
import { RouteService } from "../route-service";
import { UnauthorizedState } from "./unauthorized-state";
import { createHeaderBrandingState } from "../../components";

export function handleUnauthorized(
  route: RouteService,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const user = request.user;

  // Create state ...
  const state: UnauthorizedState = {
    branding: createHeaderBrandingState(route, user),
  };

  response
    .code(200)
    .type("text/html")
    .send(renderUnauthorizedViewHtml(state));
}
