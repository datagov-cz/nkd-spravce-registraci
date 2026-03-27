
export function createSparqlService(): SparqlService {
  return new DefaultSparqlService();
}

export interface SparqlService {

  executeSelect(
    endpoint: string, query: string,
  ): Promise<SparqlSelectResult[]>;

}

type SparqlSelectResult = {
  [column: string]: {
    value: string,
  },
};

class DefaultSparqlService {

  async executeSelect(
    endpoint: string, query: string,
  ): Promise<SparqlSelectResult[]> {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "accept": "application/sparql-results+json,*/*;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: "query=" + encodeURI(query),
    });
    const content = await response.json();
    return content.results.bindings;
  }

}
