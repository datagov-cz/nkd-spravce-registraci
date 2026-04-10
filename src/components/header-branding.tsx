import { AuthenticationData } from "../authentication";
import { RouteService } from "../route";

const logoutStyle = {
  color: "var(--gov-nav-color, var(--gov-color-neutral-white))"
};

export function HeaderBranding({ state }: {
  state: HeaderBrandingState,
}) {
  return (
    <gov-branding>
      <h1 class="heading">
        Správce registrací národního katalogu otevřených dat
      </h1>
      <div style="align-items: center;">
        <div>
          {state.userName}
          <br />
          {state.organizationName}
        </div>
        <a href={state.logoutUrl} style={logoutStyle}>
          Odhlásit
        </a>
      </div>
    </gov-branding>
  )
}

export interface HeaderBrandingState {

  userName: string;

  organizationName: string;

  logoutUrl: string;

}

export function createHeaderBrandingState(
  route: RouteService,
  user: AuthenticationData,
): HeaderBrandingState {
  return {
    userName: `${user.familyName} ${user.givenName}`,
    organizationName: user.entity.name,
    logoutUrl: route.caaisLogout(),
  }
}
