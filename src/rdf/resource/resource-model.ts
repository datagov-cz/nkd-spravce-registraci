import { NamedNode, BlankNode, Term } from "@rdfjs/types";

/**
 * A single object representation of a resource with all its properties.
 */
export interface Resource {
  id: NamedNode | BlankNode;

  properties: { [property: string]: Term[] };
}

export type ResourceByIri = { [iri: string]: Resource };
