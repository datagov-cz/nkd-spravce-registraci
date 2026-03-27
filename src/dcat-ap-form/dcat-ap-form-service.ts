
export function createDcatApFormService(formUrl: string): DcatApFormService {
  return new DefaultDcatApFormService(formUrl);
}

export interface DcatApFormService {

  fetchRegisterDatasetHtml(payload: object): Promise<string>;

  fetchWithdrawDatasetHtml(payload: object): Promise<string>;

  fetchRegisterCatalogHtml(payload: object): Promise<string>;

  fetchWithdrawCatalogHtml(payload: object): Promise<string>;

}

class DefaultDcatApFormService implements DcatApFormService {

  readonly formUrl: string;

  constructor(formUrl: string) {
    this.formUrl = formUrl;
  }

  fetchRegisterDatasetHtml(payload: object): Promise<string> {
    return this.proxyForm("/registrace-datové-sady", payload, "");
  }

  private async proxyForm(
    relativeUrl: string,
    payload: object,
    returnUrl: string,
  ): Promise<string> {
    const url = this.formUrl + relativeUrl;
    const encodedPayload = encodeURIComponent(JSON.stringify(payload));
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: "formData=" + encodedPayload +
        "&returnUrl=" + encodeURIComponent(returnUrl),
    });
    return await response.text();
  }

  fetchWithdrawDatasetHtml(payload: object): Promise<string> {
    return this.proxyForm("/odstranění-datové-sady", payload, "");
  }

  fetchRegisterCatalogHtml(payload: object): Promise<string> {
    return this.proxyForm("/registrace-lokálního-katalogu", payload, "");
  }

  fetchWithdrawCatalogHtml(payload: object): Promise<string> {
    return this.proxyForm("/odstranění-lokálního-katalogu", payload, "");
  }

}
