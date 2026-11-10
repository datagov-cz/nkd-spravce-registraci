import { Quad } from "@rdfjs/types";

export interface RdfReader<InputType> {
  /** @throws */
  parse(input: InputType, collector: RdfCollector): Promise<void>;
}

export interface RdfCollector {
  quad(quad: Quad): void;
}

/** Collect quads into an array. */
export function collectToArray(): CollectToArray {
  const collector: Quad[] = [];
  return {
    quad(quad) {
      collector.push(quad);
    },
    result() {
      return collector;
    },
  };
}

interface CollectToArray extends RdfCollector {
  result(): Quad[];
}
