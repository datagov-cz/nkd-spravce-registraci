import { configuration } from "./application/configuration";
import { createAuthenticationService, createMockAuthenticationService } from "./authentication";
import { createFileSystemService } from "./file-system";
import { createHttpServer, startServer } from "./http";
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
    createAuthenticationService();

  const route = createRouteService(
    configuration.http.baseUrl,
    configuration.forms.proxyUrl);
  const httpServer = await createHttpServer(
    configuration, authentication);
  registerRoutes(configuration, httpServer, repository, route);

  // This is asynchronous.
  // We can start server without the data.
  repository.synchronize();

  startServer(configuration, httpServer);
})(configuration);
