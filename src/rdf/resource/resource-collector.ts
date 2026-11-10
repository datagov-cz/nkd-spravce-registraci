import { BlankNode, NamedNode, Quad } from "@rdfjs/types";
import type { Resource, ResourceByIri } from "./resource-model.ts";
import type { RdfCollector } from "../rdf-reader.ts";
import { isNode } from "../rdf-model.ts";

/**
 * Collect statements into {@link Resource}s.
 */
export function createResourceCollector(): ResourceCollector {
  const resourceMap: { [iri: string]: Resource } = {};

  const process = ({ subject, predicate, object }: Quad) => {
    if (!(isNode(subject))) {
      throw new Error(
        `Unsupported node type "${subject.termType}" for "${subject.value}".`);
    }
    const resource = getOrCreateResource(resourceMap, subject);
    let property = resource.properties[predicate.value];
    if (property === undefined) {
      property = [];
      resource.properties[predicate.value] = property;
    }
    property.push(object);
  };

  return {
    quads(quads: Quad[]) {
      quads.forEach(process);
      return this;
    },
    quad(quad: Quad) {
      process(quad);
    },
    result(): ResourceByIri {
      return resourceMap;
    },
  };
}

function getOrCreateResource(
  resourceMap: { [iri: string]: Resource },
  subject: NamedNode | BlankNode,
): Resource {
  const identifier = subject.value;
  let resource = resourceMap[identifier];
  if (resource === undefined) {
    // Create a new resource.
    resource = {
      id: subject,
      properties: {},
    };
    resourceMap[identifier] = resource;
  }
  return resource;
}

export interface ResourceCollector extends RdfCollector {

  quads(quads: Quad[]): this;

  result(): ResourceByIri;

}
