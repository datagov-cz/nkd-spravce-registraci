import { RouteService } from "../route";

export function HeaderNavigation({ state }: {
  state: HeaderNavigationState,
}) {
  return (
    <gov-nav wcag-label="Hlavní navigace">
      <gov-nav-item
        href={state.createRegistrationUrl}
        className={active(state.createRegistrationActive)}
      >
        Vložení registračního záznamu
      </gov-nav-item>
      <gov-nav-item
        href={state.listRegistrationUrl}
        className={active(state.listRegistrationActive)}
      >
        Přehled registračních záznamů
      </gov-nav-item>
    </gov-nav>
  )
}

function active(value?: boolean): string {
  if (value === true) {
    return "active";
  }
  return "";
}

export interface HeaderNavigationState {

  listRegistrationUrl: string;

  createRegistrationActive?: boolean;

  createRegistrationUrl: string;

  listRegistrationActive?: boolean;

}

export function createHeaderNavigationState(
  route: RouteService,
): HeaderNavigationState {
  return {
    listRegistrationUrl: route.listRegistration(),
    createRegistrationUrl: route.createRegistration(),
  }
}
