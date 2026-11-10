// We use '@types/jsonld' which does not really reflect types,
// but it is better then nothing.
import jsonld from "jsonld";
import {
  Quad_Graph, Quad_Predicate, Quad_Object, Quad_Subject,
} from "@rdfjs/types";
import DataFactory from "@rdfjs/data-model";

import type { RdfCollector, RdfReader } from "../rdf-reader.ts";

export function createJsonLdReader(): RdfReader<object | []> {
  return new JsonLdReader();
}

class JsonLdReader implements RdfReader<object | []> {
  async parse(input: object | [], collector: RdfCollector): Promise<void> {
    const options = { documentLoader };
    const rdf = (await jsonld.toRDF(input, options)) as JsonLdQuad[];
    rdf.forEach(quad => collector.quad(DataFactory.quad(
      toTerm(quad.subject) as Quad_Subject,
      toTerm(quad.predicate) as Quad_Predicate,
      toTerm(quad.object) as Quad_Object,
      toTerm(quad.graph) as Quad_Graph,
    )));
  }
}

interface JsonLdQuad {

  subject: JsonLdTerm;

  predicate: JsonLdTerm;

  object: JsonLdTerm;

  graph: JsonLdTerm;

}

interface JsonLdTerm {

  termType: "NamedNode" | "BlankNode" | "Literal" | "DefaultGraph";

  value: string;

  datatype?: { termType: "NamedNode"; value: string };

  language?: string;

}

/** Custom way of loading documents to support national characters. */
const documentLoader = async (url: string) => {
  if (documentCache[url] === undefined) {
    // We use the global fetch instead of the 'jsonld' node document loader.
    // The latter passes a dispatcher from its own bundled 'undici' to the
    // built-in fetch, which fails on newer Node versions (e.g. 26).
    // Encode the URL to allow for national characters.
    const response = await fetch(encodeURI(url), {
      headers: { Accept: "application/ld+json, application/json;q=0.9" },
      redirect: "follow",
    });
    if (!response.ok) {
      throw new Error(`Failed to load '${url}': HTTP ${response.status}.`);
    }
    documentCache[url] = {
      contextUrl: null,
      documentUrl: response.url || url,
      document: await response.json(),
    };
  }
  return documentCache[url];
};

function toTerm(quad: JsonLdTerm) {
  switch (quad.termType) {
    case "NamedNode":
      return DataFactory.namedNode(quad.value);
    case "BlankNode":
      const iri = quad.value.startsWith("_:") ? quad.value.slice(2) : quad.value;
      return DataFactory.blankNode(iri);
    case "Literal":
      return quad.language
        ? DataFactory.literal(
          quad.value,
          quad.language)
        : DataFactory.literal(
          quad.value,
          quad.datatype ? DataFactory.namedNode(quad.datatype.value) : undefined);
    case "DefaultGraph":
      return DataFactory.defaultGraph();
  }
}

const documentCache: { [url: string]: any } = {};
