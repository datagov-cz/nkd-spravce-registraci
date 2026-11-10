import { NamedNode, BlankNode, Term } from "@rdfjs/types";

/** Custom version of node with narrower definition. */
export type Node = NamedNode | BlankNode;

export function isNode(value: Term): value is Node {
  return value.termType === "NamedNode" || value.termType === "BlankNode";
}

export function isNamedNode(value: Term): value is NamedNode {
  return value.termType === "NamedNode";
}

export type LanguageString = { [language: string]: string };
