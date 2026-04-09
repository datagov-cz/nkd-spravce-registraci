import { describe, expect, it } from "vitest";
import { mockFileSystemService } from "../../file-system";
import {
  RegistrationType,
  RegistrationSource,
} from "../registration-model";
import { createDiskRepository } from "./disk-repository";

describe("createDiskRepository", () => {

  it("Implementation test I.", async () => {
    const fileSystem = mockFileSystemService({});

    const repository = createDiskRepository(
      fileSystem, "/messages", "/attachments");

    await repository.synchronize();

    expect(repository.listRegistrations("17651921")).toStrictEqual([]);

    const now = Date.now();
    const content = `{
  "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  "iri": "https://data.gov.cz/zdroj/datové-sady/00283924/997020085",
  "typ": "Datová sada",
  "název": {
    "cs": "Úřední deska státního úřadu"
  }
}`;

    await repository.createRegistration(now, "17651921", "the-one", content);

    const registrations = await repository.listRegistrations("17651921");
    expect(registrations.length).toBe(1);

    // Read and check basics of the dataset.

    const dataset = registrations[0];
    expect(dataset.source).toBe(RegistrationSource.RegistrationManager);
    expect(dataset.type).toBe(RegistrationType.CreateDataset);
    expect(dataset.label).toStrictEqual({
      "cs": "Úřední deska státního úřadu"
    });

    // Try to load the attachment.
    const actual = await repository.readRegistration(
      "17651921", dataset.identifier);
    expect(actual).not.toBeNull();
    expect(actual?.attachmentContent).toStrictEqual(content);
  });

  it("Synchronization test I.", async () => {
    const files = {
      "/attachments/registration-manager-1774299953387.jsonld": `{
  "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  "iri": "https://data.gov.cz/zdroj/datové-sady/00283924/997020085",
  "typ": "Datová sada",
    "název": { "cs": "Úřední deska státního úřadu" }
}`,
      "/messages/registration-manager-1774299953387.ttl": `@prefix nkod: <https://data.gov.cz/slovník/nkod/>.

<https://data.gov.cz/zdroj/nkod/přijaté-záznamy/registration-manager-1774299953387> a <https://data.gov.cz/slovník/nkod/PřijatýZáznam>;
  <https://data.gov.cz/slovník/nkod/identifikátor> "registration-manager-1774299953387";
  nkod:organizace "17651921";
  <https://data.gov.cz/slovník/nkod/uživatelský-účet> "the-one";
  <https://data.gov.cz/slovník/nkod/datová-zpráva-přijata> "2026-03-23T21:05:53.387Z";
  <https://data.gov.cz/slovník/nkod/jméno-souboru> "registration-manager-1774299953387.jsonld".
  `}

    const fileSystem = mockFileSystemService(files);

    const repository = createDiskRepository(
      fileSystem, "/messages", "/attachments");

    await repository.synchronize();

    const registrations = await repository.listRegistrations("17651921");
    expect(registrations.length).toBe(1);

  });

});
