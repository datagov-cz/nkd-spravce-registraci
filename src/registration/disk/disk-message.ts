import {
  createResourceCollector,
  createResourceReader,
  createStringN3RdfReader,
  RdfBuilder,
  ResourceReader,
} from "../../rdf";

export async function parseDiskMessage(
  content: string,
): Promise<DiskMessage | null> {
  const collector = createResourceCollector();
  const n3Reader = createStringN3RdfReader();
  await n3Reader.parse(content, collector);
  const reader = createResourceReader(collector.result());
  return asDiskMessage(reader);
}

export interface DiskMessage {

  identifier: string;

  organization: string;

  username: string;

  createdAt: Date;

  attachmentFileName: string;

}

function asDiskMessage(
  reader: ResourceReader,
): DiskMessage | null {
  const resource = reader.firstOfType(VOCABULARY.ReceivedRecord);
  if (resource === null) {
    // Unknown message type.
    return null;
  }
  const identifier = resource.value(VOCABULARY.identifier);
  if (identifier === null) {
    return null;
  }
  const organization = resource.value(VOCABULARY.organization);
  if (organization === null) {
    return null;
  }
  const username = resource.value(VOCABULARY.username);
  if (username === null) {
    return null;
  }
  const receivedAt = resource.date(VOCABULARY.receivedAt);
  if (receivedAt === null) {
    return null;
  }
  const attachmentFileName = resource.value(VOCABULARY.fileName);
  if (attachmentFileName === null) {
    return null;
  }
  return {
    identifier,
    organization,
    username,
    createdAt: receivedAt,
    attachmentFileName,
  }
}

export function writeDiskMessage<BuilderType>(
  builder: RdfBuilder<BuilderType>,
  message: DiskMessage,
): void {
  const iri = "https://data.gov.cz/zdroj/nkod/přijaté-záznamy/" + message.identifier;
  builder.addType(iri, VOCABULARY.ReceivedRecord)
    .addLiteral(iri, VOCABULARY.identifier, message.identifier)
    .addLiteral(iri, VOCABULARY.organization, message.organization)
    .addLiteral(iri, VOCABULARY.username, message.username)
    .addLiteral(iri, VOCABULARY.receivedAt, message.createdAt)
    .addLiteral(iri, VOCABULARY.fileName, message.attachmentFileName);
}

const VOCABULARY = {
  ReceivedRecord: "https://data.gov.cz/slovník/nkod/PřijatýZáznam",
  identifier: "https://data.gov.cz/slovník/nkod/identifikátor",
  organization: "https://data.gov.cz/slovník/nkod/organizace",
  username: "https://data.gov.cz/slovník/nkod/uživatelský-účet",
  receivedAt: "https://data.gov.cz/slovník/nkod/datová-zpráva-přijata",
  fileName: "https://data.gov.cz/slovník/nkod/jméno-souboru",
};
