import { type FastifyReply, type FastifyRequest } from "fastify";

import { RegistrationItem, RegistrationService } from "../../registration";
import { AuthenticationData } from "../../authentication";
import { RouteService } from "../route-service";
import { createHeaderBrandingState, createHeaderNavigationState } from "../../components";
import { PaginationState, RegistrationListGetState } from "./registration-list-model";
import { renderRegistrationListGetViewHtml } from "./registration-list-view-html";

const PAGE_SIZE = 10;

export function handleRegistrationListGet(
  repository: RegistrationService,
  route: RouteService,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const user = request.user;
  const query = request.query as Record<string, string>;
  const rawPage = parseInt(query["stránka"] ?? "1", 10);
  const currentPage = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  const allMessages = repository.listRegistrations(user.entity.identifier);
  const sorted = [...allMessages].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const pagination: PaginationState = {
    currentPage: Number(safePage),
    pageSize: PAGE_SIZE,
    totalRecords: sorted.length,
  };

  const state = createState(route, user, pageItems, pagination);
  response
    .code(200)
    .type("text/html")
    .send(renderRegistrationListGetViewHtml(state));
}

function createState(
  route: RouteService,
  user: AuthenticationData,
  messages: RegistrationItem[],
  pagination: PaginationState,
): RegistrationListGetState {
  return {
    branding: createHeaderBrandingState(route, user),
    navigation: {
      ...createHeaderNavigationState(route),
      listRegistrationActive: true,
    },
    createRegistrationUrl: route.createRegistration(),
    messages: messages.map(message => ({
      identifier: message.identifier,
      label: message.label["cs"],
      source: message.source,
      type: message.type,
      createdAt: message.createdAt,
      detailUrl: route.registrationDetail(message.identifier),
    })),
    pagination,
  }
}
