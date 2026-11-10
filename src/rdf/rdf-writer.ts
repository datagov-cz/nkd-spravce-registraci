import { Quad } from "@rdfjs/types";

export interface RdfWriter {
  addQuads(quads: Quad[]): void;
}

/**
 * In memory writer to a string.
 */
export interface StringRdfWriter extends RdfWriter {
  asString(): Promise<string>;
}
