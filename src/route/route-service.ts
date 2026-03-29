
export function createRouteService(baseUrl: string): RouteService {
  return new RouteService(baseUrl);
}

export class RouteService {

  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = asBase(baseUrl);
  }

  listRegistration(): string {
    return this.baseUrl + this.listRegistrationInternal();
  }

  listRegistrationInternal(): string {
    return "/registrační-záznamy"
  }

  registrationDetail(identifier: string): string {
    return this.baseUrl + this.registrationDetailInternal()
      + "?identifikátor=" + encodeURIComponent(identifier);
  }

  registrationDetailInternal() {
    return "/detail-registračního-záznamu";
  }

  createRegistration(): string {
    return this.baseUrl + this.createRegistrationInternal();
  }

  createRegistrationInternal(): string {
    return "/vložení-registračního-záznamu";
  }

  caaisLogout(): string {
    return "/caais/logout?redirect-url=/";
  }

  registerDatasetForm(): string {
    return this.baseUrl + "/formulář/registrace-datové-sady?returnUrl="
      + encodeURIComponent(this.createRegistration());
  }

  registerCatalogForm(): string {
    return this.baseUrl + "/formulář/registrace-lokálního-katalogu?returnUrl="
      + encodeURIComponent(this.createRegistration());
  }

}

function asBase(url: string): string {
  if (url.endsWith("/")) {
    return url.substring(0, url.length - 1);
  } else {
    return url;
  }
}
