import type { LanguageString } from "./rdf-model.ts";

import type { NamedNode, Quad, Quad_Object } from "@rdfjs/types";
import DataFactory from "@rdfjs/data-model";

export function createStatementRdfBuilder(): RdfBuilder<Quad[]> {
  return new DefaultRdfBuilder();
}

export interface RdfBuilder<ResultType> {
  addType(subject: string, type: string): this;

  addIris(subject: string, predicate: string, iris: string[]): this;

  addIri(subject: string, predicate: string, iri: string | null): this;

  addLanguageString(
    subject: string,
    predicate: string,
    string: LanguageString | null,
  ): this;

  addLiteral(
    subject: string,
    predicate: string,
    literal: Date | string | boolean | number | null,
  ): this;

  build(): ResultType;
}

class DefaultRdfBuilder implements RdfBuilder<Quad[]> {
  readonly quad: Quad[] = [];

  addType(subject: string, type: string): this {
    this.push(subject, RDFS.type, this.iri(type));
    return this;
  }

  private iri(value: string): NamedNode {
    return DataFactory.namedNode(value);
  }

  private push(subject: string, predicate: string, object: Quad_Object) {
    this.quad.push(DataFactory.quad(
      this.iri(subject), this.iri(predicate), object));
  }

  addIris(subject: string, predicate: string, iris: string[]): this {
    for (const value of iris) {
      this.push(subject, predicate, this.iri(value));
    }
    return this;
  }

  addIri(subject: string, predicate: string, iri: string | null): this {
    if (iri === null) {
      return this;
    }
    this.push(subject, predicate, this.iri(iri));
    return this;
  }

  addLanguageString(
    subject: string,
    predicate: string,
    string: LanguageString | null,
  ): this {
    if (string === null) {
      return this;
    }
    for (const [language, value] of Object.entries(string)) {
      this.push(subject, predicate, DataFactory.literal(value, language));
    }
    return this;
  }

  addLiteral(
    subject: string,
    predicate: string,
    literal: Date | string | boolean | number | null,
  ): this {
    if (literal === null) {
      return this;
    }
    if (typeof literal === "boolean") {
      this.push(subject, predicate,
        DataFactory.literal(String(literal), this.iri(XSD.boolean)));
    } else if (typeof literal === "string") {
      this.push(subject, predicate,
        DataFactory.literal(literal, this.iri(XSD.string)));
    } else if (Number.isInteger(literal)) {
      this.push(subject, predicate,
        DataFactory.literal(String(literal), this.iri(XSD.integer)));
    } else if (typeof literal === "number") {
      this.push(subject, predicate,
        DataFactory.literal(doubleToString(literal), this.iri(XSD.double)));
    } else if (literal instanceof Date) {
      // Keep only the date part, as xsd:date has no time.
      this.push(subject, predicate,
        DataFactory.literal(literal.toISOString().substring(0, 10), this.iri(XSD.date)));
    } else {
      throw new Error("Unsupported operation exception.");
    }
    return this;
  }

  build(): Quad[] {
    return this.quad;
  }
}

/** Convert number to xsd:double lexical form. */
function doubleToString(value: number): string {
  if (Number.isNaN(value)) {
    return "NaN";
  } else if (value === Infinity) {
    return "INF";
  } else if (value === -Infinity) {
    return "-INF";
  } else {
    return String(value);
  }
}

const RDFS_PREFIX ="http://www.w3.org/1999/02/22-rdf-syntax-ns#";

const RDFS = {
  type: RDFS_PREFIX + "type",
};

const XSD_PREFIX = "http://www.w3.org/2001/XMLSchema#";

const XSD = {
  boolean: XSD_PREFIX + "boolean",
  integer: XSD_PREFIX + "integer",
  double: XSD_PREFIX + "double",
  string: XSD_PREFIX + "string",
  date: XSD_PREFIX + "date",
};
