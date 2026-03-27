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
  const contentType = request.headers["content-type"];

  let attachment: string | null = null;
  if (contentType === undefined) {
    response.code(HttpStatusCode.BadRequest).send();
    return;
  } else if (contentType === "application/json") {
    // Fastify parse JSON by default.
    // We need to get the string back.
    // The content must be in "formData" property.
    // https://github.com/datagov-cz/nkd-formulare?tab=readme-ov-file#using-returnurl-to-post-data-to-an-url-of-choice
    attachment = JSON.stringify((request.body as any)["formData"]);
  } else if (contentType.startsWith("multipart/form-data")) {
    attachment = await readMultipart(request);
  }

  if (attachment === null) {
    response.code(HttpStatusCode.BadRequest).send();
    return;
  }

  await repository.createRegistration(
    user.entity.identifier, user.login, attachment);

  response.redirect(route.dashboard());
}

async function readMultipart(
  request: FastifyRequest,
): Promise<string | null> {
  const file = await request.file();
  if (file === undefined) {
    return null;
  }
  return (await file.toBuffer()).toString("utf-8");
}
