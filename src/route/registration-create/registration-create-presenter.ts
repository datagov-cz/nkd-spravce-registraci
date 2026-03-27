import { type FastifyReply, type FastifyRequest } from "fastify";
import { RegistrationService } from "../../registration";
import { RouteService } from "../route-service";
import { HttpStatusCode } from "../../http";

export async function handleRegistrationPost(
  repository: RegistrationService,
  route: RouteService,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const user = request.user;

  const file = await request.file();
  if (file === undefined) {
    response.code(HttpStatusCode.BadRequest).send();
    return;
  }

  const buffer: Buffer<ArrayBufferLike> = await file.toBuffer();
  const attachment = buffer.toString("utf-8");

  await repository.createRegistration(
    user.entity.identifier, user.login, attachment);

  response.redirect(route.dashboard());
}
