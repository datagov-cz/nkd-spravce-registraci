import {
  createJsonLdReader,
  createResourceCollector,
  createResourceReader,
  LanguageString,
  SubjectReader,
} from "../../rdf";
import { RegistrationType } from "../registration-model";

export async function parseIsdsAttachment(
  content: string,
): Promise<IsdsAttachment | null> {
  const json = JSON.parse(content);
  const collector = createResourceCollector();
  const jsonldReader = createJsonLdReader();
  await jsonldReader.parse(json, collector);
  const reader = createResourceReader(collector.result());
  // Read dataset
  const dataset = reader.firstOfType(VOCABULARY.Dataset);
  if (dataset !== null) {
    const status = dataset.value(VOCABULARY.status);
    if (status === VOCABULARY.Withdrawn) {
      return parseWithdrawDataset(dataset);
    } else {
      return parseCreateDataset(dataset);
    }
  }
  // Read catalog
  const catalog = reader.firstOfType(VOCABULARY.Catalog);
  if (catalog !== null) {
    const status = catalog.value(VOCABULARY.status);
    const identifier = catalog.value(VOCABULARY.endpointURL);
    if (identifier === null) {
      return null;
    }
    if (status === VOCABULARY.Withdrawn) {
      return parseWithdrawCatalog(catalog);
    } else {
      return parseCreateCatalog(catalog);
    }
  }
  return null;
}

export interface IsdsAttachment {

  type: RegistrationType;

  iri: string | null;

  label: LanguageString | null;

}

function parseWithdrawDataset(dataset: SubjectReader): IsdsAttachment {
  return {
    type: RegistrationType.WithdrawDataset,
    iri: dataset.identifier().value,
    label: null,
  }
}

function parseCreateDataset(dataset: SubjectReader): IsdsAttachment {
  return {
    type: RegistrationType.CreateDataset,
    iri: null,
    label: dataset.languageString(VOCABULARY.title),
  }
}

function parseWithdrawCatalog(catalog: SubjectReader): IsdsAttachment {
  return {
    type: RegistrationType.WithdrawCatalog,
    iri: catalog.identifier().value,
    label: null,
  }
}

function parseCreateCatalog(catalog: SubjectReader): IsdsAttachment {
  return {
    type: RegistrationType.CreateDataset,
    iri: null,
    label: catalog.languageString(VOCABULARY.title),
  }
}

const VOCABULARY = {
  ReceivedRecord: "https://data.gov.cz/slovník/nkod/PřijatýZáznam",
  messageIdentifier: "https://data.gov.cz/slovník/nkod/id-datové-zprávy",
  annotation: "https://data.gov.cz/slovník/nkod/anotace",
  senderMainBox: "https://data.gov.cz/slovník/nkod/datová-schránka-poskytovatele",
  receivedAt: "https://data.gov.cz/slovník/nkod/datová-zpráva-přijata",
  fileName: "https://data.gov.cz/slovník/nkod/jméno-souboru",
  Dataset: "http://www.w3.org/ns/dcat#Dataset",
  status: "http://www.w3.org/ns/adms#status",
  Catalog: "http://www.w3.org/ns/dcat#Catalog",
  Withdrawn: "http://purl.org/adms/status/Withdrawn",
  endpointURL: "http://www.w3.org/ns/dcat#endpointURL",
  title: "http://purl.org/dc/terms/title",
};
