import N3 from "n3";

import { StringRdfWriter } from "../rdf-writer.ts";

export function createN3Writer(options?: {
  prefixes?: { [prefix: string]: string };
  pretty?: boolean;
}): StringRdfWriter {
  const writer = new N3.Writer({
    format: "text-turtle",
    prefixes: options?.prefixes ?? {},
  });
  // Create and return an instance.
  return {
    addQuads(quads) {
      writer.addQuads(quads);
    },
    asString() {
      return new Promise((accept, reject) => {
        writer.end((error, result) => {
          if (error) {
            reject(error);
            return;
          }
          if (options?.pretty) {
            accept(prettyPrintTurtle(result));
            return;
          }
          accept(result);
        });
      });
    },
  };
}

/**
 * Add an empty line before each resource section.
 */
function prettyPrintTurtle(turtle: string): string {
  const lines = turtle.split(/\r?\n|\r|\n/g);
  const linesNext: string[] = [];
  for (const line of lines) {
    linesNext.push(line);
    if (line.startsWith("@prefix")) {
      continue;
    }
    if (line.endsWith(".")) {
      linesNext.push("");
    }
  }
  return linesNext.join("\n");
}
