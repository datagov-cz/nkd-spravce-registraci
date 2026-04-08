import { configuration } from "./application/configuration";
import { createAuthenticationService, createMockAuthenticationService } from "./authentication";
import { createFileSystemService } from "./file-system";
import { createHttpServer, startServer } from "./http";
import { logger } from "./application";
import { createRegistrationService } from "./registration";
import { createDiskRepository } from "./registration/disk";
import { createIsdsRepository } from "./registration/isds/isds-repository";
import { createRouteService, registerRoutes } from "./route";
import { createRppService } from "./rpp";
import { createSparqlService } from "./sparql";

(async function main(configuration) {
  const sparql = createSparqlService();
  const fileSystem = createFileSystemService();
  const rpp = createRppService(sparql, configuration.rpp.sparql);

  const isdsRepository = createIsdsRepository(
    fileSystem, rpp,
    configuration.isds.messagesPath,
    configuration.isds.attachmentsPath);

  const diskRepository = createDiskRepository(
    fileSystem,
    configuration.repository.messagesPath,
    configuration.repository.attachmentsPath);

  const repository = createRegistrationService(
    isdsRepository, diskRepository);

  const useMockAuthentication =
    configuration.authentication.useMock && configuration.development;
  const authentication = useMockAuthentication ?
    createMockAuthenticationService() :
    createAuthenticationService(
      configuration.authorization.requiredActivityRoleCode);

  const route = createRouteService(
    configuration.http.baseUrl);
  const httpServer = await createHttpServer(
    configuration, authentication, route);
  registerRoutes(configuration, httpServer, repository, route);

  // Initial synchronization — non-blocking, server can start without data.
  isdsRepository.synchronize().catch((error) => {
    logger.error({ error }, "ISDS initial synchronization failed.");
  });

  // Periodic synchronization.
  const syncIntervalMs = configuration.isds.syncIntervalSeconds * 1_000;
  if (syncIntervalMs > 0) {
    setInterval(() => {
      isdsRepository.synchronize().catch((error) => {
        logger.error({ error }, "ISDS periodic synchronization failed.");
      });
    }, syncIntervalMs);
  }

  startServer(configuration, httpServer);
})(configuration);
