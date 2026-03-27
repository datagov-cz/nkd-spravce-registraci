
export function createRouteService(
  baseUrl: string, formsUrl: string,
): RouteService {
  return new DefaultRouteService(baseUrl, formsUrl);
}

export interface RouteService {

  dashboard(): string;

  /**
   * Use for route registration.
   */
  dashboardInternal(): string;

  createRegistrationCallback(): string;

  createRegistrationCallbackInternal(): string;

  registrationDetail(identifier: string): string;

  /**
   * Use for route registration.
   */
  registrationDetailInternal(): string;

  caaisLogout(): string;

  formsRegisterDataset(): string;

  formsRegisterCatalog(): string;

}

class DefaultRouteService implements RouteService {

  readonly baseUrl: string;

  readonly formsUrl: string;

  constructor(baseUrl: string, formsPublicBaseUrl: string) {
    this.baseUrl = asBase(baseUrl);
    this.formsUrl = asBase(formsPublicBaseUrl);
  }

  dashboard(): string {
    return this.baseUrl + this.dashboardInternal();
  }

  dashboardInternal(): string {
    return "/";
  }

  createRegistrationCallback(): string {
    return this.baseUrl + this.createRegistrationCallbackInternal();
  }

  createRegistrationCallbackInternal(): string {
    return "/vložit-registrační-záznam";
  }

  registrationDetail(identifier: string): string {
    return this.baseUrl + this.registrationDetailInternal()
      + "?identifikátor=" + encodeURIComponent(identifier);
  }

  registrationDetailInternal() {
    return "/detail-registračního-záznamu";
  }

  caaisLogout(): string {
    return "/caais/logout?redirect-url=/";
  }

  formsRegisterDataset(): string {
    return this.formsUrl + "/registrace-datové-sady?returnUrl="
      + encodeURIComponent(this.createRegistrationCallback());
  }

  formsRegisterCatalog(): string {
    return this.formsUrl + "/registrace-lokálního-katalogu?returnUrl="
      + encodeURIComponent(this.createRegistrationCallback());
  }

}

function asBase(url: string): string {
  if (url.endsWith("/")) {
    return url.substring(0, url.length - 1);
  } else {
    return url;
  }
}
