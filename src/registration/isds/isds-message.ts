import {
  createN3Reader,
  createResourceCollector,
  createResourceReader,
  ResourceReader,
} from "../../rdf";

export async function parseIsdsMessage(
  content: string,
): Promise<IsdsMessage | null> {
  const collector = createResourceCollector();
  const n3Reader = createN3Reader();
  await n3Reader.parse(content, collector);
  const reader = createResourceReader(collector.result());
  return asIsdsMessage(reader);
}

export interface IsdsMessage {
  messageIdentifier: string;

  annotation: string;

  senderDataBox: string;

  receivedAt: Date;

  attachmentFileName: string;
}

function asIsdsMessage(reader: ResourceReader): IsdsMessage | null {
  const resource = reader.firstOfType(VOCABULARY.ReceivedRecord);
  if (resource === null) {
    // Unknown message type.
    return null;
  }
  const messageIdentifier = resource.value(VOCABULARY.messageIdentifier);
  if (messageIdentifier === null) {
    return null;
  }
  const annotation = resource.value(VOCABULARY.annotation);
  if (annotation === null) {
    return null;
  }
  const senderDataBox = resource.value(VOCABULARY.senderMainBox);
  if (senderDataBox === null) {
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
    messageIdentifier,
    annotation,
    senderDataBox,
    receivedAt,
    attachmentFileName,
  };
}

const VOCABULARY = {
  ReceivedRecord: "https://data.gov.cz/slovník/nkod/PřijatýZáznam",
  messageIdentifier: "https://data.gov.cz/slovník/nkod/id-datové-zprávy",
  annotation: "https://data.gov.cz/slovník/nkod/anotace",
  senderMainBox:
    "https://data.gov.cz/slovník/nkod/datová-schránka-poskytovatele",
  receivedAt: "https://data.gov.cz/slovník/nkod/datová-zpráva-přijata",
  fileName: "https://data.gov.cz/slovník/nkod/jméno-souboru",
};
