
export function createAuthenticationService(
  requiredActivityRoleCode: string,
): AuthenticationService {
  return new HttpAuthentication(requiredActivityRoleCode);
}

export interface AuthenticationService {

  authenticateHttp(
    headers: { [name: string]: string | string[] | undefined },
  ): AuthenticationData | null;

}

export interface AuthenticationData {

  login: string;

  familyName: string;

  givenName: string;

  /**
   * True when user is authorized to work with this application.
   */
  isAuthorized: boolean;

  entity: {

    identifier: string;

    name: string;

  }

}

class HttpAuthentication implements AuthenticationService {

  private readonly headerName = "x-caais-token";

  private readonly requiredActivityRoleCode: string;

  constructor(requiredActivityRoleCode: string) {
    this.requiredActivityRoleCode = requiredActivityRoleCode;
  }

  authenticateHttp(
    headers: { [name: string]: string | string[] | undefined },
  ): AuthenticationData | null {
    let header = headers[this.headerName];
    if (header === undefined) {
      return null;
    }
    if (Array.isArray(header)) {
      header = header[0];
    }
    try {
      const payload = header.split(".")[1];
      const { user, entity } = this.parseJwt(payload);
      if (user === undefined || entity === undefined) {
        return null;
      }
      const isAuthorized = (user.activity_role_codes ?? [])
        .includes(this.requiredActivityRoleCode);
      return {
        login: user.username,
        givenName: user.given_name,
        familyName: user.family_name,
        isAuthorized,
        entity: {
          identifier: entity.public_identifier,
          name: entity.name,
        },
      }
    } catch (error) {
      return null;
    }
  }

  parseJwt(payload: string) {
    // TODO Add JWT validation.
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
  }

}

export function createMockAuthenticationService(): AuthenticationService {
  return {
    authenticateHttp() {
      return {
        login: "mock-login",
        givenName: "mock-given-name",
        familyName: "mock-family-name",
        isAuthorized: false,
        entity: {
          identifier: "70890692",
          name: "Moravskoslezský kraj",
        }
      } as AuthenticationData;
    },
  }
}
