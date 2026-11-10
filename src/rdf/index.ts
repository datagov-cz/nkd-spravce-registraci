// RDF basic primitives
export * from "./rdf-model.ts";

// RDF parsers
export { type RdfCollector, collectToArray } from "./rdf-reader.ts";
export { createJsonLdReader } from "./jsonld/jsonld-parser.ts";
export {
  createN3Reader,
  createStreamN3Reader,
} from "./n3/n3-parser.ts";

// RDF Writers
export { createN3Writer } from "./n3/n3-writer.ts";

// RDF readers
export { type Resource, type ResourceByIri } from "./resource/resource-model.ts";
export {
  type ResourceReader,
  type SubjectReader,
  createResourceReader,
} from "./resource/resource-reader.ts";
export { createResourceCollector } from "./resource/resource-collector.ts";

// RDF builder
export { type RdfBuilder, createStatementRdfBuilder } from "./rdf-builder.ts";

// Utilities
export {
  parseJsonLdToReader,
  parseTurtleToReader,
  parseTurtleToQuads,
  parseTurtleStreamToQuads,
} from "./utilities.ts";
