import { type Quad } from "@rdfjs/types";
import { createJsonLdReader } from "./jsonld/jsonld-parser.ts";
import { createStreamN3Reader, createN3Reader } from "./n3/n3-parser.ts";
import { collectToArray } from "./rdf-reader.ts";
import { createResourceCollector } from "./resource/resource-collector.ts";
import { createResourceReader, ResourceReader } from "./resource/resource-reader.ts";
import { DatasetFactory } from "rdf-ext";

export async function parseJsonLdToReader(
  document: object | [],
): Promise<ResourceReader> {
  const collector = createResourceCollector();
  await createJsonLdReader().parse(document, collector);
  return createResourceReader(collector.result());
}

export async function parseTurtleToQuads(
  content: string,
): Promise<Quad[]> {
  const collector = collectToArray();
  await createN3Reader().parse(content, collector);
  return collector.result();
}

export async function parseTurtleStreamToQuads(
  stream: ReadableStreamDefaultReader<Uint8Array>,
): Promise<Quad[]> {
  const collector = collectToArray();
  await createStreamN3Reader().parse(stream, collector);
  return collector.result();
}

export async function parseTurtleToReader(
  document: string,
): Promise<ResourceReader> {
  const collector = createResourceCollector();
  await createN3Reader().parse(document, collector);
  return createResourceReader(collector.result());
}

export function quadsToDataset(quads: Quad[]) {
  return (new DatasetFactory()).dataset(quads);
}
